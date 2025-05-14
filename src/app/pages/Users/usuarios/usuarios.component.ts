import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {


  todosLosUsuarios: Usuario[] = []; // Aquí guardaremos TODOS los usuarios sin paginación
  usuariosFiltrados: Usuario[] = []; // nuevo array para el filtro de usuario
  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null;
  currentPage: number = 1;
  hasMoreUsers: boolean = true;

  filtroNombre: string = ''; // Nuevo filtro

  constructor(private usuariosSvc: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.loadTodosLosUsuarios();

  }

  loadTodosLosUsuarios(): void {
    this.usuariosSvc.getAllUsuarios().subscribe(response => {
      console.log('Todos los usuarios obtenidos:', response);
      this.todosLosUsuarios = response; // Guardamos todos los usuarios
      this.filtrarUsuarios(); // Aplicamos el filtro si ya hay texto en la búsqueda
    });
  }

  obtenerUsuarios(): void {
    this.usuariosSvc.getUsuariosPagination(this.currentPage).subscribe(response => {
      this.usuarios = response.usuarios;
      this.hasMoreUsers = response.hasMore;
    });
  }

  nextPage(): void {
    if (this.hasMoreUsers) {
      this.currentPage++;
      this.actualizarUsuariosPaginados(this.todosLosUsuarios);
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.actualizarUsuariosPaginados(this.todosLosUsuarios);
    }
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
  }

  editar(): void {
    if (!this.usuarioSeleccionado || !this.usuarioSeleccionado.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha seleccionado un usuario válido para editar.',
        confirmButtonColor: '#ffcc00',
        confirmButtonText: 'Entendido',
        background: '#222',
        color: '#ffcc00',
        iconColor: '#ffcc00'
      });
      return;
    }

    if (this.usuarioSeleccionado.name.trim().length === 0 || this.usuarioSeleccionado.email.trim().length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Vacíos',
        text: 'Por favor, complete todos los campos antes de guardar.',
        confirmButtonColor: '#ffcc00',
        confirmButtonText: 'Entendido',
        background: '#222',
        color: '#ffcc00',
        iconColor: '#ffcc00'
      });
      return;
    }

    this.usuariosSvc.actualizarUsuario(this.usuarioSeleccionado).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Usuario Actualizado Correctamente',
        confirmButtonText: 'ACEPTAR',
        confirmButtonColor: '#ffcc00',
        background: '#222',
        color: '#ffcc00',
        iconColor: '#ffcc00'
      }).then((result) => {
        if (result.value) {
          this.obtenerUsuarios();
        }
      });
    });
  }


  filtrarUsuarios(): void {
    console.log('Filtrando con:', this.filtroNombre);
  
    // Primero filtramos todos los usuarios
    let usuariosFiltradosTotal = this.todosLosUsuarios.filter(usuario => 
      usuario.name.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  
    // Luego aplicamos la paginación sobre los filtrados
    this.currentPage = 1; // Reiniciar a la primera página
    this.actualizarUsuariosPaginados(usuariosFiltradosTotal);
  }
  
  actualizarUsuariosPaginados(usuariosFiltradosTotal: Usuario[]): void {
    const usuariosPorPagina = 6; // Cambia esto según cuántos quieras mostrar por página
    const inicio = (this.currentPage - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
  
    this.usuariosFiltrados = usuariosFiltradosTotal.slice(inicio, fin);
    this.hasMoreUsers = fin < usuariosFiltradosTotal.length;
  }
  
}

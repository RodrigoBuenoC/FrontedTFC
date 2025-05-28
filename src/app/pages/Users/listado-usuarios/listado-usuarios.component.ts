import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent implements OnInit {


  todosLosUsuarios: Usuario[] = []; // Aquí guardaremos TODOS los usuarios sin paginación

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = []; // nuevo array para el filtro de usuario
  usuarioSeleccionado: Usuario | null = null;

  currentPage: number = 1;
  hasMoreUsers: boolean = true; // Indica si hay más usuarios para paginar


  filtroNombre: string = ''; // Nuevo filtro

  // Agregamos la propiedad usuario
  usuario: Usuario = {
    name: '',
    email: '',
    puntos: 0
  };
  constructor(private usuariosSvc: UsuariosService) { }

  ngOnInit(): void {
    this.loadUsuarios();
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



  loadUsuarios(): void {
    this.usuariosSvc.getUsuariosPagination(this.currentPage).subscribe(response => {
      console.log('Usuarios obtenidos:', response.usuarios);
      this.usuarios = response.usuarios; // Ahora 'usuarios' sí existe
      this.usuariosFiltrados = response.usuarios; // Inicialmente, igual al array completo
      this.hasMoreUsers = response.hasMore; // Verifica si hay más usuarios
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
          location.reload();
        }
      });
    });
  }



  guardar(): void {
    if (this.usuario.name.trim().length === 0 || this.usuario.email.trim().length === 0) {
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

    this.usuariosSvc.agregarUsuario(this.usuario).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Usuario Guardado Correctamente',
        confirmButtonText: 'ACEPTAR',
        confirmButtonColor: '#ffcc00',
        background: '#222',
        color: '#ffcc00',
        iconColor: '#ffcc00'
      }).then((result) => {
        if (result.value) {
          location.reload();
        }
      });
    });
  }

  eliminarUsuario(id: any) {
    Swal.fire({
      title: 'Desea eliminar Usuario?',
      background: '#222',
        color: '#ffcc00',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'

    }).then((result) => {

      if (result.isConfirmed) {
        this.usuariosSvc.eliminarUsuario(id).subscribe(res => {
          Swal.fire({

            icon: 'success',
            title: 'Usuario elminado Correctamente',
            background: '#222',
            color: '#ffcc00',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            location.reload();
          })
        })
      }
    })

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

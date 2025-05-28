import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Juego } from 'src/app/interfaces/juegos.interface';
import { Sesion } from 'src/app/interfaces/sesiones.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { JuegosService } from 'src/app/services/juegos.service';
import { SesionesService } from 'src/app/services/sesiones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-sesiones',
  templateUrl: './listado-sesiones.component.html',
  styleUrls: ['./listado-sesiones.component.css']
})
export class ListadoSesionesComponent implements OnInit {

  sesiones: Sesion[] = []; // Lista de sesiones de juego
  usuarios: Usuario[] = [];  // Lista de usuarios
  juegos: Juego[] = []; // Lista de juegos


  currentPage: number = 1;
  hasMoreSesiones: boolean = true;

  sesionSeleccionada: Sesion | null = null; // Nueva variable para almacenar la sesión seleccionada

  sesion: Sesion = {
    user_id: 0,
    game_id: 0,
    puntos_ganados: 0
  }

  constructor(
    private sesionesSvc: SesionesService, // Inyecta el servicio de sesiones
    private usuariosSvc: UsuariosService, // Inyecta el servicio de usuarios
    private juegosSvc: JuegosService // Inyecta el servicio de juegos
  ) { }

  ngOnInit(): void {
    this.loadSesiones();
    this.loadUsuariosYJuegos();
  }

  loadSesiones(): void {
    this.sesionesSvc.getSesionesPagination(this.currentPage).subscribe(response => {
      this.sesiones = response.sesiones;
      this.hasMoreSesiones = response.hasMore;
    });
  }

  loadUsuariosYJuegos(): void {
    forkJoin({
      usuarios: this.usuariosSvc.getAllUsuarios(),
      juegos: this.juegosSvc.getAllJuegos()
    }).subscribe(({ usuarios, juegos }) => {
      this.usuarios = usuarios;
      this.juegos = juegos;
    });
  }

  nextPage(): void {
    if (this.hasMoreSesiones) {
      this.currentPage++;
      this.loadSesiones();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadSesiones();
    }
  }


  // Obtiene el nombre de un usuario a partir de su ID
  getNombreUsuario(user_id: number): string {
    const usuario = this.usuarios.find(e => e.id === user_id);
    return usuario ? usuario.name : 'Desconocido';
  }
  // Obtiene el nombre de un juego a partir de su ID
  getNombreJuego(game_id: number): string {
    const juego = this.juegos.find(e => e.id === game_id);
    return juego ? juego.name : 'Desconocido';
  }

  guardar(): void {
    // Validar que todos los campos estén llenos
    if (!this.sesion.user_id || !this.sesion.game_id || !this.sesion.puntos_ganados) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Todos los campos son obligatorios.',
        confirmButtonColor: '#ffcc00',
        confirmButtonText: 'Entendido',
        background: '#222',
        color: '#ffcc00',
        iconColor: '#ffcc00'
      });
      return;
    }

    // Llamar al servicio para guardar la sesión
    this.sesionesSvc.agregarSesion(this.sesion).subscribe(response => {
      Swal.fire({
        icon: 'success',
        title: 'Sesión Guardada Correctamente',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ffcc00',
        background: '#000000', // Fondo negro
        color: '#FFD700',       // Texto dorado
        iconColor: '#ffcc00'
      }).then(() => {
        location.reload();
      });
    });
  }

  seleccionarSesion(sesion: Sesion): void {
    // Clonamos la sesión seleccionada para evitar modificar la lista directamente
    this.sesionSeleccionada = { ...sesion };
  }

  editarSesion(): void {
    if (!this.sesionSeleccionada) return;

    // Validar que todos los campos estén llenos
    if (!this.sesionSeleccionada.user_id || !this.sesionSeleccionada.game_id || !this.sesionSeleccionada.puntos_ganados) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Todos los campos son obligatorios.',
        confirmButtonColor: '#ffcc00',
        confirmButtonText: 'Entendido',
        background: '#000000', // Fondo negro
        color: '#FFD700',       // Texto dorado
        iconColor: '#ffcc00'
      });
      return;
    }

    this.sesionesSvc.actualizarSesion(this.sesionSeleccionada).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Sesión Actualizada Correctamente',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ffcc00',
        background: '#000000', // Fondo negro
        color: '#FFD700',       // Texto dorado
        iconColor: '#ffcc00'

      }).then(() => {
        location.reload();
      });
    });
  }

  eliminarSesion(id: any) {
    Swal.fire({
      title: 'Desea eliminar Sesion?',
      showCancelButton: true,
      background: '#000000', // Fondo negro
        color: '#FFD700',       // Texto dorado
      confirmButtonText: 'Eliminar'

    }).then((result) => {

      if (result.isConfirmed) {
        this.sesionesSvc.eliminarSesion(id).subscribe(res => {
          Swal.fire({
            icon: 'success',
            title: 'Sesion elminado Correctamente',
            confirmButtonText: 'Aceptar',
            background: '#000000', // Fondo negro
            color: '#FFD700',       // Texto dorado
          }).then((result) => {
            location.reload();
          })
        })
      }
    })

  }


}



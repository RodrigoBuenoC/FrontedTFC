import { Component, OnInit } from '@angular/core';
import { Juego } from 'src/app/interfaces/juegos.interface';
import { JuegosService } from 'src/app/services/juegos.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.css']
})
export class JuegosComponent implements OnInit {

  juegos:Juego[]=[]; // Almacenar los juegos obtenidos del servicio
  juegoSeleccionado: Juego | null = null;
  puntos: number = 0;

  constructor(private juegosSvc:JuegosService , private authService : AuthService) { } // Inyecta el servicio de juegos en el constructor

  ngOnInit(): void {

     // Al inicializar el componente, obtiene los juegos desde el servicio
    this.juegosSvc.getAllJuegos().subscribe(juegos=> this.juegos=juegos)
    this.obtenerPuntosUsuario(); 

  }

  obtenerPuntosUsuario() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUserPoints(userId).subscribe({
        next: (response) => {
          this.puntos = response.puntos;
        },
        error: (error) => {
          console.error('Error al obtener puntos:', error);
        }
      });
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated(); // Retorna si el usuario está autenticado
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMIN';
  }
  

  //seleciona juego
    seleccionarJuego(juego: Juego): void {
      this.juegoSeleccionado = { ...juego }; // Clona el juego seleccionado
    }


    //editar
    editar(): void {
        if (!this.juegoSeleccionado || !this.juegoSeleccionado.id) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se ha seleccionado un juego válido para editar.',
            confirmButtonColor: '#ffcc00',
            confirmButtonText: 'Entendido',
            background: '#222',
            color: '#ffcc00',
            iconColor: '#ffcc00'
          });
          return;
        }
      
        if (this.juegoSeleccionado.name.trim().length === 0 || this.juegoSeleccionado.descripcion.trim().length === 0) {
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
      
        this.juegosSvc.actualizarJuego(this.juegoSeleccionado).subscribe(res => {
          Swal.fire({
            icon: 'success',
            title: 'Juego Actualizado Correctamente',
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



      
    

}

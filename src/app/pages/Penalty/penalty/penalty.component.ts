import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-penalty',
  templateUrl: './penalty.component.html',
  styleUrls: ['./penalty.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PenaltyComponent implements OnInit {

  puntos: number = 0;
  apuesta: number = 5; // Puntos apostados por defecto
  dificultad: string = 'facil'; // Nivel de dificultad
  
  @ViewChild('goalkeeper') goalkeeper!: ElementRef;
  @ViewChild('ball') ball!: ElementRef;
  
  puedeTirar: boolean = true;

  posiciones: any = {
    'izquierda-baja': { left: '21%', bottom: '68px' },
    'izquierda-alta': { left: '21%', bottom: '210px' },
    'centro-alta': { left: '50%', bottom: '210px' },
    'derecha-baja': { left: '79%', bottom: '68px' },
    'derecha-alta': { left: '79%', bottom: '210px' }
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerPuntosUsuario();
    this.mostrarNotificacion();
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

  actualizarPuntosUsuario(nuevosPuntos: number) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.actualizarPuntos(userId, nuevosPuntos).subscribe({
        next: () => {
          this.puntos = nuevosPuntos;
        },
        error: (error) => {
          console.error('Error al actualizar los puntos:', error);
        }
      });
    }
  }

  tirarPenalti(direccionJugador: string) {
    if (!this.puedeTirar || this.puntos < this.apuesta) {
      Swal.fire({
        title: 'No tienes suficientes puntos',
        text: 'Apuesta una cantidad menor o gana más puntos.',
        icon: 'warning',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
  
    this.puedeTirar = false;
  
    // Probabilidad de atajada según dificultad
    let probabilidadAtajar = this.dificultad === 'facil' ? 0.4 : 
                          this.dificultad === 'medio' ? 0.6 : 
                          this.dificultad === 'dificil' ? 0.8 : 0.6;

    
    // Multiplicador de recompensa según dificultad
    let multiplicadorRecompensa = this.dificultad === 'facil' ? 1 : 
                              this.dificultad === 'medio' ? 2 : 
                              this.dificultad === 'dificil' ? 3 : 1;

  
    const direcciones = Object.keys(this.posiciones);
    let direccionPortero = Math.random() < probabilidadAtajar ? direccionJugador : 
      direcciones.filter(dir => dir !== direccionJugador)[Math.floor(Math.random() * 4)];
  
    // Mueve el portero y el balón
    this.goalkeeper.nativeElement.style.left = this.posiciones[direccionPortero].left;
    this.goalkeeper.nativeElement.style.bottom = this.posiciones[direccionPortero].bottom;
    this.ball.nativeElement.style.left = this.posiciones[direccionJugador].left;
    this.ball.nativeElement.style.bottom = this.posiciones[direccionJugador].bottom;
  
    setTimeout(() => {
      let puntosGanados = 0;
      if (direccionJugador === direccionPortero) {
        Swal.fire({
          title: '¡El portero atajó el tiro!',
          text: '¡Inténtalo de nuevo!',
          icon: 'error',
          showConfirmButton: false,
          timer: 2000
        });
        puntosGanados = -this.apuesta; // Puntos negativos (el jugador pierde los puntos apostados)
      } else {
        Swal.fire({
          title: '¡GOLAZO!',
          text: '¡Bien hecho!',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        });
        puntosGanados = this.apuesta * multiplicadorRecompensa;
      }
  
      this.actualizarPuntosUsuario(this.puntos + puntosGanados);
  
      // Aquí es donde deberías crear la sesión
      const userId = this.authService.getUserId();
      const gameId = 1; // Este es solo un ejemplo, debes obtener el id del juego si lo tienes en otro lado
  
      if (userId) {
        this.authService.createGameSession(userId, gameId, puntosGanados).subscribe({
          next: () => {
            console.log('Sesión de juego creada');
          },
          error: (error) => {
            console.error('Error al crear sesión:', error);
          }
        });
      }
  
      setTimeout(() => {
        this.resetearJuego();
      }, 2000);
  
    }, 1000);
  }
  

  resetearJuego() {
    this.goalkeeper.nativeElement.style.left = '50%';
    this.goalkeeper.nativeElement.style.bottom = '40px';
    this.ball.nativeElement.style.left = '50%';
    this.ball.nativeElement.style.bottom = '';
    this.puedeTirar = true;
  }

  cerrarNotificacion() {
    const notification = document.querySelector('.notification') as HTMLElement;
    notification.style.display = 'none';
  }

  mostrarNotificacion() {
    Swal.fire({
      title: '¡Bienvenido al juego!',
      text: 'Elige la dificultad y apuesta tus puntos para patear los penaltis. ¡Suerte!',
      icon: 'info', // Icono informativo
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#3085d6', // Color del botón
      background: '#333', // Fondo oscuro
      color: '#fff', // Color del texto
      backdrop: true, // Fondo que se oscurece cuando aparece la notificación
    });
  }
  
   ajustarApuesta(cambio: number) {
    if (this.apuesta + cambio >= 1 && this.apuesta + cambio <= this.puntos) {
      this.apuesta += cambio;
    }
  }
  
  
}

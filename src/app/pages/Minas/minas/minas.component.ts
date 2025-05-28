import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-minas',
  templateUrl: './minas.component.html',
  styleUrls: ['./minas.component.css']
})
export class MinasComponent implements OnInit {
  boardSize = 5;
  totalMines = 3;
  winnings = 0;
  revealedCells = 0;
  board: { mine: boolean, revealed: boolean }[] = [];
  gameOver = false;

   puntos = 0;
  apuesta = 0;
  gananciaActual = 0;
  apuestaColocada = false;
   WinSound = new Audio("/assets/Tic.mp3");
     loseSound = new Audio("/assets/Error.mp3");



  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.init();
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

  colocarApuesta() {
  if (this.apuesta <= 0) {
    Swal.fire({
          title: '¡Error!',
          text: 'Introduce apuesta válida',
          icon: 'error', // Icono informativo
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#3085d6', // Color del botón
          background: '#333', // Fondo oscuro
          color: '#fff', // Color del texto
          backdrop: true, // Fondo que se oscurece cuando aparece la notificación
        });
    return;
  }

  if (this.apuesta > this.puntos) {
   Swal.fire({
          title: '¡Error!',
          text: 'No tienes Puntos',
          icon: 'error', // Icono informativo
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#3085d6', // Color del botón
          background: '#333', // Fondo oscuro
          color: '#fff', // Color del texto
          backdrop: true, // Fondo que se oscurece cuando aparece la notificación
        });
    return;
  }

  this.puntos -= this.apuesta;
  this.actualizarPuntosUsuario(this.puntos);
  this.gananciaActual = 0;
  this.apuestaColocada = true;
  this.init(); // inicia el tablero
}
 

init() {
    this.winnings = 0;
    this.revealedCells = 0;
    this.gameOver = false;

    this.board = Array.from({ length: this.boardSize * this.boardSize }, () => ({
      mine: false,
      revealed: false
    }));

    // Colocar minas
    let placed = 0;
    while (placed < this.totalMines) {
      const i = Math.floor(Math.random() * this.board.length);
      if (!this.board[i].mine) {
        this.board[i].mine = true;
        placed++;
      }
    }
  }

revealCell(index: number) {
  const cell = this.board[index];
  if (this.gameOver || cell.revealed || !this.apuestaColocada) return;

  cell.revealed = true;

  if (cell.mine) {
    
     this.gananciaActual = -this.apuesta;// Pérdida total, pierdes apuesta
     this.loseSound.play();
     this.endGame();
  } else {
    this.revealedCells++;
    this.gananciaActual += this.apuesta * 2;
    this.WinSound.play();
  }
}


cashOut() {
  if (this.gameOver) return;

  if (this.gananciaActual > 0) {
    this.puntos += this.gananciaActual;
    this.actualizarPuntosUsuario(this.puntos);
  }

  this.endGame();
}



endGame() {
  this.gameOver = true;

  // Revelar todas las minas
  this.board.forEach(cell => {
    if (cell.mine) cell.revealed = true;
  });

  const userId = this.authService.getUserId();
  const gameId = 4;
  const puntosGanados = this.gananciaActual;

  if (userId) {
    this.authService.createGameSession(userId, gameId, puntosGanados).subscribe({
      next: () => {
        console.log('Sesión de juego creada con puntos: ', puntosGanados);
      },
      error: (error) => {
        console.error('Error al crear sesión:', error);
      }
    });
  }



  setTimeout(() => {
    this.reiniciarJuego();
  }, 2000);
}


  reiniciarJuego() {
  this.gananciaActual = 0;
  this.apuesta = 0;
  this.apuestaColocada = false;
  this.init();
  this.gameOver = false;
}


  
  mostrarNotificacion() {
      Swal.fire({
        title: '¡Bienvenido al juego!',
        text: 'Elige tu apuesta y pisa casillas  para ganar ! , si pulsas una casilla con bomba , estaras 💀',
        icon: 'info', // Icono informativo
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#3085d6', // Color del botón
        background: '#333', // Fondo oscuro
        color: '#fff', // Color del texto
        backdrop: true, // Fondo que se oscurece cuando aparece la notificación
      });
    }
}

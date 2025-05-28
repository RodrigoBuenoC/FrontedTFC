import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plinko',
  templateUrl: './plinko.component.html',
  styleUrls: ['./plinko.component.css']
})
export class PlinkoComponent implements AfterViewInit {
  @ViewChild('board') boardRef!: ElementRef<HTMLDivElement>;

  puntos: number = 0;
  apuesta = 3;
  readonly rows = 15;
  readonly slotValues = [ 4, 3, 5, 1, 2, 1, 4];
  readonly slotWidth = 34;
  readonly ballSize = 15;

  constructor(private renderer: Renderer2, private authService: AuthService) { }

  ngAfterViewInit(): void {
    this.obtenerPuntosUsuario();
    this.createBoard();
    this.mostrarNotificacion();
  }

  obtenerPuntosUsuario() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUserPoints(userId).subscribe({
        next: (res) => (this.puntos = res.puntos),
        error: (err) => console.error('Error al obtener puntos:', err)
      });
    }
  }

  actualizarPuntosUsuario(nuevosPuntos: number) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.actualizarPuntos(userId, nuevosPuntos).subscribe({
        next: () => (this.puntos = nuevosPuntos),
        error: (error) => console.error('Error al actualizar puntos:', error)
      });
    }
  }



  createBoard() {
    const board = this.boardRef.nativeElement;
    board.innerHTML = ''; // Limpiar el contenido de la tabla antes de recrear el tablero

    // Crear la pirámide de pegs
    for (let i = 0; i < this.rows; i++) {
      const row = this.renderer.createElement('div');
      this.renderer.addClass(row, 'row');
      for (let j = 0; j <= i; j++) {
        const peg = this.renderer.createElement('div');
        this.renderer.addClass(peg, 'peg');
        this.renderer.appendChild(row, peg);
      }
      this.renderer.appendChild(board, row);
    }

    // Crear la fila de los slots
    const slots = this.renderer.createElement('div');
    this.renderer.addClass(slots, 'row');
    this.renderer.setStyle(slots, 'marginTop', '20px');

    // Crear las casillas de los slots
    for (let i = 0; i < this.slotValues.length; i++) {
      const slot = this.renderer.createElement('div');
      this.renderer.addClass(slot, 'slot');
      slot.innerText = this.slotValues[i].toString();
      this.renderer.appendChild(slots, slot);
    }

    // Añadir los slots al tablero
    this.renderer.appendChild(board, slots);
  }

  dropBall() {
    if (this.puntos < this.apuesta) {
      Swal.fire({
        title: 'Sin puntos suficientes',
        text: 'Reduce la apuesta o gana más puntos.',
        icon: 'warning',
        timer: 2000
      });
      return;
    }

    // Restamos los puntos apostados
    this.puntos -= this.apuesta;

    // Obtener la referencia al tablero
    const board = this.boardRef.nativeElement;

    // Crear la bola
    const ball = this.renderer.createElement('div');
    this.renderer.addClass(ball, 'ball');
    this.renderer.setStyle(ball, 'top', '0px');
    this.renderer.setStyle(ball, 'left', `${board.clientWidth / 2 - this.ballSize / 2}px`);
    this.renderer.appendChild(board, ball);

    let leftOffset = board.clientWidth / 2;
    let position = 0;
    const moves = Array.from({ length: this.rows }, () =>
      Math.random() > 0.5 ? this.slotWidth / 2 : -this.slotWidth / 2
    );

    const interval = setInterval(() => {
      if (position < this.rows) {
        // Desplazamiento horizontal en cada paso
        leftOffset += moves[position];
        this.renderer.setStyle(ball, 'left', `${leftOffset}px`);

        // Desplazamiento vertical
        this.renderer.setStyle(ball, 'top', `${position * 30 + 30}px`);
        position++;
      } else {
        clearInterval(interval);

        // Calcular el centro de la bola
        const ballCenter = leftOffset + this.ballSize / 2;

        // Calcular el inicio (en píxeles) del primer slot
        const slotStart = (board.clientWidth - (this.slotValues.length * this.slotWidth)) / 2;

        // Determinar el índice del slot más cercano
        let slotIndex = Math.floor((ballCenter - slotStart) / this.slotWidth);

        // Limitar el índice dentro del rango
        slotIndex = Math.max(0, Math.min(this.slotValues.length - 1, slotIndex));

        slotIndex = Math.max(0, Math.min(this.slotValues.length - 1, slotIndex)); // Asegurarse de que el índice esté dentro de los límites

        const puntosGanados = this.slotValues[slotIndex];

        // Actualizar puntos
        this.actualizarPuntosUsuario(this.puntos + puntosGanados);

        // Crear sesión de juego
        const userId = this.authService.getUserId();
        const gameId = 2; // ID del juego Plinko

        if (userId) {
          this.authService.createGameSession(userId, gameId, puntosGanados).subscribe({
            next: () => console.log(''),
            error: (err) => console.error('Error al crear sesión:', err)
          });
        }

        setTimeout(() => {
          // Eliminar la bola después de que haya caído
          ball.remove();
        }, 800);
      }
    }, 200); // Intervalo de 150 ms entre cada movimiento
  }


  mostrarNotificacion() {
    Swal.fire({
      title: '¡Bienvenido a Plinko!',
      text: 'Tira todas las bolas que quieras y deja que la suerte decida tu destino ',
      icon: 'info',
      confirmButtonText: 'Entendido',
      background: '#222',
      color: '#ffcc00'
    });
  }
}

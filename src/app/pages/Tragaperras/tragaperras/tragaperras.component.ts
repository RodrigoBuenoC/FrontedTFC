import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tragaperras',
  templateUrl: './tragaperras.component.html',
  styleUrls: ['./tragaperras.component.css']
})
export class TragaperrasComponent implements OnInit {
  simbolos = ["🍒", "🍋", "🍊", "🍉", "🔔", "⭐", "7️⃣"];
  multiplicadores: { [clave: string]: number } = {
    "🍒": 2,
    "🍋": 3,
    "🍊": 4,
    "🍉": 5,
    "🔔": 6,
    "⭐": 7,
    "7️⃣": 10
  };

  puntos = 0;
  apuesta = 10;
  casillas: string[] = ["🍊", "🍒", "🍊", "🍒", "🍊", "🍒", "🍋", "🍊", "🍒"];
  mensajeResultado = "";
  girarDesactivado = false;
  indicesGanadores: number[] = [];

  winsound = new Audio("/assets/EFECTOS DE SONIDO CASINO TRAGAMONEDAS MAQUINA TRAGAPERRAS.mp3");
  losesound = new Audio("/assets/Error.mp3");

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.obtenerPuntosUsuario();
    this.mostrarBienvenida();
  }

  obtenerPuntosUsuario() {
    const usuarioId = this.authService.getUserId();
    if (usuarioId) {
      this.authService.getUserPoints(usuarioId).subscribe({
        next: (resp) => this.puntos = resp.puntos,
        error: () => Swal.fire('Error', 'No se pudieron cargar tus puntos.', 'error')
      });
    }
  }

  actualizarPuntos(nuevosPuntos: number) {
    const usuarioId = this.authService.getUserId();
    if (usuarioId) {
      this.authService.actualizarPuntos(usuarioId, nuevosPuntos).subscribe({
        next: () => this.puntos = nuevosPuntos,
        error: () => Swal.fire('Error', 'No se pudieron actualizar los puntos.', 'error')
      });
    }
  }

  async girar() {
    if (isNaN(this.apuesta) || this.apuesta < 1) {
      this.mensajeResultado = "❌ Ingresa una apuesta válida.";
      this.losesound.play();
      return;
    }
    if (this.puntos < this.apuesta) {
      this.mensajeResultado = "❌ No tienes suficientes puntos para apostar.";
      return;
    }

    this.puntos -= this.apuesta;
    this.actualizarPuntos(this.puntos);

    this.girarDesactivado = true;
    this.indicesGanadores = [];

    const simbolosFinales = await Promise.all(
      this.casillas.map((_, i) => this.animarCasilla(i, 80))
    );
    this.casillas = simbolosFinales;

    const combinacionesGanadoras = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    let hayGanancia = false;
    let totalGanado = 0;
    const indicesAResaltar: number[] = [];

    for (const [a, b, c] of combinacionesGanadoras) {
      if (simbolosFinales[a] === simbolosFinales[b] && simbolosFinales[b] === simbolosFinales[c]) {
        const simbolo = simbolosFinales[a];
        const multiplicador = this.multiplicadores[simbolo] || 1;
        const ganancia = multiplicador * this.apuesta;
        totalGanado += ganancia;
        indicesAResaltar.push(a, b, c);
        hayGanancia = true;
      }
    }

    if (hayGanancia) {
      this.indicesGanadores = indicesAResaltar;
      this.puntos += totalGanado;
      await this.actualizarPuntos(this.puntos);
      this.mensajeResultado = `¡Ganaste ${totalGanado} puntos!`;
      this.winsound.play();
    } else {
     
      this.losesound.play();
    }

    const usuarioId = this.authService.getUserId();
    const idJuego = 3; // ID correspondiente al tragaperras
    const puntosGanados = totalGanado - this.apuesta;

    if (usuarioId) {
      this.authService.createGameSession(usuarioId, idJuego, puntosGanados).subscribe({
        next: () => console.log('Sesión registrada correctamente'),
        error: (err) => console.error('Error al registrar sesión:', err)
      });
    }

    setTimeout(() => this.indicesGanadores = [], 1500);
    this.girarDesactivado = false;
  }

  animarCasilla(indice: number, delay: number): Promise<string> {
    return new Promise(resolve => {
      let contador = 0;
      const limite = 15 + Math.floor(Math.random() * 10);
      const intervalo = setInterval(() => {
        this.casillas[indice] = this.simboloAleatorio();
        contador++;
        if (contador >= limite) {
          clearInterval(intervalo);
          resolve(this.casillas[indice]);
        }
      }, delay);
    });
  }

  simboloAleatorio() {
    return this.simbolos[Math.floor(Math.random() * this.simbolos.length)];
  }

  descripcionSimbolo(simbolo: string): string {
    switch (simbolo) {
      case "🍒": return "3 cerezas";
      case "🍋": return "3 limones";
      case "🍊": return "3 naranjas";
      case "🍉": return "3 sandías";
      case "🔔": return "3 campanas";
      case "⭐": return "3 estrellas";
      case "7️⃣": return "3 sietes";
      default: return "";
    }
  }

  mostrarBienvenida() {
    Swal.fire({
      title: '¡Bienvenido!',
      text: 'Apuesta puntos y haz girar los rodillos para ganar. ¡Buena suerte!',
      icon: 'info',
      confirmButtonText: 'Comenzar',
      confirmButtonColor: '#3085d6',
      background: '#333',
      color: '#fff',
      backdrop: true
    });
  }
}

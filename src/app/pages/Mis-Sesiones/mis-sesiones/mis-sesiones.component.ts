import { Component, OnInit } from '@angular/core';
import { SesionesService } from 'src/app/services/sesiones.service';
import { JuegosService } from 'src/app/services/juegos.service';
import { Juego } from 'src/app/interfaces/juegos.interface';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-mis-sesiones',
  templateUrl: './mis-sesiones.component.html',
  styleUrls: ['./mis-sesiones.component.css']
})
export class MisSesionesComponent implements OnInit {
  sessions: any[] = [];
  totalPoints: number = 0;
  juegos: Juego[] = [];
  totalSessions: number = 0;
  pageSize: number = 5; // Número de sesiones por página
  currentPage: number = 1; // Página actual
  totalPages: number = 0; // Total de páginas
  paginatedSessions: any[] = []; // Sesiones que se muestran en la página actual

  constructor(
    private sesionesService: SesionesService,
    private juegosService: JuegosService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      Swal.fire({
        title: 'No has iniciado sesión',
        text: 'Para ver tus sesiones, debes iniciar sesión o registrarte.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ir a Iniciar Sesión',
        cancelButtonText: 'Registrarse',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#007bff'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        } else if (result.isDismissed) {
          this.router.navigate(['/register']);
        }
      });
    } else {
      this.getSessions(); // Obtener las sesiones si está autenticado
    }
  }

  getSessions(): void {
    forkJoin({
      sessions: this.sesionesService.getMySessions(),
      juegos: this.juegosService.getAllJuegos()
    }).subscribe(
      ({ sessions, juegos }) => {
        this.sessions = sessions.sessions;
        this.juegos = juegos;

        // Ordenar las sesiones por fecha en orden descendente
        this.sessions = this.sessions
          .sort((a: any, b: any) => new Date(b.fecha_sesion).getTime() - new Date(a.fecha_sesion).getTime()) // orden descendente por fecha
          .map(session => ({
            ...session,
            gameName: this.getNombreJuego(session.game_id) // Agregar el nombre del juego
          }));

        // Actualizamos los puntos totales
        this.totalPoints = sessions.puntos_totales;

        this.totalSessions = this.sessions.length; // Número total de sesiones

        // Calculamos el número total de páginas
        this.totalPages = Math.ceil(this.totalSessions / this.pageSize);

        // Actualizamos las sesiones de la página actual
        this.updatePaginatedSessions();
      },
      (error) => {
        console.error('Error al obtener las sesiones', error);
      }
    );
  }

  // Método para obtener el nombre del juego a partir del game_id
  getNombreJuego(game_id: number): string {
    const juego = this.juegos.find(e => e.id === game_id);
    return juego ? juego.name : 'Desconocido'; // Si no encontramos el juego, retornamos 'Desconocido'
  }

  // Actualizamos las sesiones a mostrar según la página actual
  updatePaginatedSessions(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSessions = this.sessions.slice(startIndex, endIndex);
  }

  // Método para cambiar a la página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedSessions();
    }
  }

  // Método para cambiar a la siguiente página
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedSessions();
    }
  }

  descargarPDF(): void {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);
    doc.text('Mis Sesiones de Juego', 14, 22);

    // Datos de la tabla
    const data = this.sessions.map(s => [
      s.fecha_sesion,
      s.gameName,
      s.puntos_ganados
    ]);

    // Crear la tabla
    autoTable(doc, {
      startY: 30,
      head: [['Fecha', 'Juego', 'Puntos Ganados']],
      body: data,
    });

    // Agregar total de puntos al final
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text(`Beneficio Total: ${this.totalPoints}`, 14, finalY + 10);

    // Guardar el PDF
    doc.save('mis-sesiones.pdf');
  }

}

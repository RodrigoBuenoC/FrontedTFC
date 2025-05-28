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




      
    

}

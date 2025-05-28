import { Component, OnInit } from '@angular/core';
import { Juego } from 'src/app/interfaces/juegos.interface';
import { Sesion } from 'src/app/interfaces/sesiones.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { JuegosService } from 'src/app/services/juegos.service';
import { SesionesService } from 'src/app/services/sesiones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sesiones',
  templateUrl: './sesiones.component.html',
  styleUrls: ['./sesiones.component.css']
})
export class SesionesComponent implements OnInit {

  sesiones: Sesion[] = []; // Lista de sesiones de juego
  usuarios: Usuario[] = [];  // Lista de usuarios
  juegos: Juego[] = []; // Lista de juegos


  currentPage: number = 1;
  hasMoreSesiones: boolean = true;


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

  getNombreUsuario(user_id: number): string {
    const usuario = this.usuarios.find(e => e.id === user_id);
    return usuario ? usuario.name : 'Desconocido';
  }

  getNombreJuego(game_id: number): string {
    const juego = this.juegos.find(e => e.id === game_id);
    return juego ? juego.name : 'Desconocido';
  }
}

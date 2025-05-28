import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuarios.interface';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  usuariosOrdenados: Usuario[] = [];
  top5Usuarios: Usuario[] = [];
  usuarioActual: Usuario | null = null;
  posicionUsuarioActual: number | null = null;

  constructor(
    private usuariosSvc: UsuariosService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.usuariosSvc.getAllUsuarios().subscribe(usuarios => {
      // Ordenar de mayor a menor por puntos
this.usuariosOrdenados = usuarios.sort((a: Usuario, b: Usuario) => b.puntos - a.puntos);

      // Obtener el top 5
      this.top5Usuarios = this.usuariosOrdenados.slice(0, 5);

      const idActual = this.authSvc.getUserId();

      // Buscar al usuario actual
      const index = this.usuariosOrdenados.findIndex(u => u.id === idActual);
      if (index !== -1) {
        this.usuarioActual = this.usuariosOrdenados[index];
        this.posicionUsuarioActual = index + 1; // posición humana (no índice)
      }
    });
  }
}

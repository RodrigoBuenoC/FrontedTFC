import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuario!: Usuario;

  constructor(
    private usuariosSvc: UsuariosService, 
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.usuariosSvc.getUsuarioId(id).subscribe({
        next: (res) => {
          this.usuario = res;
          console.log('Usuario obtenido:', res);
        },
        error: (err) => {
          console.error('Error al obtener usuario:', err);
        }
      });
    });
  }
}

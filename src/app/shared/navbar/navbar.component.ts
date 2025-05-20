import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false; //  Controla si el usuario está autenticadoç
  isRegisterIn = false;
  userRole: string | null = null;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.authState$.subscribe((isAuth) => {
      this.isLoggedIn = isAuth; //  Se actualiza cuando cambia el estado de autenticación
      this.userRole = this.authService.getUserRole();
    });
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión? ',
      text: 'Estás a punto de salir de tu cuenta.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#007bff',
      confirmButtonText: 'Sí, salir ',
      cancelButtonText: 'No, quedarme '
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.userRole = null;

        Swal.fire({
          title: '¡Hasta pronto!',
          text: 'Has cerrado sesión exitosamente.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

}

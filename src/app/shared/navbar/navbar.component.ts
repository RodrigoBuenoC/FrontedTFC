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
    title: '¿Cerrar sesión?',
    text: 'Estás a punto de salir de tu cuenta.',
    icon: 'question',
    background: '#000000', // Fondo negro
    color: '#FFD700',       // Texto dorado
    showCancelButton: true,
    confirmButtonColor: '#28a745', // Verde brillante
    cancelButtonColor: '#C21807',  // Rojo intenso tipo casino
    confirmButtonText: ' Sí, salir',
    cancelButtonText: ' No, quedarme'
  }).then((result) => {
    if (result.isConfirmed) {
      this.authService.logout();
      this.userRole = null;

      Swal.fire({
        title: '¡Hasta pronto!',
        text: 'Has cerrado sesión exitosamente.',
        background: '#000000', // Fondo negro
        color: '#FFD700',       // Texto dorado
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}


}

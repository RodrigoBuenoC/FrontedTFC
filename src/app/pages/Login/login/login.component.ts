import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; 
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
   // Propiedades para almacenar el email y la contraseña ingresados por el usuario
  email = '';
  password = '';

  // Inyecta los servicios de autenticación y enrutamiento en el constructor
  constructor(private authService: AuthService, private router: Router) { } 


  // Método para iniciar sesión
  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Si el inicio de sesión es exitoso, muestra una alerta de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Inicio de sesión exitoso.',
          timer: 2000,
          showConfirmButton: false
        });
         // Redirige al usuario a la página de juegos después de iniciar sesión
        this.router.navigate(['/juegos']); 
      },
      error: () => {
        // Si el inicio de sesión falla, muestra una alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales incorrectas. Intenta de nuevo.',
          confirmButtonColor: '#ffcc00'
        });
      }
    });
  }
  
 
}

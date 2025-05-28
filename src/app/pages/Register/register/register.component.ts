import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  password_confirmation = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    // Validación: nombre
    if (!this.name.trim() || this.name.length < 3) {
      Swal.fire({
        title: 'Nombre inválido',
        text: 'El nombre debe tener al menos 3 caracteres.',
        icon: 'warning',
        background: '#000000', // Fondo negro
        color: '#FFD700',       // Texto dorado
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // Validación: email simple 
    if (!this.email.includes('@') || !this.email.includes('.')) {
      Swal.fire({
        title: 'Email inválido',
        text: 'Por favor ingresa un email válido.',
        icon: 'warning',
        background: '#000000', // Fondo negro
        color: '#FFD700',       // Texto dorado
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // Validación: contraseña mínima
    if (this.password.length < 6) {
      Swal.fire({
        title: 'Contraseña débil',
        text: 'La contraseña debe tener al menos 6 caracteres.',
        icon: 'warning',
        background: '#000000', // Fondo negro
        color: '#FFD700',       // Texto dorado
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // Validación: confirmación
    if (this.password !== this.password_confirmation) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        background: '#000000', // Fondo negro
        color: '#FFD700',       // Texto dorado
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // Si pasa todas las validaciones
    this.authService.register(this.name, this.email, this.password, this.password_confirmation)
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Revisa su correo',
            text: 'Revisa tu correo para confirmar cuenta.',
            icon: 'success',
            background: '#000000', // Fondo negro
            color: '#FFD700',       // Texto dorado
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error en el Registro',
            text: err.error.message || 'Ocurrió un error al registrarse.',
            icon: 'error',
            background: '#000000', // Fondo negro
            color: '#FFD700',       // Texto dorado
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      });
  }
}  
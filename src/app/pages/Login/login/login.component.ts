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
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { } 

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        const userId = this.authService.getUserId();

        if (userId) {
          // Clave única para cada usuario
          const key = `lastLoginBonus_${userId}`;
          const lastBonus = localStorage.getItem(key);
          const ahora = new Date().getTime();
          const veinticuatroHorasEnMs = 24 * 60 * 60 * 1000;

          if (!lastBonus || ahora - parseInt(lastBonus) >= veinticuatroHorasEnMs) {
            this.authService.getUserPoints(userId).subscribe({
              next: (res) => {
                const nuevosPuntos = res.puntos + 100;

                this.authService.actualizarPuntos(userId, nuevosPuntos).subscribe({
                  next: () => {
                    localStorage.setItem(key, ahora.toString());

                    Swal.fire({
                      icon: 'success',
                      title: '¡Bienvenido!',
                      text: 'Has recibido 100 puntos por iniciar sesión 🎉',
                      confirmButtonColor: '#FFD700',
                      background: '#000',
                      color: '#FFD700'
                    });

                    this.router.navigate(['/juegos']);
                  },
                  error: (err) => {
                    console.error('Error al actualizar puntos:', err);
                  }
                });
              },
              error: (err) => {
                console.error('Error al obtener puntos:', err);
              }
            });
          } else {
            const siguienteBonus = new Date(parseInt(lastBonus) + veinticuatroHorasEnMs);
            Swal.fire({
              icon: 'info',
              title: 'Bonus ya reclamado',
              html: `Puedes volver a recibir puntos después de:<br><strong>${siguienteBonus.toLocaleString()}</strong>`,
              confirmButtonColor: '#FFD700',
              background: '#000',
              color: '#FFD700'
            });

            this.router.navigate(['/juegos']);
          }
        } else {
          console.warn('No se encontró el ID del usuario');
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales incorrectas. Intenta de nuevo.',
          confirmButtonColor: '#FFD700',
          background: '#000000',
          color: '#FFD700'
        });
      }
    });
  }
}

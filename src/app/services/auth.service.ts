import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'http://localhost:8000/api'; // URL base de la API
    private apiUrl = 'https://laravel.dawrodrigo.duckdns.org/api'; // URL base de la API
  private authState = new BehaviorSubject<boolean>(this.hasToken());  // Estado de autenticación
  authState$ = this.authState.asObservable();  // Observable del estado de autenticación

  constructor(private http: HttpClient, private router: Router) {}

  // Verifica si existe un token en el localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token'); 
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        // Guarda el token y el rol del usuario en localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user_role', response.user.role);
        localStorage.setItem('user_id', response.user.id.toString()); // Convertimos el ID a string
        this.authState.next(true); // Actualiza el estado de autenticación
      })
    );
  }

  // Método para cerrar sesión
  logout() {
    // Elimina los datos del usuario del almacenamiento local
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id'); // Eliminamos el ID del usuario
    this.authState.next(false); // Notifica que el usuario ha cerrado sesión
    this.router.navigate(['/juegos']); // Redirige a la página de jeugos
  }

  // Obtiene el token almacenado
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Obtiene el rol del usuario almacenado
  getUserRole(): string | null {
    return localStorage.getItem('user_role') || null;
  }

  // Obtiene el ID del usuario almacenado
  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? Number(userId) : null; // Convertimos a número si existe
  }

  //obtiene los puntos del User Id
  getUserPoints(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/puntos/${userId}`);
  }

  //actualizar puntos
  actualizarPuntos(userId: number, nuevosPuntos: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/puntos/${userId}`, { puntos: nuevosPuntos });
  }
  
  

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.authState.value; //  Retorna el estado actualizado
  }

  // Registrar usuario
  register(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { 
      name, 
      email, 
      password, 
      password_confirmation 
    }).pipe(
      tap((response: any) => {
        // Guardamos el token y el usuario registrado en el localStorage
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('user_role', response.user.role);
        localStorage.setItem('user_id', response.user.id.toString()); // Convertimos a string
        this.authState.next(true); // Notificamos que el usuario está autenticado
      }),
      catchError(error => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Error al registrar usuario.'));
      })
    );
  }

  // Crear Sesion de juego
createGameSession(userId: number, gameId: number, puntosGanados: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/sesiones`, {
    user_id: userId,
    game_id: gameId,
    puntos_ganados: puntosGanados
  });
}



}

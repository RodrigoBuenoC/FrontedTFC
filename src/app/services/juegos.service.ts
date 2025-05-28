import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Juego } from '../interfaces/juegos.interface';

@Injectable({
  providedIn: 'root'
})
export class JuegosService {
  //private apiUrl = `http://localhost:8000/api/juegos`;
   private apiUrl = `https://laravel.dawrodrigo.duckdns.org/api/juegos`;


  constructor(private http: HttpClient) {}

   // Método para obtener todos los juegos
  getAllJuegos(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

   // Método para obtener un juego específico por su ID
  getJuegoId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  //Crear Juego
  agregarJuego(juego:Juego):Observable<Juego>{
  
      return this.http.post<Juego>(`${this.apiUrl}`,juego);
    }

    //Editar Juego
    actualizarJuego(juego:Juego):Observable<Juego>{
      return this.http.put<Juego>(`${this.apiUrl}/${juego.id}`,juego)
    }

    //Eliminar Juego
     eliminarJuego(id:number):Observable<Juego>{
       return this.http.delete<Juego>(`${this.apiUrl}/${id}`)
     }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Sesion } from '../interfaces/sesiones.interface';


@Injectable({
  providedIn: 'root'
})
export class SesionesService {
//private apiUrl = `http://localhost:8000/api/sesiones`;
 //private apiUrl2 = `http://localhost:8000/api/mis-sesiones`;
  private limit = 6; // Cantidad de sesiones por página
   private apiUrl = `https://laravel.dawrodrigo.duckdns.org/api/sesiones`;
   private apiUrl2 = `https://laravel.dawrodrigo.duckdns.org/api/mis-sesiones`;


  constructor(private http: HttpClient) { }

   // Método para obtener todos las sesiones
  getAllSesiones(): Observable<any> {
      return this.http.get(`${this.apiUrl}`);
    }
  
     // Método para obtener sesion específico por su ID
    getSesionesId(id: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/${id}`);
    }

    //Crear Sesion
      agregarSesion(sesion:Sesion):Observable<Sesion>{
    
        return this.http.post<Sesion>(`${this.apiUrl}`,sesion);
      }

      //Editar Sesion
        actualizarSesion(sesion:Sesion):Observable<Sesion>{
          return this.http.put<Sesion>(`${this.apiUrl}/${sesion.id}`,sesion)
        }

      //Eliminar Sesion
      eliminarSesion(id:number):Observable<Sesion>{
        return this.http.delete<Sesion>(`${this.apiUrl}/${id}`)
      }


      //Ver mis sesiones
      getMySessions(): Observable<any> {
        return this.http.get<any>(this.apiUrl2);
      }


        // Método para obtener todas las sesiones con paginación
  getSesionesPagination(page: number): Observable<{ sesiones: Sesion[], hasMore: boolean }> {
    const startIndex = (page - 1) * this.limit;
    return this.http.get<Sesion[]>(this.apiUrl).pipe(
      map(sesiones => {
        const paginatedSesiones = sesiones.slice(startIndex, startIndex + this.limit);
        const hasMore = sesiones.length > startIndex + this.limit;
        return { sesiones: paginatedSesiones, hasMore };
      })
    );
  }
      
}

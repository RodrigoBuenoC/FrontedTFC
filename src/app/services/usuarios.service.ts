import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuarios.interface';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

 public page = 1;
 private limit = 6; 

  //private apiUrl = `http://localhost:8000/api/usuarios`;
 private apiUrl = `https://laravel.dawrodrigo.duckdns.org/api/usuarios`;


  constructor(private http: HttpClient) {}

  // listar usuarios
  getAllUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }


    // Método con paginación
  getUsuariosPagination(page: number): Observable<{ usuarios: Usuario[], hasMore: boolean }> {
    const startIndex = (page - 1) * this.limit;
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map(usuarios => {
        const paginatedUsers = usuarios.slice(startIndex, startIndex + this.limit);
        const hasMore = usuarios.length > startIndex + this.limit; // Verifica si hay más usuarios
        return { usuarios: paginatedUsers, hasMore }; // Devuelve un objeto con usuarios y hasMore
      })
    );
  }
  


  // ver usuario
  getUsuarioId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }


  //Crear Usuario
  agregarUsuario(usuario:Usuario):Observable<Usuario>{

    return this.http.post<Usuario>(`${this.apiUrl}`,usuario);
  }

  //Editar Usuario
  actualizarUsuario(usuario:Usuario):Observable<Usuario>{
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`,usuario)
  }

  //Eliminar Usuario
  eliminarUsuario(id:number):Observable<Usuario>{
    return this.http.delete<Usuario>(`${this.apiUrl}/${id}`)
  }
  

  
}

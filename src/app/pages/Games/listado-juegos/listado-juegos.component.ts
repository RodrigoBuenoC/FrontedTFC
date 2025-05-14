import { Component, OnInit } from '@angular/core';
import { Juego } from 'src/app/interfaces/juegos.interface';
import { AuthService } from 'src/app/services/auth.service';
import { JuegosService } from 'src/app/services/juegos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-juegos',
  templateUrl: './listado-juegos.component.html',
  styleUrls: ['./listado-juegos.component.css']
})
export class ListadoJuegosComponent implements OnInit {

   juegos:Juego[]=[]; // Almacenar los juegos obtenidos del servicio
  juego: Juego ={
    name: '',
    descripcion: ''
  };
  constructor(private juegosSvc:JuegosService , private authService : AuthService) { }

  ngOnInit(): void {

    // Al inicializar el componente, obtiene los juegos desde el servicio
   this.juegosSvc.getAllJuegos().subscribe(juegos=> this.juegos=juegos)
 }
 isAuthenticated(): boolean {
  return this.authService.isAuthenticated(); // Retorna si el usuario está autenticado
}
//guardar juego
guardar(){

    if(this.juego.name.trim().length === 0){
      return;
    }
    this.juegosSvc.agregarJuego(this.juego).subscribe(res=>{
      Swal.fire({
        icon:'success',
        title:'Juego Guardado Correctamente',
        confirmButtonText: 'ACEPTAR'
      }).then((result)=>{
        if (result.value){
          location.reload();
        }
      })
    })
    
  }

  //Eliminar Juego
  eliminarJuego(id:any){
      Swal.fire({
        title:'Desea eliminar Juego?',
        showCancelButton:true,
        confirmButtonText:'Eliminar'
      
      }).then((result)=>{
  
        if(result.isConfirmed){
          this.juegosSvc.eliminarJuego(id).subscribe(res =>{
            Swal.fire({
  
              icon:'success',
              title:'Juego elminado Correctamente',
              confirmButtonText: 'Aceptar',
            }).then ((result)=>{
              location.reload();
            })
          })
        }
      })
  
    }
}

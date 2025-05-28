import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sesion } from 'src/app/interfaces/sesiones.interface';
import { SesionesService } from 'src/app/services/sesiones.service';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionComponent implements OnInit {

  sesion!:Sesion  // Propiedad que almacenará la sesión obtenida

   // Inyecta el servicio de sesiones y ActivatedRoute en el constructor
  constructor(private sesionesSvc:SesionesService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {

     
    this.activatedRoute.params.subscribe(({id})=>{

      // Llama al servicio para obtener la sesión con el ID proporcionado
      this.sesionesSvc.getSesionesId(id).subscribe(res=>{

        this.sesion=res; // Asigna la sesión obtenida a la propiedad 'sesion'

        

      })

    })
  }

}

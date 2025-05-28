import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Juego } from 'src/app/interfaces/juegos.interface';
import { JuegosService } from 'src/app/services/juegos.service';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {


  juego!:Juego 

  constructor(private juegosSvc:JuegosService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {this.activatedRoute.params.subscribe(({id})=>{

    this.juegosSvc.getJuegoId(id).subscribe(res=>{

      this.juego=res;

      

    })

  })
}

}


import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './pages/Users/usuarios/usuarios.component';
import { ListadoUsuariosComponent } from './pages/Users/listado-usuarios/listado-usuarios.component';
import { UsuarioComponent } from './pages/Users/usuario/usuario.component';

import { JuegosComponent } from './pages/Games/juegos/juegos.component';
import { ListadoJuegosComponent } from './pages/Games/listado-juegos/listado-juegos.component';
import { JuegoComponent } from './pages/Games/juego/juego.component';
import { SesionesComponent } from './pages/Sessions/sesiones/sesiones.component';
import { ListadoSesionesComponent } from './pages/Sessions/listado-sesiones/listado-sesiones.component';
import { SesionComponent } from './pages/Sessions/sesion/sesion.component';
import { MainComponent } from './pages/Main/main/main.component';
import { LoginComponent } from './pages/Login/login/login.component';
import { RegisterComponent } from './pages/Register/register/register.component';
import { PenaltyComponent } from './pages/Penalty/penalty/penalty.component';
import { MisSesionesComponent } from './pages/Mis-Sesiones/mis-sesiones/mis-sesiones.component';
import { PlinkoComponent } from './pages/plinko/plinko.component';




const routes: Routes = [

  // Ruta para el login
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},

  // Ruta para la página principal
  {path:'main',component:MainComponent},

 
 // Rutas relacionadas con usuarios
  {path:'usuarios' , component:UsuariosComponent},
  {path:'listado-usuarios' , component:ListadoUsuariosComponent},
  {path:'usuarios/:id' , component:UsuarioComponent},

  // Rutas relacionadas con juegos
  {path:'juegos' , component:JuegosComponent},
  {path:'listado-juegos' , component:ListadoJuegosComponent},
  {path:'juegos/:id' , component:JuegoComponent},

  {path:'penalty', component:PenaltyComponent},
  {path: 'plinko',component:PlinkoComponent},

// Rutas relacionadas con sesiones de juego
  {path:'sesiones',component:SesionesComponent},
  {path:'listado-sesiones',component:ListadoSesionesComponent},
  {path:'sesiones/:id',component:SesionComponent},
  {path:'mis-sesiones',component:MisSesionesComponent},



 // Redirección por defecto a juegos si no se especifica una ruta
  {path:'' , pathMatch:'full',redirectTo:'/juegos'},
  {path:'**' , pathMatch:'full',redirectTo:'/juegos'},


  
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

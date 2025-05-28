import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {  HTTP_INTERCEPTORS, HttpClientModule}  from '@angular/common/http'


import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './pages/Users/usuarios/usuarios.component';
import { UsuarioComponent } from './pages/Users/usuario/usuario.component';
import { ListadoUsuariosComponent } from './pages/Users/listado-usuarios/listado-usuarios.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { JuegosComponent } from './pages/Games/juegos/juegos.component';
import { JuegoComponent } from './pages/Games/juego/juego.component';
import { ListadoJuegosComponent } from './pages/Games/listado-juegos/listado-juegos.component';
import { UsuariosService } from './services/usuarios.service';
import { JuegosService } from './services/juegos.service';
import { SesionesComponent } from './pages/Sessions/sesiones/sesiones.component';
import { SesionComponent } from './pages/Sessions/sesion/sesion.component';
import { ListadoSesionesComponent } from './pages/Sessions/listado-sesiones/listado-sesiones.component';
import { MainComponent } from './pages/Main/main/main.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/Login/login/login.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './pages/Register/register/register.component';
import { PenaltyComponent } from './pages/Penalty/penalty/penalty.component';
import { MisSesionesComponent } from './pages/Mis-Sesiones/mis-sesiones/mis-sesiones.component';
import { PlinkoComponent } from './pages/plinko/plinko.component';
import { TragaperrasComponent } from './pages/Tragaperras/tragaperras/tragaperras.component';
import { MinasComponent } from './pages/Minas/minas/minas.component';
import { RankingComponent } from './pages/Ranking/ranking/ranking.component';



@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    UsuarioComponent,
    ListadoUsuariosComponent,
    NavbarComponent,
    JuegosComponent,
    JuegoComponent,
    ListadoJuegosComponent,
    SesionesComponent,
    SesionComponent,
    ListadoSesionesComponent,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    PenaltyComponent,
    MisSesionesComponent,
    PlinkoComponent,
    TragaperrasComponent,
    MinasComponent,
    RankingComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
    
  ],
  providers: [UsuariosService,JuegosService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

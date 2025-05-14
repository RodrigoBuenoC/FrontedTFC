import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
/**
 * Interceptor de autenticación para añadir el token de autorización a las solicitudes HTTP.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {


    /**
      * Intercepta las solicitudes HTTP y les añade el token de autenticación si está disponible.
      * 
      * @param request La solicitud HTTP original.
      * @param next El siguiente manejador de la solicitud.
      * @returns La solicitud HTTP con el token agregado en la cabecera si el usuario está autenticado.
      */

    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        // Obtiene el token de autenticación desde el servicio de autenticación
        const token = this.authService.getToken();
        // Si hay un token, clona la solicitud y añade el token en la cabecera

        if (token) {
            const clonedReq = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(clonedReq);
        }
        // Si no hay token, la solicitud sigue su curso sin modificaciones
        return next.handle(request);
    }

}


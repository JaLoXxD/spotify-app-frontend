import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
    providedIn:'root',
})
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private _router: Router, private _authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string | null = localStorage.getItem('token');
        if(token){
            this._authService.isLogin = true;
        }
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse)=>{
                if(err.status === 401){
                    this._authService.spotifyLogout();
                }
                return throwError(()=>{
                    new Error('Token expirado.')
                });
            })
        )
    }
}
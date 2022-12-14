import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn:'root',
})
export class AuthGuard implements CanActivate{
    constructor(private _authService: AuthService, private _router: Router){}
    

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if((!this._authService.isLogin && !localStorage.getItem('token')) && !route.queryParams['code']){
            this._authService.spotifyLogout();
            return false;
        }
        return true;
    }
}
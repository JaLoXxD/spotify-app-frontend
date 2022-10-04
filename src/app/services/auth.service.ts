import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _spotifyApiUrl: string = environment.spotifyAccountApiUrl;

    public isLogin: boolean = false;
    public expiration: Date | undefined;

    constructor(private _http: HttpClient, private _router: Router) {}

    public spotifyLogin(
        body: URLSearchParams,
        options: Object
    ): Observable<Object> {
        return this._http.post(
            `${this._spotifyApiUrl}/api/token`,
            body,
            options
        );
    }

    public setTokenExpirationDate(expiration:number){
        const auxDate = new Date();
        const expirationTime = expiration / 3600;
        auxDate.setTime(auxDate.getTime() + expirationTime * 60 * 60 * 1000);
        this.expiration = auxDate;
        console.log(this.expiration);
    }
    
    public checkIfTokenIsExpired(): boolean{
        if(new Date() > this.expiration!){
            return false;
        }
        this.spotifyLogout();
        return true;
    }

    public spotifyLogout(){
        localStorage.removeItem('token');
        this.isLogin = false;
        this._router.navigate(['/login']);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _spotifyApiUrl: string = environment.spotifyAccountApiUrl;

    public isLogin: boolean = false;

    constructor(private _http: HttpClient) {}

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
}

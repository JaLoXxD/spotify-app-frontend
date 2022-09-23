import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private _http: HttpClient) {}
    private _apiUrl: string = environment.apiUrl;
    private _spotifyApiUrl: string = environment.spotifyApiUrl;

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

    public test(): Observable<Object> {
        return this._http.get(`${this._apiUrl}/api/v1/test`);
    }
}

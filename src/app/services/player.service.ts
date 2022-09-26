import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    private _spotifyApiUrl: string = environment.spotifyApiUrl;

    constructor(private _http: HttpClient) {}

    startOrResumePlayer(body: any, options: Object): Observable<any> {
        console.log('enter');
        return this._http.put(
            `${this._spotifyApiUrl}/me/player/play`,
            body,
            options
        );
    }
}

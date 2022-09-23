import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TrackService {
    private _spotifyApiUrl: string = environment.spotifyApiUrl;

    constructor(private _http: HttpClient) {}

    public getUserTracks(options: Object) {
        return this._http.get(`https://api.spotify.com/v1/me/tracks`, options);
    }
}

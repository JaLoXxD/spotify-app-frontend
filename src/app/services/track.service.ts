import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TrackService {
    private _spotifyApiUrl: string = environment.spotifyApiUrl;

    constructor(private _http: HttpClient) {}

    public getUserTracks(options: Object, limit: number) {
        return this._http.get<any>(`${this._spotifyApiUrl}/me/tracks?limit=${limit}`, options);
    }
}

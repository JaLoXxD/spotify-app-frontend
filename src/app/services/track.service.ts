import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TracksResponse } from '../models/tracks-response.model';

@Injectable({
    providedIn: 'root',
})
export class TrackService {
    private _spotifyApiUrl: string = environment.spotifyApiUrl;

    constructor(private _http: HttpClient) {}

    public getUserTracks(options: Object, limit: number): Observable<TracksResponse> {
        return this._http.get<TracksResponse>(`${this._spotifyApiUrl}/me/tracks?limit=${limit}`, options);
    }

    public calcTrackDuration(duration: number) {
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor(duration / 1000 - minutes * 60);
        return `${minutes}:${this._formatDuration(seconds)}`;
    }

    private _formatDuration(time: number) {
        return time < 10 ? `0${time}` : time;
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlaylistInfoResponse } from '../models/playlist-info-response.model';

@Injectable({
    providedIn: 'root',
})
export class PlaylistService {
    private _spotifyApiUrl: string = environment.spotifyApiUrl;

    constructor(private _http: HttpClient) {}

    getPlaylist(
        playlistId: string,
        options: Object
    ): Observable<PlaylistInfoResponse> {
        return this._http.get<PlaylistInfoResponse>(
            `${this._spotifyApiUrl}/playlists/${playlistId}`,
            options
        );
    }

    getPlaylistTracks(playlistId: string, limit: string, offset: string, options: Object): Observable<any> {
        return this._http.get<any>(
            `${this._spotifyApiUrl}/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
            options
        );
    }
}

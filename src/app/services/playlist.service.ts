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
    ): Promise<PlaylistInfoResponse> {
        return new Promise((resolve, reject) => {
            this._http
                .get<PlaylistInfoResponse>(
                    `${this._spotifyApiUrl}/playlists/${playlistId}`,
                    options
                )
                .subscribe({
                    next: (res) => {
                        resolve(res);
                    },
                    error: (err) => {
                        reject(err);
                    },
                });
        });
    }

    getPlaylistTracks(
        playlistId: string,
        limit: string,
        offset: string,
        options: Object
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            this._http
                .get<any>(
                    `${this._spotifyApiUrl}/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
                    options
                )
                .subscribe({
                    next: (res) => {
                        resolve(res);
                    },
                    error: (err) => {
                        reject(err);
                    },
                });
        });
    }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlaybackStateResponse } from '../models/player/playback-state-response.model';
import { AvailableDevicesResponse } from '../models/player/available-devices-response.model';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    private _spotifyApiUrl: string = environment.spotifyApiUrl;

    constructor(private _http: HttpClient) {}

    getPlaybackState(
        options: Object
    ): Observable<PlaybackStateResponse | null> {
        return this._http.get<PlaybackStateResponse | null>(
            `${this._spotifyApiUrl}/me/player`,
            options
        );
    }

    getAvailableDevices(
        options: Object
    ): Observable<AvailableDevicesResponse | null> {
        return this._http.get<AvailableDevicesResponse | null>(
            `${this._spotifyApiUrl}/me/player/devices`,
            options
        );
    }

    startOrResumePlayer(
        deviceId: string,
        body: any,
        options: Object
    ): Observable<any> {
        return this._http.put(
            `${this._spotifyApiUrl}/me/player/play?device_id=${deviceId}`,
            body,
            options
        );
    }
}

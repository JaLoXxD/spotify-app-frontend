import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlaybackStateResponse } from '../models/player/playback-state-response.model';
import { AvailableDevicesResponse } from '../models/player/available-devices-response.model';
import { PlayerTrackResponse } from '../models/player/player-track-response.model';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    private _spotifyApiUrl: string = environment.spotifyApiUrl;

    public player: Spotify.Player | null = null;
    private _currentTrack!:PlayerTrackResponse;
    public _position:number = 0;
    public _duration:number = 0;

    constructor(private _http: HttpClient) {}

    public getPlaybackState(
        options: Object
    ): Observable<PlaybackStateResponse | null> {
        return this._http.get<PlaybackStateResponse | null>(
            `${this._spotifyApiUrl}/me/player`,
            options
        );
    }

    public getAvailableDevices(
        options: Object
    ): Observable<AvailableDevicesResponse | null> {
        return this._http.get<AvailableDevicesResponse | null>(
            `${this._spotifyApiUrl}/me/player/devices`,
            options
        );
    }

    public startOrResumePlayer(
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

    public startSpotifyPlayer(access_token: string) {
        console.log(access_token);
        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('spotify script loaded');
            this.player = new Spotify.Player({
                name: 'Jorge player',
                getOAuthToken: (cb) => {
                    cb(access_token);
                },
                volume: 0.5,
            });
            this.player
                .connect()
                .then((success) => console.log('Connected:', success))
                .catch((err) => {
                    console.log(err);
                });
            this._startPlayerListeners();
        };
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        document.body.appendChild(script);
    }

    public destroySpotifyPlayer(){
        this.player?.disconnect();
    }

    private _startPlayerListeners() {
        if (this.player) {
            this.player.addListener('ready', ({ device_id }) => {
                console.log(`Ready with Device ID ${device_id}`);
            });

            this.player.addListener(
                'player_state_changed',
                ({ position, duration, track_window: { current_track } }) => {
                    this._currentTrack = current_track;
                    this._position = position;
                    this._duration = duration;
                    console.log('Currently Playing', current_track);
                    console.log('Position in Song', position);
                    console.log('Duration of Song', duration);
                }
            );
        } else {
            console.log(`player doesn't exists`);
        }
    }

    
    public get currentTrack() : PlayerTrackResponse {
        return this._currentTrack;
    }
    
    public get position() : number {
        return this._position;
    }
    
    public get duration() : number {
        return this._duration;
    }
    
    
}

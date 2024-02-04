import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { PlaybackStateResponse } from '../models/player/playback-state-response.model';
import { AvailableDevicesResponse } from '../models/player/available-devices-response.model';
import { PlayerTrackResponse } from '../models/player/player-track-response.model';
import { UserService } from './user.service';
import { TrackService } from './track.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    private _spotifyApiUrl: string = environment.spotifyApiUrl;
    private _currentTrack: BehaviorSubject<PlayerTrackResponse | undefined> =
        new BehaviorSubject<PlayerTrackResponse | undefined>(undefined);

    public searchDevices: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    public player: Spotify.Player | null = null;
    public currentDevice: string | undefined;
    public isPlaying: boolean = false;
    public playType: string | undefined;
    public repeatState: string = 'off';
    public volume: number = 50;
    public trackDuration: string = '0:00';
    public trackPosition: string = '0:00';
    public paused: boolean = false;
    public position: number = 0;
    public duration: number = 0;
    public repeatMode: number = 0;
    public shuffle: boolean = false;
    public trackTimer: Observable<number> = interval(1000);

    constructor(
        private _http: HttpClient,
        private _userService: UserService,
        private _trackService: TrackService
    ) {}

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

    public pausePlayer(
        deviceId: string,
        body: any,
        options: Object
    ): Observable<any> {
        return this._http.put(
            `${this._spotifyApiUrl}/me/player/pause?device_id=${deviceId}`,
            body,
            options
        );
    }

    public nextTrack(
        deviceId: string | undefined,
        options: Object
    ): Observable<any> {
        return this._http.post(
            `${this._spotifyApiUrl}/me/player/next?device_id=${deviceId}`,
            {},
            options
        );
    }

    public previousTrack(
        deviceId: string | undefined,
        options: Object
    ): Observable<any> {
        return this._http.post(
            `${this._spotifyApiUrl}/me/player/previous?device_id=${deviceId}`,
            {},
            options
        );
    }

    public setVolume(
        deviceId: string | undefined,
        volume_percent: number,
        options: Object
    ): Observable<null> {
        return this._http.put<null>(
            `${this._spotifyApiUrl}/me/player/volume?volume_percent=${volume_percent}&device_id=${deviceId}`,
            {},
            options
        );
    }

    public toogleRepeatMode(
        deviceId: string | undefined,
        state: string,
        options: Object
    ): Observable<any> {
        return this._http.put(
            `${this._spotifyApiUrl}/me/player/repeat?state=${state}&device_id=${deviceId}`,
            {},
            options
        );
    }

    public toogleShuffleMode(
      deviceId: string | undefined,
      state: boolean,
      options: Object
    ): Observable<any> {
        return this._http.put(
            `${this._spotifyApiUrl}/me/player/shuffle?state=${state}&device_id=${deviceId}`,
            {},
            options
        );	
    }

    public startSpotifyPlayer(access_token: string) {
      console.log("enter to start spotify player")
        window.onSpotifyWebPlaybackSDKReady = () => {
            this.player = new Spotify.Player({
                name: 'custom player',
                getOAuthToken: (cb) => {
                    cb(access_token);
                },
                volume: this.volume / 100,
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

    public playSongs(uris: Array<string>) {
        if (!this.currentDevice) {
            return;
        }
        const body = {
            position_ms: 0,
            uris: uris,
        };
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken.value || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this.startOrResumePlayer(this.currentDevice, body, options).subscribe({
            next: (res) => {
                this.isPlaying = true;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    public destroySpotifyPlayer() {
        this.player?.disconnect();
    }

    private _startPlayerListeners() {
        if (this.player) {;
            this.player.addListener('ready', ({ device_id }) => {
                console.log(`Ready with Device ID ${device_id}`);
                this.currentDevice = device_id;
                this.searchDevices.next(true);
            });
            this.player.addListener(
                'player_state_changed',
                ({
                    repeat_mode,
                    shuffle,
                    paused,
                    position,
                    duration,
                    track_window: { current_track },
                }) => {
                    this._currentTrack.next(current_track);
                    console.log('send track name');
                    console.log(`current state:`);
                    console.log('Currently Playing', current_track);
                    console.log('Position in Song', position);
                    console.log('Duration of Song', duration);
                    this.repeatMode = repeat_mode;
                    this.shuffle = shuffle;
                    this.paused = paused;
                    this.position = position;
                    this.duration = duration;
                    this.trackDuration =
                        this._trackService.calcTrackDuration(duration);
                    this.trackPosition =
                        this._trackService.calcTrackDuration(position);
                }
            );
        } else {
            console.log(`player doesn't exists`);
        }
    }

    public get currentTrack(): Observable<PlayerTrackResponse | undefined> {
        return this._currentTrack.asObservable();
    }
}

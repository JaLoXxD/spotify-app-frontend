import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { PlayerService, UserService, TrackService, AuthService } from 'src/app/services';
import { PlaybackStateResponse } from '../../models/player/playback-state-response.model';
import { Device } from '../../models/player/available-devices-response.model';
import { PlayerTrackResponse } from '../../models/player/player-track-response.model';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
    public playbackState!: PlaybackStateResponse | null;
    public availableDevices!: Device[] | null;
    public devicesContainerClass: boolean = false;
    public deviceIcons: any = {};
    public selectedDevice: Device | null = null;
    public currentTrack!: PlayerTrackResponse | undefined;
    public name: string | undefined = 'empty';
    public trackTimer: any = [];
    public trackProgress: number = 0;

    private _trackSubscriber!: Subscription;

    constructor(
        private _playerService: PlayerService,
        private _userService: UserService,
        private _trackService: TrackService,
        private _authService: AuthService,
        private _ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this._playerService.searchDevices.subscribe((search) => {
            const headers = new HttpHeaders({
                Authorization: this._userService.userToken.value || '',
                'Content-Type': 'application/json',
            });
            const options = { headers };
            if (search) {
                this.getAvailableDevices(options);
            }
        });
        this._playerService.currentTrack.subscribe((track) => {
            this.stopTrackTimer();
            this.currentTrack = track;
            this.name = track?.name;
            if (
                this._playerService.duration > 0 &&
                this._playerService.duration === this._playerService.position &&
                this._playerService.repeatMode === 0 &&
                !this._playerService.shuffle
            ) {
                this.pausePlayer();
            }
            this._playerService.player?.getCurrentState().then((state) => {
                console.log(state);
                if (!state?.paused) {
                    this._playerService.isPlaying = true;
                    this.createTrackTimer();
                    return;
                }
                if (state?.paused) {
                    this.stopTrackTimer();
                    this._playerService.isPlaying = false;
                    return;
                }
            });
            this._ref.detectChanges();
        });
    }

    createTrackTimer() {
        this.stopTrackTimer();
        this._trackSubscriber = this._playerService.trackTimer.subscribe(() => {
            this._playerService.trackPosition =
                this._trackService.calcTrackDuration(
                    this._playerService.position
                );
            this._playerService.position += 1000;
            this.calcTrackProgress();
            this._ref.detectChanges();
        });
    }

    stopTrackTimer() {
        this._trackSubscriber?.unsubscribe();
    }

    resetTrackProgress() {
        this.trackProgress = 0;
    }

    calcTrackProgress() {
        this.trackProgress =
            (this._playerService.position * 100) / this._playerService.duration;
    }

    tooglePlayer() {
        if (!this._playerService.isPlaying) {
            this.startOrResumePlayer();
        } else {
            this.pausePlayer();
        }
    }

    startOrResumePlayer() {
        if (!this.currentDevice) {
            return;
        }
        const body = {
          position_ms: this._playerService.position,
          uris: [this.currentTrack?.uri],
        };
        const headers = new HttpHeaders({
          Authorization: this._userService.userToken.value || '',
          'Content-Type': 'application/json',
        });
        const options = { headers };
        console.log(this.currentTrack)
        this._playerService
            .startOrResumePlayer(this.currentDevice, body, options)
            .subscribe({
                next: (res) => {
                    this.stopTrackTimer();
                    this.getPlaybackState(options);
                    this._playerService.isPlaying = true;
                    this._ref.detectChanges();
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    pausePlayer() {
        this.stopTrackTimer();
        if (!this.currentDevice) {
            return;
        }
        console.log(this.currentTrack)
        const body = {
            position_ms: this._playerService.position,
            uris: [this.currentTrack?.uri],
        };
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken.value || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .pausePlayer(this.currentDevice, body, options)
            .subscribe({
                next: (res) => {
                    // this.getPlaybackState(options);
                    console.log('track paused');
                    this._playerService.isPlaying = false;
                    console.log(this.isPlaying)
                    this._ref.detectChanges();
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    nextTrack() {
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken.value || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .nextTrack(this.currentDevice, options)
            .subscribe((resp) => {
                console.log(resp);
                this.resetTrackProgress();
            });
    }

    previousTrack() {
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken.value || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .previousTrack(this.currentDevice, options)
            .subscribe((resp) => {
                console.log(resp);
                this.resetTrackProgress();
            });
    }

    toogleRepeatMode() {
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken.value || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        const state: string =
            this.repeatState === 'off'
                ? 'context'
                : this.repeatState === 'context'
                ? 'track'
                : 'off';
        console.log(state);
        this._playerService.repeatState = state;
        this._playerService
            .toogleRepeatMode(this.currentDevice, state, options)
            .subscribe((resp) => {
                console.log(resp);
            });
    }

    toogleShuffleMode() {
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken.value || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        const state: boolean = !this._playerService.shuffle;
        this._playerService.shuffle = state;
        this._playerService
            .toogleShuffleMode(this.currentDevice, state, options)
            .subscribe((resp) => {
                this._ref.detectChanges();
            });
    }

    getPlaybackState(options: Object) {
        this._playerService.getPlaybackState(options).subscribe((resp) => {
            this.playbackState = resp;
            console.log(resp);
        });
    }

    getAvailableDevices(options: Object) {
        console.log(options);
        this._playerService.getAvailableDevices(options).subscribe((resp) => {
            console.log(resp);
            this.availableDevices = resp?.devices || null;
            this.selectedDevice =
                this.availableDevices != null ? this.availableDevices[0] : null;
            this._ref.detectChanges();
            console.log(this.availableDevices);
            console.log(this.selectedDevice);
        });
    }

    chooseDevice(deviceInfo: Device) {
        console.log(deviceInfo);
        if (this.currentDevice === deviceInfo.id) {
            this._playerService.currentDevice = undefined;
            return;
        }
        this._playerService.currentDevice = deviceInfo.id;
    }

    getVolume(ev: Event) {
        const target = ev.target as HTMLInputElement;
        this._playerService.volume = parseInt(target.value);
    }

    setVolume() {
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken.value || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .setVolume(this.currentDevice, this.volume, options)
            .subscribe((resp) => {
                console.log(resp);
            });
    }

    public get currentDevice(): string | undefined {
        return this._playerService.currentDevice;
    }

    public get isPlaying(): boolean {
        return this._playerService.isPlaying;
    }

    public get repeatState(): string {
        return this._playerService.repeatState;
    }

    public get shuffleState(): boolean {
        return this._playerService.shuffle; 
    }

    public get volume(): number {
        return this._playerService.volume;
    }

    public get trackDuration(): string {
        return this._playerService.trackDuration;
    }

    public get trackPosition(): string {
        return this._playerService.trackPosition;
    }

    public get isPremium(): boolean {
        return this._userService.isPremium;
    }

    public get isLogin(): boolean {
        return this._authService.isLogin;
    }
}

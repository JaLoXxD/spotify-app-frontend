import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { UserService } from '../../services/user.service';
import { HttpHeaders } from '@angular/common/http';
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
    public trackTimer: ReturnType<typeof setInterval> | null = null;
    public trackProgress: number = 0;

    constructor(
        public _playerService: PlayerService,
        private _userService: UserService,
        private _ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        const headers = new HttpHeaders({
            Authorization: localStorage.getItem('token') || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this.getPlaybackState(options);

        //REVISAR DONDE SE USA PARA BORRAR userTokenS
        // this._userService.userTokenS.subscribe((token) => {
        // });

        this._playerService.searchDevices.subscribe((search) => {
            if (search) {
                this.getAvailableDevices(options);
            }
        });
        this._playerService.currentTrack.subscribe((track) => {
            this.currentTrack = track;
            this.name = track?.name;
            console.log(this.currentTrack);
            console.log(this._playerService.repeatMode);
            console.log(this._playerService.shuffle);
            if(this._playerService.duration > 0 && this._playerService.duration === this._playerService.position && this._playerService.repeatMode === 0 && !this._playerService.shuffle){
                this.pausePlayer();
            }
            if (this.currentTrack) {
                console.log('enter');
                this.createTrackTimer();
            }
            this._ref.detectChanges();
        });
    }

    createTrackTimer() {
        this.stopTrackTimer();
        this.trackTimer = setInterval(() => {
            this._playerService.trackPosition =
            this._playerService.calculateTime(this._playerService.position);
            console.log(this._playerService.trackPosition);
            console.log(this._playerService.trackDuration);
            this._playerService.position += 1000;
            this.calcTrackProgress();
            this._ref.detectChanges();
        }, 1000);
        console.log(this.trackTimer);
    }

    stopTrackTimer() {
        clearInterval(this.trackTimer!);
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
            position_ms: 0,
            uris: ['spotify:track:2HsjCukWx0BWvpm660mDyp'],
        };
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .startOrResumePlayer(this.currentDevice, body, options)
            .subscribe({
                next: (res) => {
                    this.stopTrackTimer();
                    this.getPlaybackState(options);
                    this._playerService.isPlaying = true;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    pausePlayer() {
        if (!this.currentDevice) {
            return;
        }
        const body = {
            position_ms: 0,
            uris: ['spotify:track:2HsjCukWx0BWvpm660mDyp'],
        };
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .pausePlayer(this.currentDevice, body, options)
            .subscribe({
                next: (res) => {
                    this.stopTrackTimer();
                    this.getPlaybackState(options);
                    this._playerService.isPlaying = false;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    nextTrack() {
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .nextTrack(this.currentDevice, options)
            .subscribe((resp) => {
                console.log(resp);
            });
    }

    previousTrack() {
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .previousTrack(this.currentDevice, options)
            .subscribe((resp) => {
                console.log(resp);
            });
    }

    toogleRepeatMode() {
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken || '',
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

    getPlaybackState(options: Object) {
        this._playerService.getPlaybackState(options).subscribe((resp) => {
            this.playbackState = resp;
            console.log(resp);
        });
    }

    getAvailableDevices(options: Object) {
        this._playerService.getAvailableDevices(options).subscribe((resp) => {
            this.availableDevices = resp?.devices || null;
            this.selectedDevice =
                this.availableDevices != null ? this.availableDevices[0] : null;
            this._ref.detectChanges();
            console.log(this.availableDevices);
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
            Authorization: this._userService.userToken || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .setVolume(this.currentDevice, this.volume, options)
            .subscribe((resp) => {});
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

    public get volume(): number {
        return this._playerService.volume;
    }

    public get trackDuration(): string {
        return this._playerService.trackDuration;
    }

    public get trackPosition(): string {
        return this._playerService.trackPosition;
    }
}

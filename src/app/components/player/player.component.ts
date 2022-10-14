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
    public volume: number = 50;
    public currentTrack!: PlayerTrackResponse | undefined;
    public name:string | undefined = 'empty';

    constructor(
        public _playerService: PlayerService,
        private _userService: UserService,
        private ref: ChangeDetectorRef
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
            this.ref.detectChanges();
        });
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
                    this.getPlaybackState(options);
                    this._playerService.isPlaying = false;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    getPlaybackState(options: Object) {
        this._playerService.getPlaybackState(options).subscribe((resp) => {
            this.playbackState = resp;
        });
    }

    getAvailableDevices(options: Object) {
        this._playerService.getAvailableDevices(options).subscribe((resp) => {
            this.availableDevices = resp?.devices || null;
            this.selectedDevice =
                this.availableDevices != null ? this.availableDevices[0] : null;
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

    public get currentDevice(): string | undefined {
        return this._playerService.currentDevice;
    }

    public get isPlaying(): boolean {
        return this._playerService.isPlaying;
    }
}

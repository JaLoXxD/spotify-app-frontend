import { Component, Input, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { UserService } from '../../services/user.service';
import { HttpHeaders } from '@angular/common/http';
import { PlaybackStateResponse } from '../../models/player/playback-state-response.model';
import { Device } from '../../models/player/available-devices-response.model';
import { map } from 'rxjs/operators';

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

    constructor(
        private _playerService: PlayerService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this._userService.userTokenS.subscribe((token) => {
            const headers = new HttpHeaders({
                Authorization: token || '',
                'Content-Type': 'application/json',
            });
            const options = { headers };
            this.getPlaybackState(options);
            this.getAvailableDevices(options);
        });
    }

    tooglePlayer(status: string) {
        if (status === 'play') {
            this.startOrResumePlayer();
        } else {
            
        }
    }

    startOrResumePlayer() {
        const deviceId: string =
            this.selectedDevice != null ? this.selectedDevice.id : '';
        const body = { position_ms: 0 };
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .startOrResumePlayer(deviceId, body, options)
            .subscribe({
                next: (res) => {
                    this.getPlaybackState(options);
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    pausePlayer() {}

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
        });
    }
}

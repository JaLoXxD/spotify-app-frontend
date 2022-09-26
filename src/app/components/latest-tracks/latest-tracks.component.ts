import { UserTracksResponseModel } from '../../models/user-tracks-response.model';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TrackService } from '../../services/track.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-latest-tracks',
    templateUrl: './latest-tracks.component.html',
    styleUrls: ['./latest-tracks.component.css'],
})
export class LatestTracksComponent implements OnInit {
    public tracks!: Array<UserTracksResponseModel>;

    constructor(
        private _trackService: TrackService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('token')) {
            const headers = new HttpHeaders({
                Authorization: this._userService.userToken || '',
                'Content-Type': 'application/json',
            });

            const options = { headers };
            this.getLatestTracks(options, 5);
        }
    }

    public getLatestTracks(options: Object, limit: number) {
        this._trackService.getUserTracks(options, limit).subscribe((resp) => {
            console.log(resp);
            this.tracks = resp.items;
        });
    }

    public calcTrackDuration(duration: number) {
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.round(duration / 1000 - minutes * 60);
        return `${minutes}:${this.formatDuration(seconds)}`;
    }

    public formatDuration(time: number) {
        return time < 10 ? `0${time}` : time;
    }
}

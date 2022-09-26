import { Component, OnInit } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserProfileResponseModel } from '../../models/user-profile-response.model';
import { UserTracksResponseModel } from '../../models/user-tracks-response.model';
import { playlistItem } from '../../models/user-playlists-response.model';

@Component({
    selector: 'app-home-component',
    templateUrl: './app.home.component.html',
    styleUrls: ['./app.home.component.css'],
})
export class HomeComponent implements OnInit {
    public userTracks!: Array<UserTracksResponseModel>;
    public userPlaylists!: playlistItem[];

    constructor(
        private _trackService: TrackService,
        private _userService: UserService,
        private _authService: AuthService
    ) {}

    async ngOnInit() {
        if (localStorage.getItem('token')) {
            this._userService.userToken = localStorage.getItem('token') || null;

            const headers = new HttpHeaders({
                Authorization: this._userService.userToken || '',
                'Content-Type': 'application/json',
            });

            const options = { headers };

            this.getUserProfile(options);

            this.getLatestTracks(options, 5);

            this.getUserPlaylists(options);
        }
    }

    public getUserProfile(options: Object) {
        this._userService.getUserProfile(options).subscribe((res) => {
            console.log('user profile');
            console.log(res);
            this._userService.userInfo = res;
        });
    }

    public getLatestTracks(options: Object, limit: number) {
        this._trackService.getUserTracks(options, limit).subscribe((resp) => {
            console.log(resp);
            this.userTracks = resp.items;
        });
    }

    public getUserPlaylists(options: Object) {
        this._userService.getUserPlaylists(options).subscribe((resp) => {
            console.log('playlists');
            console.log(resp);
            this.userPlaylists = resp.items;
        });
    }

    public get isLogin(): boolean {
        return this._authService.isLogin;
    }

    public get userInfo(): UserProfileResponseModel {
        return this._userService.userInfo;
    }
}

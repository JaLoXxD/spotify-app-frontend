import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserProfileResponseModel } from '../../models/user-profile-response.model';
import { UserTracksResponseModel } from '../../models/user-tracks-response.model';
import { playlistItem } from '../../models/user-playlists-response.model';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackService } from '../../services/track.service';
import { TrackItem } from '../../models/tracks-response.model';

@Component({
    selector: 'app-home-component',
    templateUrl: './app.home.component.html',
    styleUrls: ['./app.home.component.css'],
})
export class HomeComponent implements OnInit {
    public isLoading: boolean = true;
    public userTracks!: Array<UserTracksResponseModel>;
    public userPlaylists!: playlistItem[];
    public totalFollowerArtists: number = 0;
    public tracks!: Array<TrackItem>;

    private _redirectUri: string = environment.redirectUri;
    private _code: string = '';

    constructor(
        private _userService: UserService,
        private _authService: AuthService,
        private _trackService: TrackService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {}

    ngOnInit() {
        this._route.queryParams.subscribe(async (params) => {
            if (params['code'] && !localStorage.getItem('token')) {
                this._code = params['code'];
                await this.spotifyLogin();
                console.log('finish login');
                this._router.navigate([]);
            }
            if (localStorage.getItem('token')) {
                const headers = new HttpHeaders({
                    Authorization: localStorage.getItem('token') || '',
                    'Content-Type': 'application/json',
                });

                const options = { headers };

                console.log(options);

                await this.getUserProfile(options);
                await this.getLatestTracks(options, 5);
                this.isLoading = false;
            }
        });
    }

    public spotifyLogin() {
        return new Promise((resolve, reject) => {
            const body = new URLSearchParams();
            body.append('grant_type', 'authorization_code');
            body.append('code', this._code);
            body.append('redirect_uri', this._redirectUri);
            const authorization = `${environment.spotifyClientId}:${environment.spotifyClientSecret}`;
            const headers = new HttpHeaders({
                Authorization: `Basic ${btoa(authorization)}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            });

            const options = { headers };

            this._authService.spotifyLogin(body, options).subscribe({
                next: (res: any) => {
                    console.log(res);
                    const token = `${res.token_type} ${res.access_token}`;
                    localStorage.setItem('token', token);
                    this._authService.isLogin = true;
                    this._authService.setTokenExpirationDate(res.expires_in);
                    if (!this._userService.userToken.value) {
                        this._userService.userToken.next(token);
                    }
                    resolve(true);
                },
                error: (err) => {
                    console.log(err);
                    reject(false);
                },
            });
        });
    }

    public getUserProfile(options: Object): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._userService.getUserProfile(options).subscribe((res) => {
                console.log('user profile');
                console.log(res);
                this._userService.userInfo = res;
                this._userService.isPremium =
                    res.product === 'premium' ? true : false;
                resolve(true);
            });
        });
    }

    public getTotalFollowedArtists(total: number) {
        this.totalFollowerArtists = total;
    }

    public getLatestTracks(options: Object, limit: number): Promise<boolean> {
        return new Promise((resolve) => {
            this._trackService
                .getUserTracks(options, limit)
                .subscribe((resp) => {
                    console.log(resp);
                    this.tracks = resp.items;
                    resolve(true);
                });
        });
    }

    public get isLogin(): boolean {
        return this._authService.isLogin;
    }

    public get userInfo(): UserProfileResponseModel {
        return this._userService.userInfo;
    }

    public get userImage(): string {
      console.log(this.userInfo)
      const max_width_item = this.userInfo.images.reduce((prev, current) => {
        if (current.width === null || current.height === null || prev.width === null || prev.height === null) {
          return prev;
        }
        return (prev.width > current.width) ? prev : current;
      });
        return max_width_item
            ? max_width_item.url
            : 'assets/images/user-logo.png';
    }
}

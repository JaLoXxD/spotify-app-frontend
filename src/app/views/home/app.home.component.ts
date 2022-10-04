import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserProfileResponseModel } from '../../models/user-profile-response.model';
import { UserTracksResponseModel } from '../../models/user-tracks-response.model';
import { playlistItem } from '../../models/user-playlists-response.model';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-home-component',
    templateUrl: './app.home.component.html',
    styleUrls: ['./app.home.component.css'],
})
export class HomeComponent implements OnInit {
    public userTracks!: Array<UserTracksResponseModel>;
    public userPlaylists!: playlistItem[];
    public totalFollowerArtists: number = 0;

    private _redirectUri: string = environment.redirectUri;
    private _code: string = '';

    constructor(
        private _userService: UserService,
        private _authService: AuthService,
        private _route: ActivatedRoute,
        private _router: Router,
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
                console.log('start token');
                this._userService.userToken =
                    localStorage.getItem('token') || null;
                console.log(this._userService);
                this._userService.userTokenS.next(
                    localStorage.getItem('token')
                );
                const headers = new HttpHeaders({
                    Authorization: this._userService.userToken || '',
                    'Content-Type': 'application/json',
                });

                const options = { headers };

                this.getUserProfile(options);
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
                    localStorage.setItem(
                        'token',
                        `${res.token_type} ${res.access_token}`
                    );
                    this._authService.isLogin = true;
                    this._authService.setTokenExpirationDate(res.expires_in);
                    resolve(true);
                },
                error: (err) => {
                    console.log(err);
                    reject(false);
                },
            });
        });
    }

    public getUserProfile(options: Object) {
        this._userService.getUserProfile(options).subscribe((res) => {
            console.log('user profile');
            console.log(res);
            this._userService.userInfo = res;
        });
    }

    public getTotalFollowedArtists(total: number) {
        this.totalFollowerArtists = total;
    }

    public get isLogin(): boolean {
        return this._authService.isLogin;
    }

    public get userInfo(): UserProfileResponseModel {
        return this._userService.userInfo;
    }
}

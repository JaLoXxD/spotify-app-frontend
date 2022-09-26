import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar-component',
    templateUrl: './app-navbar.component.html',
})
export class NavbarComponent implements OnInit {
    private _code: string = '';
    private _redirectUri: string = 'http://localhost:4200';

    constructor(
        private _authService: AuthService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('token')) {
            this._authService.isLogin = true;
            return;
        }
        this._route.queryParams.subscribe((params) => {
            if (params['code']) {
                this._code = params['code'];
                this.spotifyLogin();
            }
        });
    }

    public spotifyRedirect() {
        const scope =
            'user-read-private user-read-email playlist-read-private user-library-modify user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-recently-played user-library-read user-follow-read';

        window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${environment.spotifyClientId}&scope=${scope}&redirect_uri=${this._redirectUri}&state=qweasdrftgcvdfes`;
    }

    public spotifyLogin() {
        const body = new URLSearchParams();
        body.append('grant_type', 'authorization_code');
        body.append('code', this._code);
        body.append('redirect_uri', this._redirectUri);

        const authorization = `${environment.spotifyClientId}:${environment.spotifyClientSecret}`;
        console.log(btoa(authorization));
        const headers = new HttpHeaders({
            Authorization: `Basic ${btoa(authorization)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        const options = { headers };

        this._router.navigate([]);

        this._authService.spotifyLogin(body, options).subscribe((res: any) => {
            console.log(res);
            localStorage.setItem(
                'token',
                `${res.token_type} ${res.access_token}`
            );
            this._authService.isLogin = true;
        });
    }

    public spotifyLogout() {
        localStorage.removeItem('token');
        this._authService.isLogin = false;
    }

    public get isLogin(): boolean {
        return this._authService.isLogin;
    }
}

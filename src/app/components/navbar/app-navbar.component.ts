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

    public isLogin: boolean = false;

    constructor(
        private _authService: AuthService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('token')) {
            this.isLogin = true;
            return;
        }
        this._route.queryParams.subscribe((params) => {
            if (params['code']) {
                this._code = params['code'];
                this.spotifyLogin();
            }
        });
    }

    spotifyLogin() {
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
            this.isLogin = true;
        });
    }

    spotifyLogout() {
        localStorage.removeItem('token');
        this.isLogin = false;
    }
}

import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
declare let spotify: any;
@Component({
    selector: 'app-navbar-component',
    templateUrl: './app-navbar.component.html',
})
export class NavbarComponent implements OnInit {
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {}

    ngOnInit(): void {
    }

    public spotifyLogout() {
        this._authService.spotifyLogout();
    }

    public get isLogin(): boolean {
        return this._authService.isLogin;
    }
}

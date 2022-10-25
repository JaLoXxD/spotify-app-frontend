import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';

@Component({
    selector: 'app-navbar-component',
    templateUrl: './app-navbar.component.html',
    styleUrls: ["./app-navbar.component.css"]
})
export class NavbarComponent implements OnInit {
    constructor(
        private _authService: AuthService
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

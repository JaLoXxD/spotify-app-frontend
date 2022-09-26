import { Component, OnInit } from '@angular/core';
import { PlayerService } from './services/player.service';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'Spotify';

    constructor(
        private _playerService: PlayerService,
        private _userService: UserService,
        private _authService: AuthService
    ) {}

    ngOnInit(): void {
        console.log(this._userService);
    }
}

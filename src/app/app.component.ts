import { Component, OnInit } from '@angular/core';
import { PlayerService } from './services/player.service';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'Spotify';

    constructor(
        private _playerService: PlayerService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {}

    tooglePlayer() {
        const body = {};

        const headers = new HttpHeaders({
            Authorization: this._userService.userToken || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        console.log(body);
        console.log(options);
        console.log(this._userService.userToken);
        this._playerService
            .startOrResumePlayer(
                {
                    position_ms: 0,
                },
                {
                    headers: new HttpHeaders({
                        Authorization: this._userService.userToken || '',
                        'Content-Type': 'application/json',
                    }),
                }
            )
            .subscribe((res) => {
                console.log(res);
            });
    }
}

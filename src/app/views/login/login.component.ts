import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
    private _redirectUri: string = environment.redirectUri;

    constructor() {}

    ngOnInit() {}

    public spotifyRedirect() {
        const scope =
            'user-read-private user-read-email playlist-read-private user-library-modify user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-recently-played user-library-read user-follow-read';

        window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${environment.spotifyClientId}&scope=${scope}&redirect_uri=${this._redirectUri}&state=qweasdrftgcvdfes`;
    }
}

import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'Spotify';

    constructor(private _userService: UserService) {}

    ngOnInit() {
        console.log(this._userService);
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = false;
        
    }
}

import { Component, OnInit } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-home-component',
    templateUrl: './app.home.component.html',
})
export class HomeComponent implements OnInit {
    public userToken: string | null = null;

    constructor(private _trackService: TrackService) {}

    ngOnInit(): void {
        if (localStorage.getItem('token')) {
            this.userToken = localStorage.getItem('token') || null;

            const headers = new HttpHeaders({
                Authorization: this.userToken || '',
                'Content-Type': 'application/json',
            });

            const options = { headers };

            console.log(options);

            this._trackService.getUserTracks(options).subscribe((resp) => {
                console.log(resp);
            });
        }
    }
}

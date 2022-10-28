import { OnInit, Component } from '@angular/core';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.css'],
})
export class PlaylistsComponent implements OnInit {
    public isLoading: boolean = true;

    ngOnInit(): void {
    }

    onLoading(ev: boolean) {
        console.log(ev);
        this.isLoading = ev;
    }
}

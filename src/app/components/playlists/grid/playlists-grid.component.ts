import { Component, Input, OnInit } from '@angular/core';
import { playlistItem } from '../../../models/user-playlists-response.model';
@Component({
    selector: 'app-playlists-grid',
    templateUrl: './playlists-grid.component.html',
    styleUrls: ['./playlists-grid.component.css'],
})
export class PlaylistsGridComponent implements OnInit {
    @Input() playlists: playlistItem[] = [];

    public placeholderPlaylistImg: string =
        'https://via.placeholder.com/450x350';

    ngOnInit(): void {
        console.log(this.playlists);
    }
}

import { UserTracksResponseModel } from '../../models/user-tracks-response.model';
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

@Component({
    selector: 'app-latest-tracks',
    templateUrl: './latest-tracks.component.html',
    styleUrls: ['./latest-tracks.component.css'],
})
export class LatestTracksComponent implements OnInit, OnChanges {
    @Input() tracks: UserTracksResponseModel[] = [];

    ngOnInit(): void {}

    ngOnChanges(): void {
        console.log(this.tracks);
    }
}

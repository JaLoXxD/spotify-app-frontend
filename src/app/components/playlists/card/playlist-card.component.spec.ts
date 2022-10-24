import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlaylistCard } from './playlist-card.component';
import { PlayerService } from 'src/app/services';
import { By } from '@angular/platform-browser';

describe('PlaylistCardComponent tests', () => {
    let fixture: ComponentFixture<PlaylistCard>;
    let component: PlaylistCard;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [PlaylistCard],
            providers: [PlayerService],
        }).compileComponents();
        fixture = TestBed.createComponent(PlaylistCard);
        component = fixture.componentInstance;
    });

    const playlist = {
        collaborative: false,
        description:
            'Warning: Dreamy vibes ahead. Come and sail with us among the chillest clouds in this heavenly journey.    Submissions: ko-fi.com&#x2F;dreamhop |  jazzhop, chillhop, Lo-fi Hiphop| Perfect to work, cook, have lunch or diner, play video games, study, do homework, groove, run, meditate or even do yoga!',
        external_urls: {
            spotify: 'https://open.spotify.com/playlist/0V5IsHm0VJbmeffuLzgoc3',
        },
        href: 'https://api.spotify.com/v1/playlists/0V5IsHm0VJbmeffuLzgoc3',
        id: '0V5IsHm0VJbmeffuLzgoc3',
        images: [
            {
                height: null,
                url: 'https://i.scdn.co/image/ab67706c0000bebba06786e825a01e5d053febda',
                width: null,
            },
        ],
        name: 'Dreamhop ☁️ Chill Lofi Beats',
        owner: {
            display_name: 'Dreamhop Music',
            external_urls: {
                spotify:
                    'https://open.spotify.com/user/91jfqzlv0htrqrvvc60138qma',
            },
            href: 'https://api.spotify.com/v1/users/91jfqzlv0htrqrvvc60138qma',
            id: '91jfqzlv0htrqrvvc60138qma',
            type: 'user',
            uri: 'spotify:user:91jfqzlv0htrqrvvc60138qma',
        },
        primary_color: null,
        public: false,
        snapshot_id:
            'Mjc2NywxMDliZjU2Y2I4NTQwNGI1ODQ4NzM2YzBkZmZmOWVlZmZkMjNlNGE5',
        tracks: {
            href: 'https://api.spotify.com/v1/playlists/0V5IsHm0VJbmeffuLzgoc3/tracks',
            total: 300,
        },
        type: 'playlist',
        uri: 'spotify:playlist:0V5IsHm0VJbmeffuLzgoc3',
    };

    it('should use the playlist information', () => {
        component.playlist = playlist;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('img').src).toEqual(
            playlist.images[0].url
        );
        expect(fixture.nativeElement.querySelector('h5').innerText).toEqual(
            playlist.name
        );
        expect(fixture.nativeElement.querySelector('span').innerText).toContain(
            playlist.owner.display_name
        );
    });

    it('should exec playPlaylist function', async () => {
        spyOn(component, 'playPlaylist');

        const playElement =
            fixture.debugElement.nativeElement.querySelector('.play');
        playElement.click();

        fixture.whenStable().then(() => {
            expect(component.playPlaylist).toHaveBeenCalled();
        });
    });

    it('should exec playlistInfo function', async () => {
        fixture.debugElement.query(By.css('.playlist-card'))
            .nativeElement.click();

        fixture.whenStable().then(() => {
            expect(component.playlistInfo).toHaveBeenCalled();
        });
    });
});

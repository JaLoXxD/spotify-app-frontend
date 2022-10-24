import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PlayerService, UserService } from 'src/app/services';
import { tracksList } from './data/tests';
import { TracksListComponent } from './tracks-list.component';

describe('TracksListComponent tests', () => {
    let fixture: ComponentFixture<TracksListComponent>;
    let component: TracksListComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [TracksListComponent],
            providers: [PlayerService, UserService],
        }).compileComponents();
        fixture = TestBed.createComponent(TracksListComponent);
        component = fixture.componentInstance;
    });

    it("should hide the tracks-container if tracks input doesn't exist", () => {
        expect(
            fixture.nativeElement.querySelector('.tracks-container')
        ).toBeFalsy();
    });

    it('should show pagination div if pagination input is true', () => {
        component.tracks = tracksList;
        component.pagination = true;
        fixture.detectChanges();
        expect(
            fixture.nativeElement.querySelector('.pages-container')
        ).toBeTruthy();
    });

    it('should show 5 tracks', () => {
        component.tracks = tracksList;
        fixture.detectChanges();

        expect(
            fixture.debugElement.queryAll(By.css('.track-card')).length
        ).toEqual(5);
    });
});

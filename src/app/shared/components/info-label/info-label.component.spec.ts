import { TestBed, ComponentFixture } from '@angular/core/testing';
import { InfoLabelComponent } from './info-label.component';

describe('InfoLabelComponent tests', () => {
    let fixture: ComponentFixture<InfoLabelComponent>;
    let component: InfoLabelComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InfoLabelComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(InfoLabelComponent);
        component = fixture.componentInstance;
    });

    it("should add centered class", () => {
        component.centered = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.detail-card.centered')).toBeTruthy();
    })
});

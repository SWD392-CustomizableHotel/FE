import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAmenitiesComponent } from './manage-amenities.component';


describe('RoomsComponent', () => {
  let component: ManageAmenitiesComponent;
  let fixture: ComponentFixture<ManageAmenitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAmenitiesComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ManageAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
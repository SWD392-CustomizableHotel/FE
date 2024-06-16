import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAvailableRoomComponent } from './view-available-room.component';

describe('ViewAvailableRoomComponent', () => {
  let component: ViewAvailableRoomComponent;
  let fixture: ComponentFixture<ViewAvailableRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAvailableRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAvailableRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizingRoomComponent } from './customizing-room.component';

describe('CustomizingRoomComponent', () => {
  let component: CustomizingRoomComponent;
  let fixture: ComponentFixture<CustomizingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomizingRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

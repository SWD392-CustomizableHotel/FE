import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCustomizingComponent } from './progress-customizing.component';

describe('ProgressCustomizingComponent', () => {
  let component: ProgressCustomizingComponent;
  let fixture: ComponentFixture<ProgressCustomizingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgressCustomizingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgressCustomizingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressInformationComponent } from './progress-information.component';

describe('ProgressInformationComponent', () => {
  let component: ProgressInformationComponent;
  let fixture: ComponentFixture<ProgressInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgressInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgressInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadIdentityCardComponent } from './upload-identity-card.component';

describe('UploadIdentityCardComponent', () => {
  let component: UploadIdentityCardComponent;
  let fixture: ComponentFixture<UploadIdentityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadIdentityCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(UploadIdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverInfoDialogComponent } from './driver-info-dialog.component';

describe('DriverInfoDialogComponent', () => {
  let component: DriverInfoDialogComponent;
  let fixture: ComponentFixture<DriverInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverInfoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriverInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

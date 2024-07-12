import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSaveButtonsComponent } from './cancel-save-buttons.component';

describe('CancelSaveButtonsComponent', () => {
  let component: CancelSaveButtonsComponent;
  let fixture: ComponentFixture<CancelSaveButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelSaveButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CancelSaveButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

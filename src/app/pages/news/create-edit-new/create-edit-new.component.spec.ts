import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditNewComponent } from './create-edit-new.component';

describe('CreateEditNewComponent', () => {
  let component: CreateEditNewComponent;
  let fixture: ComponentFixture<CreateEditNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

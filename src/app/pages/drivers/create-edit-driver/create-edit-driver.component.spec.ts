import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditDriverComponent } from './create-edit-driver.component';

describe('CreateEditDriverComponent', () => {
  let component: CreateEditDriverComponent;
  let fixture: ComponentFixture<CreateEditDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

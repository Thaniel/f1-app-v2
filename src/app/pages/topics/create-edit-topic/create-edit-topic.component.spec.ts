import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditTopicComponent } from './create-edit-topic.component';

describe('CreateEditTopicComponent', () => {
  let component: CreateEditTopicComponent;
  let fixture: ComponentFixture<CreateEditTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditTopicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

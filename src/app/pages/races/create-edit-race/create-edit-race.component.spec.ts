import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditRaceComponent } from './create-edit-race.component';

describe('CreateEditRaceComponent', () => {
  let component: CreateEditRaceComponent;
  let fixture: ComponentFixture<CreateEditRaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditRaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

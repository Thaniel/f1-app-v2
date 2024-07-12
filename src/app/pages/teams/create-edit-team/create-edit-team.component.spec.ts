import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditTeamComponent } from './create-edit-team.component';

describe('CreateEditTeamComponent', () => {
  let component: CreateEditTeamComponent;
  let fixture: ComponentFixture<CreateEditTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

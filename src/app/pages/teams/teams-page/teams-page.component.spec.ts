import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsPageComponent } from './teams-page.component';

describe('TeamsPageComponent', () => {
  let component: TeamsPageComponent;
  let fixture: ComponentFixture<TeamsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

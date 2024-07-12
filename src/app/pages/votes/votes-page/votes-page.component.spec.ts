import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotesPageComponent } from './votes-page.component';

describe('VotesPageComponent', () => {
  let component: VotesPageComponent;
  let fixture: ComponentFixture<VotesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VotesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

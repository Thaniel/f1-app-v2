import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRace } from '../../../core/interfaces/race.interface';
import { RacesService } from '../../../core/services/races/races.service';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-race-details',
  standalone: true,
  imports: [NavBarComponent, CommonModule],
  templateUrl: './race-details.component.html',
  styleUrl: './race-details.component.css'
})
export class RaceDetailsComponent implements OnInit {

  raceSelected: IRace = {
    id: '0',
    grandPrix: '',
    circuit: '',
    country: '',
    date: new Date(),
    firstPracticeDate: new Date(),
    secondPracticeDate: new Date(),
    thirdPracticeDate: new Date(),
    qualifyingDate: new Date(),
    appearance: 0,
    distance: 0,
    laps: 0,
    record: '',
    length: 0,
    description: '',
    image: null,
    imageUrl: '',
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly racesService: RacesService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      this.getRaceDetail(id);
    });
  }

  private async getRaceDetail(id: string | null) {
    if (id != null) {
      let data = await this.racesService.getById(id)
      
      if (data != null){
        this.raceSelected = data;
      }else{
        this.router.navigate(['/races']);
      }
    }else{
      this.router.navigate(['/races']);
    }
  }
}

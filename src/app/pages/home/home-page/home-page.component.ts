import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { IRace } from '../../../core/interfaces/race.interface';
import { RacesService } from '../../../core/services/races/races.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, NavBarComponent, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  nextRace: IRace = {
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

  races: IRace[] = [];

  constructor(
    private racesService: RacesService,
  ) { }

  ngOnInit() {
    this.getRaces();
  }

  async getRaces() {
    this.races = await this.racesService.getAll();
    
    this.findNextRace();
  }

  findNextRace() {
    const currentDate = new Date();
    
    this.nextRace = this.races
      .filter(race => new Date(race.date) > currentDate)[0] || null;
      //.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
  }
   
}

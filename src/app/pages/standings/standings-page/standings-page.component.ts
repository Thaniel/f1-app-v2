import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { ITeam } from '../../../core/interfaces/team.interface';
import { TeamsService } from '../../../core/services/teams/teams.service';
import { DriversService } from '../../../core/services/drivers/drivers.service';

@Component({
  selector: 'app-standings-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, CommonModule],
  templateUrl: './standings-page.component.html',
  styleUrl: './standings-page.component.css'
})
export class StandingsPageComponent implements OnInit{
  isDriversSelected: boolean = true;
  drivers : IDriver[] = [];
  teams : ITeam[] = [];

  constructor(
    private readonly teamsService: TeamsService,
    private readonly driversService: DriversService,
  ) { }

  ngOnInit(): void {
    this.getTeams();
    this.getDrivers();
  }

  async getTeams() {
    this.teams = await this.teamsService.getAll();
  }
  
  async getDrivers() {
    this.drivers = await this.driversService.getAll();
  }

  onSelectionChange(event: any) {
    this.isDriversSelected = (event.target.id === "btnDrivers");    
  }

  isTeam(obj: any): obj is ITeam {
    return obj && typeof obj.colorCode === 'string';
  }
}

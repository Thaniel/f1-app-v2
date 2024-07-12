import { Component } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standings-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, CommonModule],
  templateUrl: './standings-page.component.html',
  styleUrl: './standings-page.component.css'
})
export class StandingsPageComponent {

  isDriversSelected: boolean = true;


  onSelectionChange(event: any) {
    this.isDriversSelected = (event.target.id === "btnDrivers");    
  }
}

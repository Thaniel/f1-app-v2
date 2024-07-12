import { Component } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { IDriver } from '../../../core/interfaces/driver.interface';

@Component({
  selector: 'app-driver-details',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './driver-details.component.html',
  styleUrl: './driver-details.component.css'
})
export class DriverDetailsComponent {

  driver: IDriver = 
    {
      id: 1,
      firstName: "Lewis",
      lastName: "Hamilton",
      birthDate: new Date("1985-01-07"),
      country: "United Kingdom",
      points: 100,
      titles: 7,
      team: "#00D2BE",
    };
}

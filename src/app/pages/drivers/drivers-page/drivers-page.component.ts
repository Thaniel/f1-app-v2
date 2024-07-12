import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { CreateEditDriverComponent } from '../create-edit-driver/create-edit-driver.component';

@Component({
  selector: 'app-drivers-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, CommonModule, RouterLink, EditMenuComponent],
  templateUrl: './drivers-page.component.html',
  styleUrl: './drivers-page.component.css'
})
export class DriversPageComponent {

  drivers: IDriver[] = [
    {
      id: 1,
      firstName: "Lewis",
      lastName: "Hamilton",
      birthDate: new Date("1985-01-07"),
      country: "United Kingdom",
      points: 100,
      titles: 7,
      team: "#00D2BE",
    },
    {
      id: 2,
      firstName: "Max",
      lastName: "Verstappen",
      birthDate: new Date("1997-09-30"),
      country: "Netherlands",
      points: 95,
      titles: 0,
      team: "#1E41FF",
    },
    {
      id: 3,
      firstName: "Valtteri",
      lastName: "Bottas",
      birthDate: new Date("1989-08-28"),
      country: "Finland",
      points: 80,
      titles: 0,
      team: null
    },
    {
      id: 4,
      firstName: "Charles",
      lastName: "Leclerc",
      birthDate: new Date("1997-10-16"),
      country: "Monaco",
      points: 70,
      titles: 0,
      team: "#DC0000",
    },
    {
      id: 5,
      firstName: "Daniel",
      lastName: "Ricciardo",
      birthDate: new Date("1989-07-01"),
      country: "Australia",
      points: 60,
      titles: 0,
      team: "#006F62",
    },
    {
      id: 6,
      firstName: "Lando",
      lastName: "Norris",
      birthDate: new Date("1999-11-13"),
      country: "United Kingdom",
      points: 55,
      titles: 0,
      team: "#FF8700",
    }
  ];

  constructor(
    public dialog: MatDialog,
  ) { }

  editDriver(driver: IDriver): void {
    console.log("Edit driver: " + driver.id);

    this.dialog.open(CreateEditDriverComponent, {
      data: driver,
      width: '90vw',
    });
  }

  deleteDriver(driver: IDriver): void {
    console.log("Delete driver: " + driver.id);
    this.drivers = this.drivers.filter(d => d.id !== driver.id);
  }
}

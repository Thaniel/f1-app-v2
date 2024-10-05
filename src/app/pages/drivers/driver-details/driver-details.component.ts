import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { ITeam } from '../../../core/interfaces/team.interface';
import { DriversService } from '../../../core/services/drivers/drivers.service';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-driver-details',
  standalone: true,
  imports: [NavBarComponent, RouterLink],
  templateUrl: './driver-details.component.html',
  styleUrl: './driver-details.component.css'
})
export class DriverDetailsComponent implements OnInit {

  driverSelected: IDriver = {
    id: '',
    firstName: '',
    lastName: '',
    birthDate: new Date(),
    country: '',
    points: 0,
    titles: 0,
    team: null,
    image: null,
    imageUrl: '',
  };
  
  team: ITeam | null = null;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly driversService: DriversService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      this.getDriverDetail(id);
    });
  }

  private async getDriverDetail(id: string | null) {
    if (id != null) {
      let data = await this.driversService.getById(id)

      if (data != null) {
        this.driverSelected = data;
        this.team = this.driverSelected.team as ITeam;
      } else {
        this.router.navigate(['/drivers']);
      }
    } else {
      this.router.navigate(['/drivers']);
    }
  }
}

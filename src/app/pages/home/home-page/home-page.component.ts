import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ MatButtonModule, MatCommonModule, NavBarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  info: string[] = [
    "Hola que",
    "como ",
    "Hola tal",
    "como estamos",
    "Hola que tal",
    "como estamos hoy"
  ];
  responsiveOptions: any[] | undefined;

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }
}

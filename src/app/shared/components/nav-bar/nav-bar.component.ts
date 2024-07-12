import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  items: any[] | undefined;

  ngOnInit(): void {
    this.items = [
      { label: 'Home', icon: 'home', route: '/home' },
      { label: 'News', icon: 'newspaper', route: '/news' },
      { label: 'Schedule', icon: 'calendar_today', route: '/races' },
      { label: 'Teams', icon: 'directions_car', route: '/teams' },
      { label: 'Drivers', icon: 'sports_motorsports', route: '/drivers' },
      { label: 'Standings', icon: 'emoji_events', route: '/standings', },
      { label: 'Forum', icon: 'forum', route: '/forum', },
      { label: 'Votes', icon: 'thumb_up', route: '/votes', },
      { label: 'Profile', icon: 'person', route: '/profile', },
    ];
  }
}
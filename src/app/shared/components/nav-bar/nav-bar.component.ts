import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
      { label: $localize`:@@navNews:News`, icon: 'newspaper', route: '/news' },
      { label: $localize`:@@navSchedule:Schedule`, icon: 'calendar_today', route: '/races' },
      { label: $localize`:@@navTeams:Teams`, icon: 'directions_car', route: '/teams' },
      { label: $localize`:@@navDrivers:Drivers`, icon: 'sports_motorsports', route: '/drivers' },
      { label: $localize`:@@navStandings:Standings`, icon: 'emoji_events', route: '/standings' },
      { label: $localize`:@@navForum:Forum`, icon: 'forum', route: '/topics' },
      { label: $localize`:@@navVotes:Votes`, icon: 'thumb_up', route: '/votes' },
      { label: $localize`:@@navProfile:Profile`, icon: 'person', route: '/profile' },
    ];
  }
}
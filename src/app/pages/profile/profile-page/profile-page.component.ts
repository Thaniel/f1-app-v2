import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router : Router,
  ){}
  
  ngOnInit() {
    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user == null) {
        this.router.navigate(['/login']); // User is not authenticated
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  public logOut(): void{
    this.authService.logout();
  }
}

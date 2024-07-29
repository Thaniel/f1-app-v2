import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersService } from '../../../core/services/users/users.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  userInfo: { key: string, value: any }[] = [];
  user: IUser = {
    id: '',
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    birthdate: new Date,
    country: '',
    isAdmin: false,
  };

  private readonly keyMap: { [key: string]: string } = {
    userName: 'User name',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    birthdate: 'Birthdate',
    country: 'Country',
    isAdmin: 'Is admin'
  };

  private readonly keyOrder: string[] = [
    'userName',
    'firstName',
    'lastName',
    'email',
    'birthdate',
    'country',
    'isAdmin'
  ];

  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.checkUserAuth();
    this.getUserInfo();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private checkUserAuth(): void {
    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user == null) {
        this.router.navigate(['/auth/login']); // User is not authenticated
      }
    });
  }

  private async getUserInfo() {
    const uid = localStorage.getItem("uid");
    if (uid) {
      const response = await this.usersService.getById(uid);
      if (response != null) {
        this.user = response;
        this.userInfo = this.transformUserToKeyValue(this.user);
      }
    }
  }

  private transformUserToKeyValue(user: IUser): { key: string, value: any }[] {
    return this.keyOrder
      .filter(key => key in user)
      .map(key => ({ key: this.keyMap[key], value: user[key as keyof IUser] }));
  }

  public logOut(): void {
    this.authService.logout();
  }
}

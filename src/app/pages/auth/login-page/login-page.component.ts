import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ILogin } from '../../../core/interfaces/login.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { emailPattern } from '../../../shared/directives/validators';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MatInputModule, CommonModule, ReactiveFormsModule, MatButtonModule, SnackBarComponent, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  private authSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.router.navigate(['/home']); // User is authenticated
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {      
      this.authSubscription.unsubscribe();
    }
  }

  get currentLogin(): ILogin {
    return this.loginForm.value as ILogin;
  }

  isValidField(field: string): boolean | null {
    return this.loginForm.controls[field].errors && this.loginForm.controls[field].touched;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      this.authService.login(this.currentLogin.email, this.currentLogin.password).subscribe({
        next: () => {
          this.showSnackBar(true);
        },
        error: (err) => {
          this.showSnackBar(false);
          console.error(err);
        }
      });
    }
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: 0, context: 'auth' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }

  public routeToRegister(): void {
    this.router.navigateByUrl('/register');
  }
}

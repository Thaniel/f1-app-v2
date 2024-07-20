import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ILogin } from '../../../core/interfaces/login.interface';
import { MatInputModule } from '@angular/material/input';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { emailPattern } from '../../../shared/directives/validators';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TIME_OUT } from '../../../shared/constants/constants';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MatInputModule, CommonModule, ReactiveFormsModule, MatButtonModule, SnackBarComponent, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
 
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
  ) {
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
      // TODO authService
      console.log("authService");
      this.authService.login(this.currentLogin.email, this.currentLogin.password).subscribe({
        next: () => {
          this.showSnackBar(true);
          this.router.navigateByUrl('/home'); // Cambia la ruta según tu aplicación
        },
        error: (err) => {
          this.showSnackBar(false);
          console.error(err);
        }
      });
    }
  }

  private showSnackBar(isOk: boolean): void {  // TODO refactor
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { text: (isOk) ? 'Login successful!' : 'Login failed!', isOk: isOk },
      panelClass: [(isOk) ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top'
    });
  }
  
  public routeToRegister() {
    this.router.navigateByUrl('/login/register'); // TODO
  }
}

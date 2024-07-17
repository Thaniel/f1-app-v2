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
      // TODO loginService
      console.log("loginService");
      
    }
  }

  public routeToRegister() {
    this.router.navigateByUrl('/login/register'); // TODO
  }
}

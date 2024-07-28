import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IRegister } from '../../../core/interfaces/register.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { emailPattern } from '../../../shared/directives/validators';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [MatInputModule, CommonModule, ReactiveFormsModule, MatButtonModule, SnackBarComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  public registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    country: ['', [Validators.required]],
    birthdate: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    password: ['', [Validators.required]],
    passwordRepited: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
  ) {
  }

  get currentRegister(): IRegister {
    return this.registerForm.value as IRegister;
  }

  isValidField(field: string): boolean | null {
    return this.registerForm.controls[field].errors && this.registerForm.controls[field].touched;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    } else {
      this.authService.register(this.currentRegister.email, this.currentRegister.password).subscribe({
        next: () => {
          this.showSnackBar(true);
          this.router.navigateByUrl('/login');
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
      data: { isOk: isOk, action: 1, context: 'auth' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }

  public routeToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}

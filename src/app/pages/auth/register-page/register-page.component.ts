import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { emailPattern } from '../../../shared/directives/validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IRegister } from '../../../core/interfaces/register.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TIME_OUT } from '../../../shared/constants/constants';

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

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    } else {
      // TODO authService
      console.log("authService");
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
  
  private showSnackBar(isOk: boolean): void {  // TODO refactor
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { text: (isOk) ? 'Registration successful!' : 'Registration failed!', isOk: isOk },
      panelClass: [(isOk) ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top'
    });
  }

  public routeToLogin() {
    this.router.navigateByUrl('/login/login'); // TODO
  }
}

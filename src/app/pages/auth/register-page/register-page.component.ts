import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IRegister } from '../../../core/interfaces/register.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { emailPattern } from '../../../shared/directives/validators';
import { ValidatorsService } from '../../../shared/services/validators.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [MatInputModule, CommonModule, ReactiveFormsModule, MatButtonModule, SnackBarComponent, MatIcon],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  public hidePassword = true;
  public hideRepeatPassword = true;

  public registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    country: ['', [Validators.required]],
    birthdate: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordRepeated: ['', [Validators.required]],
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password', 'passwordRepeated')
    ]
  });

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
  ) {
  }

  get currentRegister(): IRegister {
    return this.registerForm.value as IRegister;
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.registerForm, field);
  }

  public isFieldUserNameInUse(field: string): boolean {
    const control = this.registerForm.get(field);
    return control!.hasError('usernameInUse') && control!.touched;
  }

  public isFieldEmailInUse(field: string): boolean {
    const control = this.registerForm.get(field);
    return control!.hasError('emailInUse') && control!.touched;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleRepeatPasswordVisibility() {
    this.hideRepeatPassword = !this.hideRepeatPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    } else {
      this.authService.register(this.currentRegister).subscribe({
        next: () => {
          this.showSnackBar(true);
          this.routeToLogin();
        },
        error: (err) => {
          if (err.name === 'UsernameInUseError') {
            this.registerForm.get('userName')?.setErrors({ usernameInUse: true });
            this.registerForm.get('userName')?.markAsTouched();
          } else if (err.name === 'EmailInUseError') {
            this.registerForm.get('email')?.setErrors({ emailInUse: true });
            this.registerForm.get('email')?.markAsTouched();
          }
          this.showSnackBar(false);
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
    this.router.navigateByUrl('/auth/login');
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { emailPattern } from '../../../shared/directives/validators';
import { ValidatorsService } from '../../../shared/services/validators.service';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [MatInputModule, CommonModule, ReactiveFormsModule, MatButtonModule, SnackBarComponent],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  public emailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    });
  }

  get currentEmail(): string {
    return this.emailForm.value as string;
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.emailForm, field);
  }

  onSubmit() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
    } else {
      this.authService.recoverPassword(this.currentEmail).subscribe({
        next: () => {
          this.showSnackBar(true);
          this.routeToLogin();
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
      data: { isOk: isOk, action: 2, context: 'auth' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }

  public routeToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}

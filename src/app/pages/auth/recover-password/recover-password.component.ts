import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailPattern } from '../../../shared/directives/validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [MatInputModule, CommonModule, ReactiveFormsModule, MatButtonModule, SnackBarComponent],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {

  public emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
  });

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  get currentEmail(): string {
    return this.emailForm.value as string;
  }

  isValidField(field: string): boolean | null {
    return this.emailForm.controls[field].errors && this.emailForm.controls[field].touched;
  }

  onSubmit() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
    } else {
      // TODO loginService
      console.log("Send email");

    }
  }

  public routeToLogin() {
    this.router.navigateByUrl('/login/login'); // TODO
  }
}

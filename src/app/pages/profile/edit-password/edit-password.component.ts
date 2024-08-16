import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IChangePassword } from '../../../core/interfaces/changePassword.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { ValidatorsService } from '../../../shared/services/validators.service';

@Component({
  selector: 'app-edit-password',
  standalone: true,
  imports: [MatInputModule, MatDialogModule, CommonModule, ReactiveFormsModule, CancelSaveButtonsComponent, MatButtonModule, MatIcon],
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.css'
})
export class EditPasswordComponent {

  public hideOldPassword = true;
  public hideNewPassword = true;
  public hideNewPasswordRepeat = true;

  public passwordForm: FormGroup = this.fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPasswordRepeated: ['', [Validators.required]],
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('newPassword', 'newPasswordRepeated')
    ]
  });

  constructor(
    public dialogRef: MatDialogRef<EditPasswordComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private validatorsService: ValidatorsService,
    private authService: AuthService,
  ) { }

  get currentChangePassword(): IChangePassword {
    return this.passwordForm.value as IChangePassword;
  }


  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.passwordForm, field);
  }

  public isInvalidCredential(field: string): boolean {
    const control = this.passwordForm.get(field);
    return control!.hasError('invalidCredential') && control!.touched;
  }

  toggleOldPasswordVisibility() {
    this.hideOldPassword = !this.hideOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleNewPasswordRepeatVisibility() {
    this.hideNewPasswordRepeat = !this.hideNewPasswordRepeat;
  }

  public onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
    } else {
      this.updatePassword();
    }
  }

  private updatePassword(): void {
    console.log(this.currentChangePassword);
    this.authService.changePassword(this.currentChangePassword.oldPassword, this.currentChangePassword.newPassword).subscribe({
      next: () => {
        this.showSnackBar(true, 2);
        this.dialogRef.close();
      },
      error: (err) => {
        if (err.name === 'InvalidCredential') {
          this.passwordForm.get('oldPassword')?.setErrors({ invalidCredential: true });
          this.passwordForm.get('oldPassword')?.markAsTouched();
        }
        this.showSnackBar(false, 2);
      }
    });
  }

  public save(): void {
    this.onSubmit();
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  private showSnackBar(isOk: boolean, action: number): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: action, context: 'user' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}

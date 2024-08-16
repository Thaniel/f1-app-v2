import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersService } from '../../../core/services/users/users.service';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { ValidatorsService } from '../../../shared/services/validators.service';

@Component({
  selector: 'app-edit-user-data',
  standalone: true,
  imports: [MatInputModule, MatDialogModule, CommonModule, ReactiveFormsModule, CancelSaveButtonsComponent],
  templateUrl: './edit-user-data.component.html',
  styleUrl: './edit-user-data.component.css'
})
export class EditUserDataComponent {

  public userForm: FormGroup = this.fb.group({
    id: [],
    userName: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: [],
    birthdate: ['', [Validators.required]],
    country: ['', [Validators.required]],
    isAdmin: [],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IUser,
    public dialogRef: MatDialogRef<EditUserDataComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private usersService: UsersService,
    private validatorsService: ValidatorsService,
    private authService: AuthService,
  ) {
    if (data) {
      this.userForm.patchValue(data);
    }
  }

  get currentUser(): IUser {
    return this.userForm.value as IUser;
  }

  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.userForm, field);
  }

  public isFieldUserNameInUse(field: string): boolean {
    const control = this.userForm.get(field);
    return control!.hasError('usernameInUse') && control!.touched;
  }

  public onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else {
      this.updateUserData();
    }
  }

  private updateUserData(): void {
    const updatedData: Partial<IUser> = {
      userName: this.currentUser.userName,
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      birthdate: this.currentUser.birthdate,
      country: this.currentUser.country,
    };


    this.isUserNameChanged(updatedData).then(isChanged => {
      this.usersService.update(this.currentUser.id, updatedData, isChanged).subscribe({
        next: () => {
          this.showSnackBar(true, 0);
          this.dialogRef.close();
          this.usersService.loadUser();
        },
        error: (err) => {
          if (err.name === 'UsernameInUseError') {
            this.userForm.get('userName')?.setErrors({ usernameInUse: true });
            this.userForm.get('userName')?.markAsTouched();
          }

          this.showSnackBar(false, 0);
        }
      });
    });
  }

  private async isUserNameChanged(updatedData: Partial<IUser>): Promise<boolean> {
    const currentUser = await this.authService.getCurrentUserInfo();
    return currentUser?.userName !== updatedData.userName;
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

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersService } from '../../../core/services/users/users.service';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { ValidatorsService } from '../../../shared/services/validators.service';


@Component({
  selector: 'app-edit-permissions',
  standalone: true,
  imports: [MatInputModule, MatDialogModule, CommonModule, ReactiveFormsModule, CancelSaveButtonsComponent, MatButtonModule, MatIcon, MatOption, MatAutocompleteModule, MatRadioModule],
  templateUrl: './edit-permissions.component.html',
  styleUrl: './edit-permissions.component.css'
})
export class EditPermissionsComponent implements OnInit {
  public hidePassword = true;
  public users: IUser[] = [];

  public userControl = new FormControl<IUser | null>(null, Validators.required);
  public filteredUsers: Observable<IUser[]> = this.userControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filterUsers(typeof value === 'string' ? value : value?.userName ?? ''))
  );

  public permissionsForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    userName: this.userControl,
    permissions: this.fb.group({
      isEnabled: [true, Validators.required],
    })
  });

  constructor(
    public dialogRef: MatDialogRef<EditPermissionsComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private validatorsService: ValidatorsService,
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  private async getAllUsers() {
    this.users = await this.usersService.getAll();
  }

  private _filterUsers(value: string): IUser[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.userName.toLowerCase().includes(filterValue));
  }

  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.permissionsForm, field);
  }

  public isInvalidCredential(field: string): boolean {
    const control = this.permissionsForm.get(field);
    return control!.hasError('invalidCredential') && control!.touched;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  public onSubmit(): void {
    if (this.permissionsForm.invalid) {
      this.permissionsForm.markAllAsTouched();
    } else {
      const formValue = this.permissionsForm.value;
      const userId = this.getUserId(formValue.userName);

      if (!userId) {
        this.permissionsForm.get('userName')?.setErrors({ required: true });
      } else {
        this.changePermissions(formValue.password, userId, formValue.permissions.isEnabled);
      }
    }
  }

  private getUserId(userName: string): string | undefined {
    const user: IUser | undefined = this.users.find(user => user.userName.toLowerCase() === userName.toLowerCase());
    return (user) ? user.id : undefined;
  }

  private changePermissions(password: string, userId: string, permissions: boolean) {
    this.authService.verifyPassword(password).pipe(
      switchMap(isValid => {
        if (isValid) {
          return this.usersService.updatePermissions(userId, permissions);
        } else {
          return throwError(() => new Error('InvalidCredential'));
        }
      }),
      tap(() => {
        this.showSnackBar(true, 0);
        this.dialogRef.close();
        this.usersService.loadUser();
      }),
      catchError(err => {
        if (err.message === 'InvalidCredential') {
          this.permissionsForm.get('password')?.setErrors({ invalidCredential: true });
          this.permissionsForm.get('password')?.markAsTouched();
          this.showSnackBar(false, 0);
        } else {
          this.showSnackBar(false, 0);
        }
        return of();
      })
    ).subscribe();
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

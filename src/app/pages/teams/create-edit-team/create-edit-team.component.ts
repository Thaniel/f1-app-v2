import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ITeam } from '../../../core/interfaces/team.interface';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';

@Component({
  selector: 'app-create-edit-team',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, CancelSaveButtonsComponent],
  templateUrl: './create-edit-team.component.html',
  styleUrl: './create-edit-team.component.css'
})
export class CreateEditTeamComponent {

  isCreating: boolean = true;
  titleAction: string = "Create";

  public teamForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    teamPrincipal: ['', [Validators.required]],
    titles: ['', [Validators.required]],
    points: ['', [Validators.required]],
    color: ['', [Validators.required]],
    driver1: ['', [Validators.required]],
    driver2: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITeam,
    public dialogRef: MatDialogRef<CreateEditTeamComponent>,
    private fb: FormBuilder,
  ) {
    if (data) {
      this.teamForm.patchValue(data);
      this.isCreating = false;
    }
  }

  get team(): ITeam {
    return this.teamForm.value as ITeam;
  }

  isValidField(field: string): boolean | null {
    return this.teamForm.controls[field].errors && this.teamForm.controls[field].touched;
  }

  onSubmit(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
    } else {
      if (this.isCreating) {
        console.error("Create team: " + this.team.id + " : " + this.team.name);
      } else {
        console.error("Edit new: " + this.team.id + " : " + this.team.name);
      }
      this.dialogRef.close();
    }
  }

  save(): void {
    this.onSubmit();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

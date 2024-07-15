import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IRace } from '../../../core/interfaces/race.interface';
import { RacesService } from '../../../core/services/races/races.service';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';

@Component({
  selector: 'app-create-edit-race',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, CancelSaveButtonsComponent, FileInputComponent],
  templateUrl: './create-edit-race.component.html',
  styleUrl: './create-edit-race.component.css'
})
export class CreateEditRaceComponent {
  isCreating: boolean = true;
  titleAction: string = "Create";
  selectedFile: File | null = null;

  public raceForm: FormGroup = this.fb.group({
    id: [],
    grandPrix: ['', [Validators.required]],
    circuit: ['', [Validators.required]],
    country: ['', [Validators.required]],
    firstPracticeDate: ['', [Validators.required]],
    secondPracticeDate: ['', [Validators.required]],
    thirdPracticeDate: ['', [Validators.required]],
    classificationDate: ['', [Validators.required]],
    date: ['', [Validators.required]],
    appearance: ['', [Validators.required]],
    distance: ['', [Validators.required]],
    laps: ['', [Validators.required]],
    record: ['', [Validators.required]],
    length: ['', [Validators.required]],
    description: ['', [Validators.required]],
    image: [],
    imageURL: [],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IRace,
    public dialogRef: MatDialogRef<CreateEditRaceComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private racesService: RacesService,
  ) {
    if (data) {
      this.raceForm.patchValue(data);
      this.isCreating = false;
      if (data.image) {
        this.selectedFile = data.image;
      }
    }
  }

  get currentRace(): IRace {
    return this.raceForm.value as IRace;
  }

  isValidField(field: string): boolean | null {
    return this.raceForm.controls[field].errors && this.raceForm.controls[field].touched;
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  onSubmit(): void {
    if (this.raceForm.invalid || this.selectedFile == null) {
      this.raceForm.markAllAsTouched();
    } else {
      this.currentRace.image = this.selectedFile;

      if (this.isCreating) {
        this.createRace();
      } else {
        this.updateRace();
      }
      this.dialogRef.close();
    }
  }
  
  private async createRace() {
    this.racesService.create(this.currentRace).then(success => {
      this.showSnackBar(success, 0);
      this.racesService.loadRaces();
    });
  }

  private async updateRace() {
    const updatedData: Partial<IRace> = {
      grandPrix: this.currentRace.grandPrix,
      circuit: this.currentRace.circuit,
      country: this.currentRace.country,
      date: this.currentRace.date,
      firstPracticeDate: this.currentRace.firstPracticeDate,
      secondPracticeDate: this.currentRace.secondPracticeDate,
      thirdPracticeDate: this.currentRace.thirdPracticeDate,
      classificationDate: this.currentRace.classificationDate,
      appearance: this.currentRace.appearance,
      distance: this.currentRace.distance,
      laps: this.currentRace.laps,
      record: this.currentRace.record,
      length: this.currentRace.length,
      description: this.currentRace.description,
    };

    this.racesService.update(this.currentRace.id, updatedData, this.selectedFile).then(success => {
      this.showSnackBar(success, 1);
      this.racesService.loadRaces();
    });
  }

  save(): void {
    this.onSubmit();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private showSnackBar(isOk: boolean, action: number): void {  // TODO refactor
    let actionOK;
    let actionKO;
    switch (action) {
      case 0: {
        actionOK = 'Race created';
        actionKO = 'Error while creating race';
        break;
      }
      case 1: {
        actionOK = 'Race edited';
        actionKO = 'Error while editing race';
        break;
      }
      default: { break; }
    }

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { text: (isOk) ? actionOK : actionKO, isOk: isOk },
      panelClass: [(isOk) ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top'
    });
  }
}

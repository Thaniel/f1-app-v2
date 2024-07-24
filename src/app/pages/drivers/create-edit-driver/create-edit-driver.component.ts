import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { ITeam } from '../../../core/interfaces/team.interface';
import { DriversService } from '../../../core/services/drivers/drivers.service';
import { TeamsService } from '../../../core/services/teams/teams.service';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';

@Component({
  selector: 'app-create-edit-driver',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, CancelSaveButtonsComponent, FileInputComponent, MatOptionModule, MatSelectModule],
  templateUrl: './create-edit-driver.component.html',
  styleUrl: './create-edit-driver.component.css'
})
export class CreateEditDriverComponent implements OnInit {
  isCreating: boolean = true;
  titleAction: string = "Create";
  selectedFile: File | null = null;

  teams: ITeam[] = [];

  public driverForm: FormGroup = this.fb.group({
    id: [],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    country: ['', [Validators.required]],
    points: ['', [Validators.required]],
    titles: ['', [Validators.required]],
    team: ['', [Validators.required]],
    image: [],
    imageUrl: [],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDriver,
    public dialogRef: MatDialogRef<CreateEditDriverComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private driversService: DriversService,
    private teamsService: TeamsService,
  ) {
    if (data) {
      this.driverForm.patchValue({
        ...data,
        team: data.team ? data.team.id : 'null',
      });

      if (data.image) {
        this.selectedFile = data.image;
      }

      this.isCreating = false;
    }
  }

  ngOnInit(): void {
    this.getTeams();
  }

  async getTeams() {
    this.teams = await this.teamsService.getAll();

    this.sortTeamsByName();

    this.teams.unshift({
      id: 'null',
      name: 'Team not selected',
      fullName: '',
      teamPrincipal: '',
      titles: 0,
      points: 0,
      colorCode: '',
      driver1: null,
      driver2: null,
      description: '',
      carImage: null,
      carImageUrl: '',
      logoImage: null,
      logoImageUrl: '',
    });
  }

  get currentDriver(): IDriver {
    return this.driverForm.value as IDriver;
  }

  isValidField(field: string): boolean | null {
    return this.driverForm.controls[field].errors && this.driverForm.controls[field].touched;
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  onSubmit(): void {
    if (this.driverForm.invalid || this.selectedFile == null) {
      this.driverForm.markAllAsTouched();
    } else {
      this.currentDriver.image = this.selectedFile;

      if (this.isCreating) {
        this.createDriver();
      } else {
        this.updateDriver();
      }
      this.dialogRef.close();
    }
  }

  private async createDriver() {
    this.driversService.create(this.currentDriver).then(success => {
      this.showSnackBar(success, 0);
      this.driversService.loadDrivers();
    });
  }

  private async updateDriver() {
    const updatedData: Partial<IDriver> = {
      firstName: this.currentDriver.firstName,
      lastName: this.currentDriver.lastName,
      birthDate: this.currentDriver.birthDate,
      country: this.currentDriver.country,
      points: this.currentDriver.points,
      titles: this.currentDriver.titles,
      team: this.currentDriver.team,
    }

    this.driversService.update(this.currentDriver.id, updatedData, this.selectedFile).then(success => {
      this.showSnackBar(success, 1);
      this.driversService.loadDrivers();
    });
  }

  save(): void {
    this.onSubmit();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private showSnackBar(isOk: boolean, action: number): void { // TODO refactor
    let actionOK;
    let actionKO;
    switch (action) {
      case 0: {
        actionOK = 'Driver created';
        actionKO = 'Error while creating driver';
        break;
      }
      case 1: {
        actionOK = 'Driver edited';
        actionKO = 'Error while editing driver';
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

  private sortTeamsByName(): void {
    this.teams.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}

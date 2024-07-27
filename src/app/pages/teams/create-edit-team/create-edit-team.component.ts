import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColorPickerModule } from 'ngx-color-picker';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { ITeam } from '../../../core/interfaces/team.interface';
import { DriversService } from '../../../core/services/drivers/drivers.service';
import { TeamsService } from '../../../core/services/teams/teams.service';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';


@Component({
  selector: 'app-create-edit-team',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, CancelSaveButtonsComponent, FileInputComponent, ColorPickerModule, MatOptionModule, MatSelectModule],
  templateUrl: './create-edit-team.component.html',
  styleUrl: './create-edit-team.component.css'
})
export class CreateEditTeamComponent implements OnInit {
  isCreating: boolean = true;
  titleAction: string = "Create";
  selectedCarFile: File | null = null;
  selectedLogoFile: File | null = null;
  color: string = '#ffffff';

  drivers: IDriver[] = [];

  public teamForm: FormGroup = this.fb.group({
    id: [],
    name: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    teamPrincipal: ['', [Validators.required]],
    titles: ['', [Validators.required]],
    points: ['', [Validators.required]],
    colorCode: ['', [Validators.required]],
    driver1: ['', [Validators.required]],
    driver2: ['', [Validators.required]],
    description: ['', [Validators.required]],
    carImage: [],
    carImageUrl: [],
    logoImage: [],
    logoImageUrl: [],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITeam,
    public dialogRef: MatDialogRef<CreateEditTeamComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private teamsService: TeamsService,
    private driversService: DriversService,
  ) {
    if (data) {
      this.teamForm.patchValue({
        ...data,
        driver1: data.driver1 ? data.driver1.id : 'null', 
        driver2: data.driver2 ? data.driver2.id : 'null', 
      });
      
      if(data.carImage && data.logoImage){
        this.selectedCarFile = data.carImage;
        this.selectedLogoFile = data.logoImage;
      }

      this.isCreating = false;
      this.color = data.colorCode;   
    }
  }

  ngOnInit(): void {
    this.getDrivers();
  }

  async getDrivers() {
    this.drivers = await this.driversService.getAll();

    this.sortDriversByName();

    this.drivers.unshift({
      id: 'null',
      firstName: 'Driver not selected',
      lastName: '',
      birthDate: new Date(),
      country: '',
      points: 0,
      titles: 0,
      team: null,
      image: null,
      imageUrl: '',
    });
  }

  get currentTeam(): ITeam {
    return this.teamForm.value as ITeam;
  }

  isValidField(field: string): boolean | null {
    return this.teamForm.controls[field].errors && this.teamForm.controls[field].touched;
  }

  onCarFileSelected(file: File) {
    this.selectedCarFile = file;
  }

  onLogoFileSelected(file: File) {
    this.selectedLogoFile = file;
  }

  onColorChange(event: string): void {
    this.teamForm.get('colorCode')?.setValue(event);
  }

  onSubmit(): void {
    if (this.teamForm.invalid || this.selectedCarFile == null || this.selectedLogoFile == null) {
      this.teamForm.markAllAsTouched();
    } else {
      this.currentTeam.carImage = this.selectedCarFile;
      this.currentTeam.logoImage = this.selectedLogoFile;

      if (this.isCreating) {
        this.createTeam();
      } else {
        this.updateTeam();
      }
      this.dialogRef.close();
    }
  }

  private async createTeam() {
    this.teamsService.create(this.currentTeam).then(success => {
      this.showSnackBar(success, 0);
      this.teamsService.loadTeams();
    });
  }

  private async updateTeam() {
    const updatedData: Partial<ITeam> = {
      name: this.currentTeam.name,
      fullName: this.currentTeam.fullName,
      teamPrincipal: this.currentTeam.teamPrincipal,
      titles: this.currentTeam.titles,
      points: this.currentTeam.points,
      colorCode: this.currentTeam.colorCode,
      driver1: this.currentTeam.driver1,
      driver2: this.currentTeam.driver2,
      description: this.currentTeam.description,
    }
    
    this.teamsService.update(this.currentTeam.id, updatedData, this.selectedCarFile, this.selectedLogoFile).then(success => {
      this.showSnackBar(success, 1);
      this.teamsService.loadTeams();
    });
  }

  save(): void {
    this.onSubmit();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private showSnackBar(isOk: boolean, action: number): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: action, context: 'team' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }

  private sortDriversByName(): void {
    this.drivers.sort((a, b) => {
      if (a.firstName < b.firstName) {
        return -1;
      } else if (a.firstName > b.firstName) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}

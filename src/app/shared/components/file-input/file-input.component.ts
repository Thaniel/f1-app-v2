import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatInputModule, MatFormFieldModule],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css'
})
export class FileInputComponent implements OnInit{
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  @Input() initialImage: File | null = null;
  @Input() title: string = "";
  @Output() fileSelected = new EventEmitter<File>();

  ngOnInit() {
    if (this.initialImage) {
      this.previewFile(this.initialImage);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    this.previewFile(this.selectedFile);
  }

  private previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;      
      this.fileSelected.emit(file);
    };
    reader.readAsDataURL(file);
  }
}
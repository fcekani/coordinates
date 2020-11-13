import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FileExcelService } from './excel-json.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(
    private fileExcelService: FileExcelService,
    private toastrService: ToastrService) {
  }

  title = 'Coordinates';
  fileName: string;
  uploadedFile: File;
  jsonFile: any;

  ngOnInit(): void {
    this.initializeForm();
  }

  uploadFile = (event) => {
    this.fileName = event.target.files[0].name;
    this.uploadedFile = event.target.files[0];
  }

  convertFile = async () => {
    this.jsonFile = await this.fileExcelService.convertExcelToJson(this.uploadedFile);
    this.uploadedFile = null;
    this.toastrService.success('File converted successfully', 'Success');
  }

  downloadToExcel = () => {
    if (this.jsonFile !== null) {
      this.fileExcelService.saveToExcel(this.jsonFile);
      this.toastrService.success('File downloaded successfully', 'Success');
      this.initializeForm();
    } else {
      this.toastrService.error('Please choose and upload a file first', 'Error');
    }
  }

  initializeForm = () => {
    this.uploadedFile = null;
    this.jsonFile = null;
    this.fileName = 'Choose file';
  }
}

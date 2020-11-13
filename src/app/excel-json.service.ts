import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { WorkBook, read, utils, write, readFile } from 'xlsx';
import { ExcelRowModel } from './models/excel-model';
import { toLatLon } from 'utm';
import { CoordinateModel } from './models/coordinate-model';

@Injectable()
export class FileExcelService {

  private wbout = [];
  private table = [];
  private ws: any;
  constructor() {
    this.setExcelProperties();
  }

  public saveToExcel(tableData) {
    this.setTableData(tableData);
    saveAs(new Blob([this.s2ab(this.wbout)], { type: 'application/octet-stream' }), 'Converted File.xlsx');
  }

  private s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    };
    return buf;
  }

  private getTableData() {
    return this.table;
  }

  private setTableData(tableData) {
    this.table = tableData;
    this.setExcelProperties();
  }

  // excel Detail
  private setExcelProperties() {
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    this.ws = utils.json_to_sheet(this.getTableData());
    wb.SheetNames.push('Converted File');
    wb.Sheets['Converted File'] = this.ws;
    this.wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
  }

  public convertExcelToJson(file) {
    let reader = new FileReader();
    let workbook;
    let excelRows: any;
    let parsedExcelRows: ExcelRowModel[] = [];
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
      reader.onload = function () {
        let data = reader.result;
        workbook = read(data, { type: 'binary' });
        workbook.SheetNames.forEach(function (sheetName) {
          excelRows = utils.sheet_to_json(workbook.Sheets[sheetName]);
          excelRows.forEach((excelRow: ExcelRowModel) => {
            const toDeg: CoordinateModel = toLatLon(excelRow.XUTM ,excelRow.YUTM, 34, 'N');
            excelRow.XDecimal = toDeg.latitude;
            excelRow.YDecimal = toDeg.longitude;
            parsedExcelRows.push(excelRow);
          });
          console.log(parsedExcelRows);
          resolve(excelRows);
        });
      };
    });
  }
}

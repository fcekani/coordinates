import { TestBed } from '@angular/core/testing';

import { ExcelJsonService } from './excel-json.service';

describe('ExcelJsonService', () => {
  let service: ExcelJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

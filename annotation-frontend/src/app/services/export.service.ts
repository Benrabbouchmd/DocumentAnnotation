import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(private http: HttpClient) {}

  exportAnnotations(annotationData: any) {
    return this.http
      .post<any>(
        'http://127.0.0.1:8000/annotations/export_annotations/',
        annotationData
      )
      .pipe(
        catchError((error) => {
          return throwError('Error exporting annotations.');
        })
      );
  }
}

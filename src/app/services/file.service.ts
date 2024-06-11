import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<any>('http://147.182.235.130/api2/uploads/image', formData);
  }

  getFile(filePath: string): Observable<Blob> {
    return this.http.get(`http://147.182.235.130/api2/${filePath}`, { responseType: 'blob' });
  }

}

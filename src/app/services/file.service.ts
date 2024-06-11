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

    return this.http.post<any>('http://localhost:8080/uploads/image', formData);
  }

  getFile(filePath: string): Observable<Blob> {
    return this.http.get(`http://localhost:8080/${filePath}`, { responseType: 'blob' });
  }

}

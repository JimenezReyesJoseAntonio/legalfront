import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private baseUrl = 'http://147.182.235.130/api2/image'; // URL base de tu API

  constructor(private http: HttpClient) {}

  saveImage(path: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, { path });
  }

  getImagePathById(id: number): Observable<{ path: string }> {
    return this.http.get<{ path: string }>(`${this.baseUrl}/${id}`);
  }

  updateImageById(id: number, newPath: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, { newPath: newPath });//new
  }}

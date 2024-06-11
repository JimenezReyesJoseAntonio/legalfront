import { Injectable } from '@angular/core';
import { Servicio } from '../models/servicio.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private apiUrl = 'http://localhost:8080/servicios';

  constructor(private http: HttpClient) {}

  getPublications(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  getPublication(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
  }

  createPublication(publication: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, publication);
  }

  updatePublication(id: number, updateData: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}`, updateData);
  }}

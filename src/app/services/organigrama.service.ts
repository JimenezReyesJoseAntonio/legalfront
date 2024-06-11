import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Organigrama } from '../models/organigrama.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganigramaService {

  private apiUrl = 'http://147.182.235.130/api2/organigrama';

  constructor(private http: HttpClient) {}

  getPublications(): Observable<Organigrama[]> {
    return this.http.get<Organigrama[]>(this.apiUrl);
  }

  getPublication(id: number): Observable<Organigrama> {
    return this.http.get<Organigrama>(`${this.apiUrl}/${id}`);
  }

  createPublication(publication: Organigrama): Observable<Organigrama> {
    return this.http.post<Organigrama>(this.apiUrl, publication);
  }

  updatePublication(id: number, updateData: Partial<Organigrama>): Observable<Organigrama> {
    return this.http.put<Organigrama>(`${this.apiUrl}/${id}`, updateData);
  }}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Informacion } from '../models/infor.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
   apiUrl = 'http://localhost:8080/informacion'; // Reemplaza esto con la URL de tu API

  constructor(private http: HttpClient) { }

  // Método para obtener la información de la empresa por su ID
  getInformacionEmpresa(id: number): Observable<Informacion> {
    return this.http.get<Informacion>(`${this.apiUrl}/${id}`);
  }

  // Método para actualizar la información de la empresa
  updateInformacionEmpresa(id: number, data: Partial<Informacion>): Observable<Informacion> {
    return this.http.put<Informacion>(`${this.apiUrl}/${id}`, data);
  }
  
}

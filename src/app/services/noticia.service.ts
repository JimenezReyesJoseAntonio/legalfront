import { Injectable } from '@angular/core';
import { Noticia } from '../models/noticia.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {

  private apiUrl = 'http://localhost:8080/noticias';

  constructor(private http: HttpClient) {}

  getPublications(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.apiUrl);
  }

  getPublication(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.apiUrl}/${id}`);
  }

  createPublication(publication: Noticia): Observable<Noticia> {
    return this.http.post<Noticia>(this.apiUrl, publication);
  }

  updatePublication(id: number, updateData: Partial<Noticia>): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.apiUrl}/${id}`, updateData);
  }
}

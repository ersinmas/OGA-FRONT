import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trailer } from '../../shared/models/trailer';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrailersService {
  private apiUrl = 'https://localhost:7297/api/Trailers'; 

  constructor(private http: HttpClient) {}

  getTrailers(): Observable<Trailer[]> {
    return this.http.get<Trailer[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un trailer por ID
  getTrailerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo trailer
  createTrailer(trailer: Trailer): Observable<Trailer> {
    return this.http.post<any>(this.apiUrl, trailer).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un trailer
  updateTrailer(id: number, trailer: Trailer): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, trailer).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un trailer
  deleteTrailer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio de vehículos:', error);
    throw error;
  }
}
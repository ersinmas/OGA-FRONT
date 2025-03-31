import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehicle } from '../../shared/models/vehicle';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private apiUrl = 'https://localhost:7297/api/Vehicles'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un vehículo por ID
  getVehicleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo vehículo
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<any>(this.apiUrl, vehicle).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un vehículo
  updateVehicle(id: number, vehicle: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, vehicle).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un vehículo
  deleteVehicle(id: number): Observable<any> {
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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleTrailer } from '../../shared/models/vehicleTrailer';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiclesTrailerService {
  private apiUrl = 'https://localhost:7297/api/VehiclesTrailer'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  getVehiclesTrailer(): Observable<VehicleTrailer[]> {
    return this.http.get<VehicleTrailer[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo vehículo
  createVehicleTrailer(vehicle: VehicleTrailer): Observable<VehicleTrailer> {
    return this.http.post<any>(this.apiUrl, vehicle).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un vehículo
  updateVehicle(vehicleTrailer: VehicleTrailer): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, vehicleTrailer).pipe(
      catchError(this.handleError)
    );
  }



  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio de vehículos:', error);
    throw error;
  }
}
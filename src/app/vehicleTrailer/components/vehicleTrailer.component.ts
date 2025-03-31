import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { VehiclesService } from '../../vehicles/services/vehicles.service'; 
import { TrailersService } from '../../trailers/services/trailers.service'; 
import { Trailer } from '../../shared/models/trailer'; 
import { VehicleTrailer } from '../../shared/models/vehicleTrailer';
import { VehiclesTrailerService } from '../services/vehicleTrailer.services';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule, UntypedFormArray } from '@angular/forms';

@Component({
  selector: 'app-vehicle-trailer',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, FormsModule], 
  templateUrl: './vehicleTrailer.component.html',
  styleUrls: ['./vehicleTrailer.component.css'],
  providers: [MessageService]
})
export class VehicleTrailerComponent implements OnChanges, OnInit{
  @Input() vehicleId!: number; 
  vehicleTrailer: VehicleTrailer | undefined; 
  asigvehicleTrailer:VehicleTrailer|undefined;
  allTrailers: Trailer[] = []; 
  selectedTrailerId: number | null = null; 
  selectedEndDate: string = '';  
  minEndDate: string = '';  

  showTrailers: boolean = false;

  private vehiclesService = inject(VehiclesService);
  private vehiclesTrailerService = inject(VehiclesTrailerService);
  private trailerService = inject(TrailersService);
  private messageService = inject(MessageService);

ngOnInit(){
    if (this.vehicleId) {
        this.loadVehicleTrailers(); 
        this.loadAllTrailers(); 
        console.error('vehicleId no está disponible');
      }
      const today = new Date();
      this.minEndDate = today.toISOString().split('T')[0];
}

ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicleId'] && this.vehicleId) {
      console.log('vehicleId actualizado:', this.vehicleId);
    
    }
  }
  // Cargar trailers asociados al vehículo
  loadVehicleTrailers() {
    this.vehiclesTrailerService.getVehiclesTrailer().subscribe({
      next: (data) => {
        this.vehicleTrailer = data.find(v => v.vehicleId === this.vehicleId);
    },
      error: (err) => {
        console.error('Error obteniendo trailers', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener los trailers asociados.'
        });
      }
    });
  }

  // Cargar todos los trailers disponibles
  loadAllTrailers() {
    this.trailerService.getTrailers().subscribe({
      next: (data) => {
        this.allTrailers = data; 
      },
      error: (err) => {
        console.error('Error obteniendo trailers disponibles', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener la lista de trailers disponibles.'
        });
      }
    });
  }

  // Añadir trailer al vehículo
  addTrailer() {
    if (this.selectedTrailerId) {
      this.vehiclesTrailerService.createVehicleTrailer(this.vehicleTrailer!).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Trailer agregado correctamente.'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo agregar el trailer.'+ err
          });
        }
      });
    }
  }

  // Eliminar trailer del vehículo
  removeTrailer() {
    this.vehiclesTrailerService.updateVehicle(this.vehicleTrailer!).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Trailer eliminado correctamente.'
        });
        this.vehicleTrailer = undefined;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el trailer.' + err
        });
      }
    });
  }
  assignTrailer(trailer: any): void {
    this.asigvehicleTrailer = {
      vehicleId: this.vehicleId,
      trailerId: trailer.trailerId,
      begDate: new Date(),
      endDate: new Date(this.selectedEndDate), 
    };
    this.vehiclesTrailerService.createVehicleTrailer(this.asigvehicleTrailer).subscribe({
        next: response=> {
            this.vehicleTrailer = response;
            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'El Trailer con id:' + response.trailerId + ' ha sido asignado correctamente al vehiculo:'+ response.vehicleId,
              });
              }
            ,
        error: err=> {            
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error: ' + err.error.error,
              });}
    })
    this.showTrailers = false;
  }}

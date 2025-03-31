import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { VehiclesService } from '../../vehicles/services/vehicles.service'; // Ajusta la ruta
import { TrailersService } from '../../trailers/services/trailers.service'; // Ajusta la ruta
import { Trailer } from '../../shared/models/trailer'; // Asegúrate de que Trailer esté bien definido
import { VehicleTrailer } from '../../shared/models/vehicleTrailer';
import { VehiclesTrailerService } from '../services/vehicleTrailer.services';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule, UntypedFormArray } from '@angular/forms';

@Component({
  selector: 'app-vehicle-trailer',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, FormsModule], // Asegúrate de incluir FormsModule aquí
  templateUrl: './vehicleTrailer.component.html',
  styleUrls: ['./vehicleTrailer.component.css'],
  providers: [MessageService]
})
export class VehicleTrailerComponent implements OnChanges, OnInit{
  @Input() vehicleId!: number; // Recibe el ID del vehículo
  vehicleTrailer: VehicleTrailer | undefined; // Lista de trailers asociados al vehículo
  asigvehicleTrailer:VehicleTrailer|undefined;
  allTrailers: Trailer[] = []; // Lista completa de trailers disponibles
  selectedTrailerId: number | null = null; // Trailer seleccionado para añadir
  selectedEndDate: string = '';  // Variable para almacenar la fecha seleccionada (fecha de fin)
  minEndDate: string = '';  // Esta es la propiedad que falta

    // Variable para manejar la visualización de la tabla de trailers disponibles
showTrailers: boolean = false;

  private vehiclesService = inject(VehiclesService);
  private vehiclesTrailerService = inject(VehiclesTrailerService);
  private trailerService = inject(TrailersService);
  private messageService = inject(MessageService);

ngOnInit(){
    if (this.vehicleId) {
        this.loadVehicleTrailers(); // Cargar trailers asociados al vehículo cuando el ID esté disponible
        this.loadAllTrailers(); // Cargar todos los trailers disponibles
      } else {
        console.error('vehicleId no está disponible');
      }
      const today = new Date();
      this.minEndDate = today.toISOString().split('T')[0]; // Formato ISO (YYYY-MM-DD)
}

ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicleId'] && this.vehicleId) {
      console.log('vehicleId actualizado:', this.vehicleId);
      // Aquí puedes hacer lo que necesites con el vehicleId.
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
        this.allTrailers = data; // Todos los trailers disponibles
        console.log(data)
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
      endDate: new Date(this.selectedEndDate), // Asignamos la fecha de fin seleccionada
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
    // Al asignar, ocultamos la lista de trailers disponibles
    this.showTrailers = false;
  }}

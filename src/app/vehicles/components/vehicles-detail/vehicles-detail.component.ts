import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../../../shared/models/vehicle';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../services/vehicles.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { VehicleTrailerComponent } from '../../../vehicleTrailer/components/vehicleTrailer.component';

@Component({
  selector: 'app-vehicles-detail',
  standalone: true,
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule, CommonModule, ToastModule, VehicleTrailerComponent],
  templateUrl: './vehicles-detail.component.html',
  styleUrls: ['./vehicles-detail.component.css'],
  providers: [MessageService] 
})
export class VehiclesDetailComponent {
  vehicleForm: FormGroup;
  vehicleId: number;
  vehicle: Vehicle | undefined;
  private vehiclesService = inject(VehiclesService);
  vehicles = signal<Vehicle | undefined>(undefined);
  isNew: boolean = false;
  vehicleTypes = [
    { value: 1, label: 'Moto' },
    { value: 2, label: 'Coche' },
    { value: 3, label: 'Trailer' }
  ];
  static VehiclesDetailComponent: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));

    this.vehicleForm = new FormGroup({
      vehicleId: new FormControl('', Validators.required),
      vehicleTypeId: new FormControl('', Validators.required),
      regNumber: new FormControl('', Validators.required),
      regDate: new FormControl('', Validators.required),
    });

    if (this.vehicleId !== 0) {
      this.vehiclesService.getVehicleById(this.vehicleId).subscribe({
        next: (data) => {
          this.vehicle = data;
          this.initializeForm(data);
        },
        error: (err) => console.error('Error obteniendo el vehículo', err),
      });
    } else {
      this.isNew = true;
      this.vehicleForm.setValue({
        vehicleId: 0,
        vehicleTypeId: null,
        regNumber: null,
        regDate: null,
      });
    }
  }

  initializeForm(vehicle: Vehicle) {
    const formattedDate = this.formatDate(vehicle.regDate);

    this.vehicleForm.setValue({
      vehicleId: vehicle.vehicleId,
      vehicleTypeId: vehicle.vehicleTypeId,
      regNumber: vehicle.regNumber,
      regDate: formattedDate,
    });
  }

  formatDate(date: any): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
    const day = ('0' + parsedDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  submit() {
    if (this.vehicleForm.valid) {
      const vehiculeForm: Vehicle = this.vehicleForm.value;
      if (this.isNew) {
        this.vehiclesService.createVehicle(vehiculeForm).subscribe({
          next: (ok) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'El vehículo ha sido guardado correctamente.',
            });
              setTimeout(() => {
              this.goBack();
            }, 2000);
          },
          error: (err) =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al añadir vehículo: ' + err,
            }),
        });
      } else {
        this.vehiclesService.updateVehicle(this.vehicleId, vehiculeForm).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'El vehículo ha sido actualizado correctamente.',
            });
              setTimeout(() => {
              this.goBack();
            }, 2000);
          },
          error: (err) =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar vehículo: ' + err,
            }),
        });
      }
    }
  }
  
  delete() {
    this.vehiclesService.deleteVehicle(this.vehicleId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'El vehiculo ha sido eliminado correctamente.',
        });
  
        setTimeout(() => {
          this.goBack();
        }, 2000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el vehiculo. Inténtelo nuevamente.',
        });
      },
    });
  }
  

  goBack() {
    this.router.navigate(['/vehicles']);
  }
}

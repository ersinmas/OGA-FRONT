import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../../../shared/models/vehicle';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicles-detail',
  standalone: true,
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './vehicles-detail.component.html',
  styleUrl: './vehicles-detail.component.css'
})
export class VehiclesDetailComponent {
  vehicleForm: FormGroup;
  vehicleId: number;
  vehicle: Vehicle;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id')); // Obtener el ID del vehículo de la URL

    // Simulamos obtener el vehículo desde algún servicio o una lista
    this.vehicle = {
      vehicleId: 1,
      vehicleTypeId: 101,
      regNumber: 1234,
      regDate: new Date(2022, 4, 10)  // Ejemplo de fecha
    };

    // Transformamos la fecha a string con formato adecuado para el campo input[type="date"]
    const formattedDate = this.formatDate(this.vehicle.regDate);

    // Inicializamos el formulario con los valores
    this.vehicleForm = new FormGroup({
      vehicleTypeId: new FormControl(this.vehicle.vehicleTypeId, Validators.required),
      regNumber: new FormControl(this.vehicle.regNumber, Validators.required),
      regDate: new FormControl(formattedDate, Validators.required)  // Aquí se pasa la fecha en formato string
    });
  }

  // Método para formatear la fecha en formato yyyy-MM-dd
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);  // +1 porque los meses empiezan en 0
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      console.log('Formulario enviado:', this.vehicleForm.value);
      // Aquí podrías enviar los datos al servidor o hacer algo con ellos
    }
  }

  goBack() {
    this.router.navigate(['/vehicles']);  // Volver al listado de vehículos
  }
}

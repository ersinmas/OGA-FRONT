import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Vehicle } from '../../../shared/models/vehicle';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [InputTextModule,PasswordModule,ButtonModule,MessagesModule,MessageModule,ReactiveFormsModule,CommonModule],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css'
})


export class VehiclesListComponent {
  searchControl = new FormControl('');
  
  vehiculos: Vehicle[] = [
    { vehicleId: 1, vehicleTypeId: 101, regNumber: 1234, regDate: new Date(2022, 4, 10) },
    { vehicleId: 2, vehicleTypeId: 102, regNumber: 5678, regDate: new Date(2021, 8, 15) },
    { vehicleId: 3, vehicleTypeId: 103, regNumber: 9012, regDate: new Date(2023, 0, 20) },
    { vehicleId: 4, vehicleTypeId: 104, regNumber: 3456, regDate: new Date(2020, 11, 5) }
  ];
  
  vehiculosFiltrados: Vehicle[] = this.vehiculos;

  constructor() {
    this.searchControl.valueChanges.subscribe(value => {
      if(value){
      this.filtrarVehiculos(value);
      }else{
      this.vehiculosFiltrados = this.vehiculos
      }
    });
  }

  filtrarVehiculos(value: string) {
    this.vehiculosFiltrados = this.vehiculos.filter(vehiculo =>
      vehiculo.regNumber.toString().includes(value)
    );
  }

  verDetalle(idVehicle:number){
    console.log(idVehicle)
  }
}
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Vehicle } from '../../../shared/models/vehicle';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../services/vehicles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [InputTextModule,PasswordModule,ButtonModule,MessagesModule,MessageModule,ReactiveFormsModule,CommonModule],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css'
})


export class VehiclesListComponent {
  private vehiclesService = inject(VehiclesService);
  vehicles = signal<Vehicle[]>([]);
  searchControl = new FormControl('');
  
  vehiculosFiltrados: Vehicle[] | undefined;
  static VehiclesListComponent: any;

  constructor(private router: Router) {
    this.vehiclesService.getVehicles().subscribe({
      next:(data)=>{
        this.vehicles.set(data)
        this.vehiculosFiltrados = [...this.vehicles()]
      },
      error:(err) => console.error('Error Obteniendo vehiculos', err)
    });

    this.searchControl.valueChanges.subscribe(value => {
      if(value){
      this.filtrarVehiculos(value);
      }else{
      this.vehiculosFiltrados = [...this.vehicles()]
      }
    });
  }


  filtrarVehiculos(value: string) {
    this.vehiculosFiltrados = this.vehiculosFiltrados?.filter(vehiculo =>
      vehiculo.regNumber.toString().includes(value)
    );
  }

  verDetalle(idVehicle:number){
    console.log(['vehicles', idVehicle])
    this.router.navigate(['vehicles/', idVehicle]); 
  }

  createNew(){
    this.router.navigate(['vehicles/', 0]); 

  }
}
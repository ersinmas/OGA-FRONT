import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Trailer } from '../../../shared/models/trailer';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { TrailersService } from '../../services/trailers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trailers-list',
  standalone: true,
  imports: [InputTextModule,PasswordModule,ButtonModule,MessagesModule,MessageModule,ReactiveFormsModule,CommonModule],
  templateUrl: './trailers-list.component.html',
  styleUrl: './trailers-list.component.css'
})


export class TrailersListComponent {
  private trailersService = inject(TrailersService);
  trailers = signal<Trailer[]>([]);
  searchControl = new FormControl('');
  
  trailersFiltrados: Trailer[] | undefined;
  static TrailersListComponent: any;

  constructor(private router: Router) {
    this.trailersService.getTrailers().subscribe({
      next:(data)=>{
        this.trailers.set(data)
        this.trailersFiltrados = [...this.trailers()]
      },
      error:(err) => console.error('Error Obteniendo trailers', err)
    });

    this.searchControl.valueChanges.subscribe(value => {
      if(value){
      this.filtrarVehiculos(value);
      }else{
      this.trailersFiltrados = [...this.trailers()]
      }
    });
  }


  filtrarVehiculos(value: string) {
    this.trailersFiltrados = this.trailersFiltrados?.filter(trailer =>
      trailer.regNumber.toString().includes(value)
    );
  }

  verDetalle(idTrailer:number){
    console.log(['trailers', idTrailer])
    this.router.navigate(['trailers/', idTrailer]); 
  }

  createNew(){
    this.router.navigate(['trailers/', 0]); 

  }
}
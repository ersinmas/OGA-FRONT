import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Trailer } from '../../../shared/models/trailer';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrailersService } from '../../services/trailers.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-trailers-detail',
  standalone: true,
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './trailers-detail.component.html',
  styleUrls: ['./trailers-detail.component.css'],
  providers: [MessageService] 
})
export class TrailersDetailComponent {
  trailerForm: FormGroup;
  trailerId: number;
  trailer: Trailer | undefined;
  private trailersService = inject(TrailersService);
  trailers = signal<Trailer | undefined>(undefined);
  isNew: boolean = false;
  static TrailersDetailComponent: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.trailerId = Number(this.route.snapshot.paramMap.get('id'));

    this.trailerForm = new FormGroup({
      trailerId: new FormControl('', Validators.required),
      maxWeight: new FormControl('', Validators.required),
      regNumber: new FormControl('', Validators.required),
      regDate: new FormControl('', Validators.required),
    });

    if (this.trailerId !== 0) {
      this.trailersService.getTrailerById(this.trailerId).subscribe({
        next: (data) => {
          this.trailer = data;
          this.initializeForm(data);
        },
        error: (err) => console.error('Error obteniendo el vehículo', err),
      });
    } else {
      this.isNew = true;
      this.trailerForm.setValue({
        trailerId: 0,
        maxWeight: null,
        regNumber: null,
        regDate: null,
      });
    }
  }

  initializeForm(trailer: Trailer) {
    const formattedDate = this.formatDate(trailer.regDate);

    this.trailerForm.setValue({
      trailerId: trailer.trailerId,
      maxWeight: trailer.maxWeight,
      regNumber: trailer.regNumber,
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
    if (this.trailerForm.valid) {
      const trailerForm: Trailer = this.trailerForm.value;
      if (this.isNew) {
        this.trailersService.createTrailer(trailerForm).subscribe({
          next: (ok) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'El Trailer ha sido guardado correctamente.',
            });
              setTimeout(() => {
              this.goBack();
            }, 2000);
          },
          error: (err) =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al añadir Trailer: ' + err,
            }),
        });
      } else {
        this.trailersService.updateTrailer(this.trailerId, trailerForm).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'El Trailer ha sido actualizado correctamente.',
            });
              setTimeout(() => {
              this.goBack();
            }, 2000);
          },
          error: (err) =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar Trailer: ' + err,
            }),
        });
      }
    }
  }
  
  
delete() {
  this.trailersService.deleteTrailer(this.trailerId).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'El Trailer ha sido eliminado correctamente.',
      });

      this.trailerForm.reset();  
      this.trailerId = 0;        
      this.trailer = undefined;  

      setTimeout(() => {
        this.goBack();
      }, 2000);
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el Trailer. Inténtelo nuevamente.',
      });
    },
  });
}

  
  
  goBack() {
    this.router.navigate(['/trailers']);
  }
}

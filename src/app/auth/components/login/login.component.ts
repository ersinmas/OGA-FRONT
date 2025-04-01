import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/User';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
    imports: [InputTextModule,PasswordModule,ButtonModule,MessagesModule,MessageModule,ReactiveFormsModule,CommonModule, ToastModule],
    providers: [MessageService]

})

export class LoginComponent {
  loginForm: FormGroup;
  private messageService = inject(MessageService);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]  
    });
  }

  async login(): Promise<void> {
    if (this.loginForm.valid) {
      
      const user:User = {
      email : this.loginForm.value.email,
      passwordHash : this.loginForm.value.password
      }

      try {
        const token = await firstValueFrom(this.authService.login(user)); 
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario Autenticado con exito.'
        });
        this.router.navigate(['/vehicles']);
      } catch (err) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error en el inicio de sessiòn:'+ err
        });      }
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
}

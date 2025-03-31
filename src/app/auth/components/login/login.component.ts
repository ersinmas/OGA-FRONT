import { Component } from '@angular/core';
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


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
    imports: [InputTextModule,PasswordModule,ButtonModule,MessagesModule,MessageModule,ReactiveFormsModule,CommonModule]
})

export class LoginComponent {
  loginForm: FormGroup;

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
        console.log('Login exitoso, token recibido:', token);
        this.router.navigate(['/vehicles']);
      } catch (err) {
        console.error('Error en login:', err);
      }
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
}

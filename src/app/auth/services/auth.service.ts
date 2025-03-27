import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { User } from '../../shared/models/User';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7297/api/Users/login'; 
  private user = signal<User | null>(null);


  constructor(private http: HttpClient, private router: Router) {}

  login(user: User) {
    console.log('el user recibido en el servicio' + user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    })
    return this.http.post<any>(`${this.apiUrl}`, user).pipe(
      tap(token => {
        console.log(token);
        localStorage.setItem('token', token.token);
      }),
      catchError(err => {
        console.error('Error en login:', err);
        return throwError(() => new Error('Credenciales incorrectas.'));
      })
    );
  }


  logout(): void {
    this.user.set(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.user();
  }

  getUser(): User | null {
    return this.user();
  }

  setUser(user: User): void {
    this.user.set(user);
   }
}

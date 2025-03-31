import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const guardAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  
  const router = inject(Router); 
  

  const isAuthenticated = authService.isLoggedIn(); 

  if (!isAuthenticated) {

    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; 
  }

  return true; 
};

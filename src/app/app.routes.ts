import { Routes } from '@angular/router';
import { guardAuthGuard } from './auth/guards/guard-auth.guard';
import { NotFoundComponent } from './shared/components/404/NotFoundComponent';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'vehicles', 
    loadComponent: () => import('./vehicles/components/vehicles-list/vehicles-list.component').then(m => m.VehiclesListComponent),
    //canActivate: [guardAuthGuard] // Descomentar para proteger esta ruta con autenticación
  },
  { 
    path: 'vehicles/:id', 
    loadComponent: () => import('./vehicles/components/vehicles-detail/vehicles-detail.component').then(m => m.VehiclesDetailComponent),
    //canActivate: [guardAuthGuard]
  },
  { 
    path: 'trailers', 
    loadComponent: () => import('./trailers/components/trailers-list/trailers-list.component').then(m => m.TrailersListComponent),
    canActivate: [guardAuthGuard]
  },
  { 
    path: 'trailers/:id', 
    loadComponent: () => import('./trailers/components/trailers-detail/trailers-detail.component').then(m => m.TrailersDetailComponent),
    canActivate: [guardAuthGuard]
  },
  { path: '**', component: NotFoundComponent }

];

import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'vehicles', 
    loadComponent: () => import('./vehicles/components/vehicles-list/vehicles-list.component').then(m => m.VehiclesListComponent) 
  },
  { 
    path: 'vehicles/:id', 
    loadComponent: () => import('./vehicles/components/vehicles-detail/vehicles-detail.component').then(m => m.VehiclesDetailComponent) 
  },
  { 
    path: 'trailers', 
    loadComponent: () => import('./trailers/components/trailers-list/trailers-list.component').then(m => m.TrailersListComponent) 
  },
  { 
    path: 'trailers/:id', 
    loadComponent: () => import('./trailers/components/trailers-detail/trailers-detail.component').then(m => m.TrailersDetailComponent) 
  }
];

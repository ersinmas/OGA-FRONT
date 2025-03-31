import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { ButtonModule } from 'primeng/button'; 
import { MenuModule } from 'primeng/menu'; 
import { PanelMenuModule } from 'primeng/panelmenu';
import { AuthService } from '../../../auth/services/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, PanelMenuModule], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isAuthenticated: boolean = false;
  displaySidebar: boolean = false;  // Controlar el estado de visibilidad del sidebar

  // Aquí, definimos los elementos del menú con propiedades 'route' y 'url'
  items: MenuItem[] = [
    { label: 'Vehicles', icon: 'pi pi-car', route: '/vehicles' },
    { label: 'Trailers', icon: 'pi pi-truck', route: '/trailers' },
    { label: 'External Link', icon: 'pi pi-link', url: 'https://external-link.com' }
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
  }
  
  toggleSidebar() {
    this.displaySidebar = !this.displaySidebar;
  }
}
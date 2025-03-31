import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'NotFoundComponent',
  templateUrl: './NotFoundComponent.html',
  styleUrls: ['./NotFoundComponent.css']
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/vehicles']);
  }
}

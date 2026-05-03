import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  /** Total unanswered questions across all owner vehicles */
  unansweredCount = 0;

  ngOnInit(): void {
    this.loadUnansweredCount();
  }

  /** Loads unanswered questions count if user is logged in. */
  loadUnansweredCount(): void {
    if (!this.authService.isLoggedIn()) return;
    this.vehicleService.getUnansweredCount().subscribe({
      next: (count) => this.unansweredCount = count,
      error: () => this.unansweredCount = 0
    });
  }

  logout() {
    this.authService.logout();
    this.unansweredCount = 0;
    this.router.navigate(['/login']);
  }
}
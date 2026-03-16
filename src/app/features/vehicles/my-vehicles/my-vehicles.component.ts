import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.models';

/**
 * Component for displaying the authenticated user's vehicle listings.
 * Accessible only to logged-in users via AuthGuard.
 */
@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-vehicles.component.html'
})
export class MyVehiclesComponent implements OnInit {
  private vehicleService = inject(VehicleService);

  /** List of vehicles owned by the current user */
  vehicles: Vehicle[] = [];

  /** Loading state flag */
  loading = true;

  /**
   * Loads the current user's vehicles on component initialization.
   */
  ngOnInit(): void {
    this.vehicleService.getMyVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';

/**
 * Component for publishing a new vehicle listing.
 * Accessible only to authenticated users.
 */
@Component({
  selector: 'app-publish-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './publish-vehicle.component.html'
})
export class PublishVehicleComponent {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  vehicleForm = this.fb.group({
    brand: ['', [Validators.required, Validators.maxLength(50)]],
    model: ['', [Validators.required, Validators.maxLength(50)]],
    year: [null, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
    price: [null, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.maxLength(500)]],
    imageUrl: ['']
  });

  /**
   * Submits the form to create a new vehicle listing.
   */
  onSubmit(): void {
    if (this.vehicleForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.vehicleService.create(this.vehicleForm.value as any).subscribe({
      next: () => {
        this.router.navigate(['/my-vehicles']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al publicar el vehículo.';
        this.loading = false;
      }
    });
  }
}
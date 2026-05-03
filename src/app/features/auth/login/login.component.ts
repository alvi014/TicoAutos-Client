import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

/**
 * Component for user authentication with specific error handling
 * and password visibility toggle.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  loading = false;
  showPassword = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  /** Toggles password field visibility. */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => this.router.navigate(['/vehicles']),
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se puede conectar con el servidor.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intentá de nuevo.';
        }
        this.loading = false;
      }
    });
  }
}
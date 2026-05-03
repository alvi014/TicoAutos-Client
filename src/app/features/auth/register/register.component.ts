import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Validator that checks if password and confirmPassword fields match.
 */
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

/**
 * Component for new user registration with password confirmation
 * and visibility toggle.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  loading = false;
  showPassword = false;
  showConfirm = false;

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  /** Toggles main password field visibility. */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /** Toggles confirm password field visibility. */
  toggleConfirm(): void {
    this.showConfirm = !this.showConfirm;
  }

  /** Returns true if passwords don't match and confirm field is touched. */
  get passwordMismatch(): boolean {
    return !!(this.registerForm.errors?.['passwordMismatch'] &&
      this.registerForm.get('confirmPassword')?.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register({ fullName: fullName!, email: email!, password: password! })
      .subscribe({
        next: () => this.router.navigate(['/vehicles']),
        error: (err) => {
          if (err.status === 409) {
            this.errorMessage = 'Este correo ya está registrado.';
          } else if (err.status === 0) {
            this.errorMessage = 'No se puede conectar con el servidor.';
          } else {
            this.errorMessage = err.error?.message || 'Error al registrarse.';
          }
          this.loading = false;
        }
      });
  }
}
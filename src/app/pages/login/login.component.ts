import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMensaje = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (respuesta) => {
        if (respuesta.rol === 'entrenador') {
          this.router.navigate(['/entrenador']);
        } else {
          this.router.navigate(['/alumno']);
        }
      },
      error: (err) => {
        this.errorMensaje = err.error?.detail || 'Credenciales incorrectas';
      },
    });
  }
}
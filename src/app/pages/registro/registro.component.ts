import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { extraerMensajeError } from '../../utils/error-utils';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  rol: 'entrenador' | 'alumno' = 'alumno';
  errorMensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMensaje = '';

    this.authService
      .registrar({ nombre: this.nombre, email: this.email, password: this.password, rol: this.rol })
      .subscribe({
        next: () => {
          alert('Registro exitoso. Ahora inicia sesión.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMensaje = extraerMensajeError(err);
        },
      });
  }
}
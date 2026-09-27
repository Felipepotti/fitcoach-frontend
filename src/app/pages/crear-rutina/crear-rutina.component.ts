import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RutinasService, Ejercicio } from '../../services/rutinas.service';
import { extraerMensajeError } from '../../utils/error-utils';

interface Alumno {
  id: string;
  nombre: string;
  email: string;
  activo?: boolean;
}

@Component({
  selector: 'app-crear-rutina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-rutina.component.html',
  styleUrl: './crear-rutina.component.css',
})
export class CrearRutinaComponent implements OnInit {
  alumnos: Alumno[] = [];
  alumnoSeleccionado = '';
  nombreRutina = '';
  ejercicios: Ejercicio[] = [];
  errorMensaje = '';
  exitoMensaje = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private rutinasService: RutinasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
    this.agregarEjercicio();
  }

  cargarAlumnos(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.obtenerToken()}`,
    });
    this.http
      .get<{ alumnos: Alumno[] }>('http://127.0.0.1:8000/entrenador/mis-alumnos', { headers })
      .subscribe({
        next: (respuesta) => {
          this.alumnos = respuesta.alumnos.filter((a) => a.activo !== false);
        },
        error: () => (this.errorMensaje = 'No se pudieron cargar los alumnos'),
      });
  }

  agregarEjercicio(): void {
    this.ejercicios.push({
      nombre_ejercicio: '',
      grupo_muscular: '',
      series: 3,
      repeticiones: 10,
      descanso_segundos: 60,
      notas: '',
    });
  }

  eliminarEjercicio(index: number): void {
    this.ejercicios.splice(index, 1);
  }

  onSubmit(): void {
    this.errorMensaje = '';
    this.exitoMensaje = '';

    if (!this.alumnoSeleccionado) {
      this.errorMensaje = 'Debes seleccionar un alumno';
      return;
    }

    this.rutinasService
      .crearRutina({
        alumno_id: this.alumnoSeleccionado,
        nombre_rutina: this.nombreRutina,
        ejercicios: this.ejercicios,
      })
      .subscribe({
        next: () => {
          this.exitoMensaje = 'Rutina creada correctamente';
          setTimeout(() => this.router.navigate(['/entrenador']), 1200);
        },
        error: (err) => {
          this.errorMensaje = extraerMensajeError(err);
        },
      });
  }
}
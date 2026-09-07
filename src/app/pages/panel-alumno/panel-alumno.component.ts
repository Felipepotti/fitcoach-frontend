import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ProgresoService, Progreso } from '../../services/progreso.service';
import { Router } from '@angular/router';

interface Rutina {
  id: string;
  nombre_rutina: string;
  ejercicios: any[];
}

@Component({
  selector: 'app-panel-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-alumno.component.html',
  styleUrl: './panel-alumno.component.css',
})
export class PanelAlumnoComponent implements OnInit {
  rutinas: Rutina[] = [];
  historial: Progreso[] = [];
  nombreUsuario = '';
  cargando = true;

  comentarios: { [rutinaId: string]: string } = {};
  mensajeExito: { [rutinaId: string]: string } = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private progresoService: ProgresoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('nombre') || '';
    this.cargarRutinas();
    this.cargarHistorial();
  }

  cargarRutinas(): void {
    const headers = { Authorization: `Bearer ${this.authService.obtenerToken()}` };
    this.http
      .get<Rutina[]>('http://127.0.0.1:8000/rutinas/mis-rutinas', { headers })
      .subscribe({
        next: (respuesta) => {
          this.rutinas = respuesta;
          this.cargando = false;
        },
        error: () => (this.cargando = false),
      });
  }

  cargarHistorial(): void {
    this.progresoService.obtenerMiHistorial().subscribe({
      next: (respuesta) => (this.historial = respuesta),
      error: () => {},
    });
  }

  marcarCompletada(rutinaId: string): void {
    const comentario = this.comentarios[rutinaId] || '';

    this.progresoService
      .registrarProgreso({ rutina_id: rutinaId, comentario })
      .subscribe({
        next: () => {
          this.mensajeExito[rutinaId] = '¡Registrado!';
          this.comentarios[rutinaId] = '';
          this.cargarHistorial(); // refresca el historial automáticamente
          setTimeout(() => (this.mensajeExito[rutinaId] = ''), 2000);
        },
        error: () => {
          this.mensajeExito[rutinaId] = 'Error al registrar';
        },
      });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
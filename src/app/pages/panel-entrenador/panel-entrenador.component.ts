import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

interface Alumno {
  id: string;
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-panel-entrenador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panel-entrenador.component.html',
  styleUrl: './panel-entrenador.component.css',
})
export class PanelEntrenadorComponent implements OnInit {
  alumnos: Alumno[] = [];
  nombreUsuario = '';
  cargando = true;
  errorMensaje = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('nombre') || '';
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    const headers = { Authorization: `Bearer ${this.authService.obtenerToken()}` };

    this.http.get<{ alumnos: Alumno[] }>('http://127.0.0.1:8000/entrenador/mis-alumnos', { headers })
      .subscribe({
        next: (respuesta) => {
          this.alumnos = respuesta.alumnos;
          this.cargando = false;
        },
        error: (err) => {
          this.errorMensaje = 'No se pudieron cargar los alumnos';
          this.cargando = false;
        },
      });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
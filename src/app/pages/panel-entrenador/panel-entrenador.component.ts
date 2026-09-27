import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { EntrenadorService, Alumno } from '../../services/entrenador.service';
import { ProgresoService, ProgresoEntrenador } from '../../services/progreso.service';
import { RutinasService, Rutina } from '../../services/rutinas.service';
import { extraerMensajeError } from '../../utils/error-utils';

@Component({
  selector: 'app-panel-entrenador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './panel-entrenador.component.html',
  styleUrl: './panel-entrenador.component.css',
})
export class PanelEntrenadorComponent implements OnInit, OnDestroy {
  alumnos: Alumno[] = [];
  rutinas: Rutina[] = [];
  nombreUsuario = '';
  cargando = true;
  errorMensaje = '';

  emailAVincular = '';
  vinculando = false;
  mensajeVinculacion = '';
  errorVinculacion = '';

  feedback: ProgresoEntrenador[] = [];
  idsVistos = new Set<string>();
  nuevosCount = 0;
  private primeraCarga = true;
  private pollingSub?: Subscription;

  constructor(
    private authService: AuthService,
    private entrenadorService: EntrenadorService,
    private progresoService: ProgresoService,
    private rutinasService: RutinasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('nombre') || '';
    this.cargarAlumnos();
    this.cargarRutinas();
    this.iniciarPolling();
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  cargarAlumnos(): void {
    this.cargando = true;
    this.entrenadorService.obtenerMisAlumnos().subscribe({
      next: (respuesta) => {
        this.alumnos = respuesta.alumnos;
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = 'No se pudieron cargar los alumnos';
        this.cargando = false;
      },
    });
  }

  cargarRutinas(): void {
    this.rutinasService.obtenerRutinasDeMisAlumnos().subscribe({
      next: (respuesta) => (this.rutinas = respuesta),
      error: () => {},
    });
  }

  toggleEstadoRutina(rutinaId: string): void {
    this.rutinasService.cambiarEstado(rutinaId).subscribe({
      next: () => this.cargarRutinas(),
      error: () => {},
    });
  }

  toggleEstadoAlumno(alumnoId: string): void {
    this.entrenadorService.cambiarEstadoAlumno(alumnoId).subscribe({
      next: () => this.cargarAlumnos(),
      error: () => {},
    });
  }

  iniciarPolling(): void {
    this.pollingSub = timer(0, 8000)
      .pipe(switchMap(() => this.progresoService.obtenerFeedbackAlumnos()))
      .subscribe({
        next: (respuesta) => this.actualizarFeedback(respuesta),
        error: () => {},
      });
  }

  actualizarFeedback(respuesta: ProgresoEntrenador[]): void {
    if (this.primeraCarga) {
      respuesta.forEach((r) => this.idsVistos.add(r.id));
      this.primeraCarga = false;
    } else {
      const nuevos = respuesta.filter((r) => !this.idsVistos.has(r.id));
      if (nuevos.length > 0) {
        this.nuevosCount += nuevos.length;
      }
    }
    this.feedback = respuesta;
  }

  marcarTodoLeido(): void {
    this.feedback.forEach((r) => this.idsVistos.add(r.id));
    this.nuevosCount = 0;
  }

  esNuevo(id: string): boolean {
    return !this.idsVistos.has(id);
  }

  vincularAlumno(): void {
    this.mensajeVinculacion = '';
    this.errorVinculacion = '';
    this.vinculando = true;

    this.entrenadorService.vincularAlumno(this.emailAVincular).subscribe({
      next: () => {
        this.mensajeVinculacion = 'Alumno vinculado correctamente';
        this.emailAVincular = '';
        this.vinculando = false;
        this.cargarAlumnos();
      },
      error: (err) => {
        this.errorVinculacion = extraerMensajeError(err);
        this.vinculando = false;
      },
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
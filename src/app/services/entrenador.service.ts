import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = 'http://127.0.0.1:8000';

export interface Alumno {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EntrenadorService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private obtenerHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.obtenerToken()}`,
    });
  }

  obtenerMisAlumnos(): Observable<{ alumnos: Alumno[] }> {
    return this.http.get<{ alumnos: Alumno[] }>(`${API_URL}/entrenador/mis-alumnos`, {
      headers: this.obtenerHeaders(),
    });
  }

  vincularAlumno(email: string): Observable<any> {
    return this.http.post(
      `${API_URL}/entrenador/vincular-alumno`,
      { email },
      { headers: this.obtenerHeaders() }
    );
  }

  cambiarEstadoAlumno(alumnoId: string): Observable<{ id: string; nombre: string; activo: boolean }> {
    return this.http.patch<{ id: string; nombre: string; activo: boolean }>(
      `${API_URL}/entrenador/alumnos/${alumnoId}/estado`,
      {},
      { headers: this.obtenerHeaders() }
    );
  }
}
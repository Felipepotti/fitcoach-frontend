import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = 'http://127.0.0.1:8000';

export interface Ejercicio {
  nombre_ejercicio: string;
  grupo_muscular: string;
  series: number;
  repeticiones: number;
  descanso_segundos: number;
  notas?: string;
}

export interface RutinaCrear {
  alumno_id: string;
  nombre_rutina: string;
  ejercicios: Ejercicio[];
}

export interface Rutina extends RutinaCrear {
  id: string;
  entrenador_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class RutinasService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private obtenerHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.obtenerToken()}`,
    });
  }

  crearRutina(rutina: RutinaCrear): Observable<Rutina> {
    return this.http.post<Rutina>(`${API_URL}/rutinas/`, rutina, {
      headers: this.obtenerHeaders(),
    });
  }

  obtenerMisRutinas(): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(`${API_URL}/rutinas/mis-rutinas`, {
      headers: this.obtenerHeaders(),
    });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = 'http://127.0.0.1:8000';

export interface ProgresoRegistrar {
  rutina_id: string;
  comentario?: string;
}

export interface Progreso extends ProgresoRegistrar {
  id: string;
  alumno_id: string;
  nombre_rutina: string;
  fecha_completado: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProgresoService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private obtenerHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.obtenerToken()}`,
    });
  }

  registrarProgreso(datos: ProgresoRegistrar): Observable<Progreso> {
    return this.http.post<Progreso>(`${API_URL}/progreso/`, datos, {
      headers: this.obtenerHeaders(),
    });
  }

  obtenerMiHistorial(): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${API_URL}/progreso/mi-historial`, {
      headers: this.obtenerHeaders(),
    });
  }
}
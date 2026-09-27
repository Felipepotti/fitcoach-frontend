import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = 'http://127.0.0.1:8000';

export interface DatosFisicos {
  peso_kg: number;
  altura_cm: number;
  edad: number;
  sexo: 'masculino' | 'femenino' | 'otro';
  objetivo: 'bajar_peso' | 'subir_masa' | 'mantener';
}

export interface PerfilFisico {
  peso_kg?: number;
  altura_cm?: number;
  edad?: number;
  sexo?: string;
  objetivo?: string;
}

export interface RegistroPeso {
  id: string;
  peso_kg: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private obtenerHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.obtenerToken()}`,
    });
  }

  obtenerMiPerfil(): Observable<PerfilFisico> {
    return this.http.get<PerfilFisico>(`${API_URL}/perfil/`, {
      headers: this.obtenerHeaders(),
    });
  }

  actualizarPerfil(datos: DatosFisicos): Observable<PerfilFisico> {
    return this.http.put<PerfilFisico>(`${API_URL}/perfil/`, datos, {
      headers: this.obtenerHeaders(),
    });
  }

  obtenerHistorialPeso(): Observable<RegistroPeso[]> {
    return this.http.get<RegistroPeso[]>(`${API_URL}/perfil/historial-peso`, {
      headers: this.obtenerHeaders(),
    });
  }

  obtenerPerfilDeAlumno(alumnoId: string): Observable<PerfilFisico> {
    return this.http.get<PerfilFisico>(`${API_URL}/perfil/alumno/${alumnoId}`, {
      headers: this.obtenerHeaders(),
    });
  }
}
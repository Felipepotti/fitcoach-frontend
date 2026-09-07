import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API_URL = 'http://127.0.0.1:8000';

interface RegistroPayload {
  nombre: string;
  email: string;
  password: string;
  rol: 'entrenador' | 'alumno';
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginRespuesta {
  access_token: string;
  token_type: string;
  rol: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registrar(datos: RegistroPayload): Observable<any> {
    return this.http.post(`${API_URL}/auth/registro`, datos);
  }

  login(datos: LoginPayload): Observable<LoginRespuesta> {
    return this.http.post<LoginRespuesta>(`${API_URL}/auth/login`, datos).pipe(
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.access_token);
        localStorage.setItem('rol', respuesta.rol);
        localStorage.setItem('nombre', respuesta.nombre);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }
}
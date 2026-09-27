import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PerfilService, DatosFisicos } from '../../services/perfil.service';
import { extraerMensajeError } from '../../utils/error-utils';

@Component({
  selector: 'app-datos-fisicos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './datos-fisicos.component.html',
  styleUrl: './datos-fisicos.component.css',
})
export class DatosFisicosComponent implements OnInit {
  datos: DatosFisicos = {
    peso_kg: 70,
    altura_cm: 170,
    edad: 25,
    sexo: 'masculino',
    objetivo: 'mantener',
  };

  cargando = true;
  guardando = false;
  errorMensaje = '';
  exitoMensaje = '';

  constructor(private perfilService: PerfilService, private router: Router) {}

  ngOnInit(): void {
    this.perfilService.obtenerMiPerfil().subscribe({
      next: (perfil) => {
        if (perfil.peso_kg) this.datos.peso_kg = perfil.peso_kg;
        if (perfil.altura_cm) this.datos.altura_cm = perfil.altura_cm;
        if (perfil.edad) this.datos.edad = perfil.edad;
        if (perfil.sexo) this.datos.sexo = perfil.sexo as any;
        if (perfil.objetivo) this.datos.objetivo = perfil.objetivo as any;
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  onSubmit(): void {
    this.errorMensaje = '';
    this.exitoMensaje = '';
    this.guardando = true;

    this.perfilService.actualizarPerfil(this.datos).subscribe({
      next: () => {
        this.exitoMensaje = 'Datos guardados correctamente';
        this.guardando = false;
      },
      error: (err) => {
        this.errorMensaje = extraerMensajeError(err);
        this.guardando = false;
      },
    });
  }
}
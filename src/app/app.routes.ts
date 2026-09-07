import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PanelEntrenadorComponent } from './pages/panel-entrenador/panel-entrenador.component';
import { PanelAlumnoComponent } from './pages/panel-alumno/panel-alumno.component';
import { authGuard } from './guards/auth.guard';
import { CrearRutinaComponent } from './pages/crear-rutina/crear-rutina.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'entrenador',
    component: PanelEntrenadorComponent,
    canActivate: [authGuard],
    data: { rol: 'entrenador' },
  },
  {
    path: 'alumno',
    component: PanelAlumnoComponent,
    canActivate: [authGuard],
    data: { rol: 'alumno' },
  },
  {
  path: 'entrenador/crear-rutina',
  component: CrearRutinaComponent,
  canActivate: [authGuard],
  data: { rol: 'entrenador' },
},
];
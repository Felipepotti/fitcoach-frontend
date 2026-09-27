export function extraerMensajeError(err: any): string {
  const detail = err?.error?.detail;

  // Caso 1: el backend mandó un mensaje simple de texto (HTTPException normal)
  if (typeof detail === 'string') {
    return detail;
  }

  // Caso 2: error de validación de Pydantic (422) — detail es un array de objetos
  if (Array.isArray(detail) && detail.length > 0) {
    const primero = detail[0];
    const campo = primero.loc?.[primero.loc.length - 1] ?? 'campo';
    return `Revisa el campo "${campo}": ${traducirMensaje(primero.msg)}`;
  }

  // Caso 3: no hay respuesta del servidor (backend caído, sin conexión, CORS, etc.)
  if (err?.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  }

  // Caso 4: cualquier otro caso no anticipado
  return 'Ocurrió un error inesperado. Intenta nuevamente.';
}

function traducirMensaje(msg: string): string {
  if (msg?.includes('at least')) return 'es muy corto';
  if (msg?.includes('at most')) return 'es muy largo';
  if (msg?.includes('valid email')) return 'no es un email válido';
  return 'tiene un formato inválido';
}
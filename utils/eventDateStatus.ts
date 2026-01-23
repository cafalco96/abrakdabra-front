export type EventDateStatus = 'scheduled' | 'cancelled' | 'finished'

export const EVENT_DATE_STATUS_META: Record<
  EventDateStatus,
  { label: string; color: string }
> = {
  scheduled: { label: 'Programado', color: 'info' },
  cancelled: { label: 'Cancelado', color: 'error' },
  finished: { label: 'Finalizado', color: 'secondary' },
}

/**
 * Obtiene los metadatos (label y color) de un estado de fecha de evento
 * @param status - Estado de la fecha del evento
 * @returns Objeto con label y color, o valores por defecto si el estado no existe
 */
export function getEventDateStatusMeta(status: string | undefined) {
  if (!status) {
    return { label: 'Desconocido', color: 'grey' }
  }

  return EVENT_DATE_STATUS_META[status as EventDateStatus] || { label: status, color: 'grey' }
}

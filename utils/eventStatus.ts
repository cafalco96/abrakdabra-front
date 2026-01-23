export type EventStatus = 'upcoming' | 'on_sale' | 'sold_out' | 'cancelled' | 'finished'

export const EVENT_STATUS_META: Record<
  EventStatus,
  { label: string; color: string }
> = {
  upcoming:  { label: 'Próximamente', color: 'grey' },
  on_sale:   { label: 'En venta',     color: 'success' },
  sold_out:  { label: 'Agotado',      color: 'error' },
  cancelled: { label: 'Cancelado',    color: 'error' },
  finished:  { label: 'Finalizado',   color: 'secondary' },
}

/**
 * Obtiene los metadatos (label y color) de un estado de evento
 * @param status - Estado del evento
 * @returns Objeto con label y color, o valores por defecto si el estado no existe
 */
export function getEventStatusMeta(status: string | undefined) {
  if (!status) {
    return { label: 'Desconocido', color: 'grey' }
  }
  
  return EVENT_STATUS_META[status as EventStatus] || { label: status, color: 'grey' }
}

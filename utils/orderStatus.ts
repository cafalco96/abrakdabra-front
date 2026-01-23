export type OrderStatus = 'draft' | 'pending_payment' | 'paid' | 'cancelled'

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  draft: { label: 'Borrador', color: 'grey' },
  pending_payment: { label: 'Pendiente de pago', color: 'warning' },
  paid: { label: 'Pagado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'error' },
}

/**
 * Obtiene metadatos (label y color) para un estado de orden.
 */
export function getOrderStatusMeta(status: string | undefined) {
  if (!status) {
    return { label: 'Desconocido', color: 'grey' }
  }

  return ORDER_STATUS_META[status as OrderStatus] || { label: status, color: 'grey' }
}

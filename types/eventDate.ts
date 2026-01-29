export type EventDateStatus = 'scheduled' | 'finished' | 'cancelled'

export type TicketCategory = {
  id: number
  event_date_id: number
  name: string
  price: string
  stock_total: number
  stock_sold: number
  status: string
}

export type EventDate = {
  id: number
  event_id: number
  starts_at: string
  ends_at?: string
  status: string
  ticket_categories: TicketCategory[]
}

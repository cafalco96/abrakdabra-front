export type TicketStatus = 'available' | 'unavailable' | string

export type Ticket = {
  id: number
  order_item_id: number
  ticket_code: string
  status: string
  event_title?: string
  event_date?: string
  category_name?: string
  created_at?: string
}
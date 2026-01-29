export type EventFormModel = {
  title: string;
  description: string | null
  location: string
  status: 'upcoming' | 'on_sale' | 'sold_out' | 'cancelled' | 'finished' | null
  image_path?: string | null
}

export type EventDateFormModel = {
  starts_at: string
  ends_at: string | null
  status: 'scheduled' | 'finished' | 'cancelled' | null
}

export type UserFormModel = {
  name: string
  email: string
  password: string | null
  password_confirmation: string | null
  role: 'admin' | 'gestor' | 'buyer'
  is_active: boolean
}

export type TicketCategoryFormModel = {
  name: string
  price: number | null
  stock_total: number | null
  status: 'available' | 'unavailable' | string | null
}

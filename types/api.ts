// Complex API response types with nested structures
// These types are specific to API responses and used across multiple pages

// ============================================================================
// PUBLIC EVENT PAGES (pages/events/[id].vue)
// ============================================================================

export type PublicEventTicketCategory = {
  id: number
  event_date_id: number
  name: string
  price: string
  stock_total: number
  stock_sold: number
  status: string
}

export type PublicEventDate = {
  id: number
  event_id: number
  starts_at: string
  ends_at: string | null
  status: string
  ticket_categories: PublicEventTicketCategory[]
}

export type PublicEventDetail = {
  id: number
  title: string
  description: string | null
  image_path: string | null
  location: string | null
  status: 'upcoming' | 'on_sale' | 'sold_out' | 'cancelled' | 'finished'
  created_at: string
  updated_at: string
  dates: PublicEventDate[]
}

// ============================================================================
// CHECKOUT PAGES (pages/checkout/index.vue, pages/checkout/success.vue)
// ============================================================================

export type CheckoutOrderItem = {
  id: number
  quantity: number
  unit_price: string
  line_total: string
  ticket_category_name_snapshot: string
  ticket_category: {
    event_date: {
      starts_at: string
      event: {
        title: string
      }
    }
  }
}

export type CheckoutOrder = {
  id: number
  status: string
  subtotal: string
  discount_total: string
  tax_total: string
  total: string
  currency: string
  discount_code_id: number | null
  items: CheckoutOrderItem[]
}

export type CheckoutSuccessOrder = {
  id: number
  status: string
  total: string
  currency: string
}

// ============================================================================
// BUYER ORDERS PAGES (pages/orders/index.vue, pages/orders/[id].vue)
// ============================================================================

export type OrderStatus = 'pending_payment' | 'paid' | 'cancelled'

export type BuyerOrderTicketCategory = {
  id: number
  event_date_id: number
  name: string
  price: string
  stock_total: number
  stock_sold: number
  status: string
}

export type BuyerOrderEventDate = {
  id: number
  event_id: number
  starts_at: string
  ends_at: string | null
  status: string
}

export type BuyerOrderEvent = {
  id: number
  title: string
  description: string | null
  image_path: string | null
  location: string | null
  status: string
  created_by: number
}

export type BuyerOrderTicketCategoryNested = {
  id: number
  event_date_id: number
  name: string
  price: string
  stock_total: number
  stock_sold: number
  status: string
  event_date: BuyerOrderEventDate & { event: BuyerOrderEvent }
}

export type BuyerOrderItemBase = {
  id: number
  order_id: number
  ticket_category_id: number
  quantity: number
  unit_price: string
  line_total: string
  event_date_id: number
  ticket_category_name_snapshot: string
}

export type BuyerOrderItem = BuyerOrderItemBase & {
  ticket_category: BuyerOrderTicketCategoryNested
}

export type BuyerOrderItemForDetail = BuyerOrderItemBase & {
  ticket_category: BuyerOrderTicketCategoryNested
  tickets?: BuyerOrderTicket[]
}

export type BuyerOrder = {
  id: number
  user_id: number
  status: OrderStatus
  subtotal: string
  discount_total: string
  tax_total: string
  total: string
  currency: string
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  created_at: string
  updated_at: string
  items: BuyerOrderItem[]
}

export type BuyerOrderDetail = {
  id: number
  user_id: number
  status: OrderStatus
  subtotal: string
  discount_total: string
  tax_total: string
  total: string
  currency: string
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  created_at: string
  updated_at: string
  items: BuyerOrderItemForDetail[]
}

export type PaginatedBuyerOrders = {
  current_page: number
  data: BuyerOrder[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string | null
  prev_page_url: string | null
  per_page: number
  to: number
  total: number
}

export type BuyerOrderTicket = {
  id: number
  order_item_id: number
  ticket_category_id: number
  code: string
  qr_payload: string | null
  status: string
  issued_at: string
  used_at: string | null
}

// ============================================================================
// ADMIN EVENTS PAGES (pages/admin/events/[id].vue)
// ============================================================================

export type AdminEventPerCategoryStat = {
  category_id: number
  name: string
  tickets_sold: string
  revenue: string
}

export type AdminEventPerDayStat = {
  date: string
  tickets_sold: string
  revenue: string
}

export type AdminEventStats = {
  per_category: AdminEventPerCategoryStat[]
  per_day: AdminEventPerDayStat[]
}

export type AdminEventDateStatus = 'scheduled' | 'on_sale' | 'finished' | 'cancelled'

export type AdminEventCreator = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  role: 'admin' | 'gestor' | 'buyer'
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AdminEventBase = {
  id: number
  title: string
  description: string
  location: string
  status: string
  image_path?: string
  created_by: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  creator: AdminEventCreator
}

export type AdminEventDateItem = {
  id: number
  event_id: number
  starts_at: string
  ends_at: string
  status: string
  created_at: string
  updated_at: string
}

export type AdminEventTicketCategory = {
  id: number
  event_date_id: number
  name: string
  price: string
  stock_total: number
  stock_sold: number
  status: string
  created_at: string
  updated_at: string
}

// ============================================================================
// ADMIN ORDERS PAGES (pages/admin/orders/index.vue, pages/admin/orders/[id].vue)
// ============================================================================

export type AdminOrderStatus = 'pending_payment' | 'paid' | 'cancelled'

export type AdminOrderItemBase = {
  id: number
  order_id: number
  ticket_category_id: number
  quantity: number
  line_total: string
}

export type AdminOrderItem = AdminOrderItemBase & {
  ticket_category: {
    event_date: {
      starts_at: string
      event: {
        title: string
      }
    }
  }
}

export type AdminOrderItemDetailed = {
  id: number
  order_id: number
  ticket_category_id: number
  quantity: number
  unit_price: string
  line_total: string
  event_date_id: number
  ticket_category_name_snapshot: string
  ticket_category: {
    id: number
    name: string
    event_date: {
      starts_at: string
      event: {
        id: number
        title: string
      }
    }
  }
  tickets?: AdminOrderTicket[]
}

export type AdminOrderUser = {
  id: number
  name: string
  email: string
}

export type AdminOrderPayment = {
  id: number
  provider: string
  environment: string | null
  stripe_payment_intent_id: string | null
  status: string
  amount: string
  currency: string
  paid_at: string | null
}

export type AdminOrder = {
  id: number
  user_id: number
  status: AdminOrderStatus
  total: string
  currency: string
  created_at: string
  user: AdminOrderUser
  items: AdminOrderItem[]
}

export type AdminOrderDetailed = {
  id: number
  user_id: number
  status: AdminOrderStatus
  subtotal: string
  discount_total: string
  tax_total: string
  total: string
  currency: string
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  created_at: string
  updated_at: string
  user: AdminOrderUser
  payment: AdminOrderPayment | null
  items: AdminOrderItemDetailed[]
}

export type AdminOrdersPaginated = {
  current_page: number
  data: AdminOrder[]
  last_page: number
  next_page_url: string | null
  prev_page_url: string | null
  total: number
}

export type AdminOrderTicket = {
  id: number
  order_item_id: number
  ticket_category_id: number
  code: string
  qr_payload: string | null
  status: string
  issued_at: string
  used_at: string | null
}

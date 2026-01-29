export type OrderStatus = 'pending_payment' | 'paid' | 'cancelled';

export type OrderItem = {
  id: number;
  order_id: number;
  ticket_category_id: number;
  ticket_category_name?: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  created_at?: string;
};

export type Ticket = {
  id: number;
  order_item_id: number;
  ticket_code: string;
  status: string;
  event_title?: string;
  event_date?: string;
  category_name?: string;
  created_at?: string;
};

export type Order = {
  id: number;
  order_number: string;
  user_id: number;
  status: OrderStatus;
  subtotal: string;
  discount_amount?: string;
  total: string;
  discount_code?: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
  tickets?: Ticket[];
};

export type PaginatedOrders = {
  data: Order[];
  current_page: number;
  last_page: number;
  total: number;
};

export type AdminOrderStatus = OrderStatus;

export type AdminOrderItem = OrderItem;

export type AdminOrder = Order;

export type AdminOrdersPaginated = PaginatedOrders;

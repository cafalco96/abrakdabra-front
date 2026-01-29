export type EventStatus = 'upcoming' | 'on_sale' | 'sold_out' | 'cancelled' | 'finished';
export type EventDateStatus = 'scheduled' | 'on_sale' | 'finished' | 'cancelled';

export type Creator = {
  id: number;
  name: string;
};

export type AdminEventItem = {
  id: number;
  title: string;
  status: EventStatus;
  created_at?: string;
};

export type AdminEvent = {
  id: number;
  title: string;
  description?: string;
  location?: string;
  status: EventStatus;
  creator: Creator;
  created_at?: string;
};

export type AdminEventBase = {
  id: number;
  title: string;
  description?: string;
  location?: string;
  status: EventStatus;
  created_at?: string;
  updated_at?: string;
};

export type EventsPaginated = {
  data: AdminEventItem[];
  current_page: number;
  last_page: number;
};

export type PerCategoryStat = {
  category_name: string;
  tickets_sold: number;
  revenue: number;
};

export type PerDayStat = {
  date: string;
  tickets_sold: number;
  revenue: number;
};

export type EventStats = {
  total_tickets_sold: number;
  total_revenue: number;
  per_category: PerCategoryStat[];
  per_day: PerDayStat[];
};

export type DashboardStats = {
  total_events: number;
  events_on_sale: number;
  tickets_sold_today: number;
  revenue_today: number;
  tickets_sold_total: number;
  revenue_total: number;
};

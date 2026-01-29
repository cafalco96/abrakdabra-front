export type PublicEvent = {
  id: number;
  title: string;
  description?: string;
  location?: string;
  status?: string;
  created_at?: string;
};

export type PublicEventsResponse = {
  data: PublicEvent[];
  current_page?: number;
  last_page?: number;
};

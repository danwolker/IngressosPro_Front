// Types for the Ingresso Pro application

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;          // ISO date string: "2024-12-25"
  time: string;          // "21:00"
  venue: string;
  address?: string;
  city: string;
  price: number;
  original_price?: number;
  image?: string;
  quantity: number;
  sold: number;
  status: 'active' | 'inactive' | 'sold_out' | 'cancelled';
  featured: boolean;
  theme?: string;
  icon?: string;
  amenities?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  event: Event;
  quantity: number;
}

export interface Order {
  id: number;
  event_id: number;
  event?: Event;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  cpf?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  payment_id?: string;
  ticket_code?: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

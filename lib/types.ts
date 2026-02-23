export type Cabin = {
  id: string;
  name: string;
  description: string | null;
  price_per_night: number;
  max_capacity: number;
  image_url: string | null;
  amenities: string[] | null;
};

export type Booking = {
  id: string;
  cabin_id: string;
  customer_name: string;
  customer_phone: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  cabins?: { name: string } | null;
};

export type Settings = {
  id: string;
  contact_phone: string | null;
  payment_alias: string | null;
  business_name: string | null;
};

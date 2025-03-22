export interface Product {
  id: string;
  name: string;
  sku: string;
  url: string;
  pictures: string[] | null;
  product_id: string;
}

export interface Review {
  id: string;
  created_at: string;
  updated_at: string | null;
  store_id: number;
  order_ref: string;
  product_id: string;
  reply: string | null;
  rating: number;
  status: string;
  author: string;
  title: string | null;
  body: string | null;
  pictures: string[] | null;
  video_url: string | null;
  votes_up: number;
  votes_down: number;
  is_recommended: boolean;
  is_anonymous: boolean | null;
  customer: string;
  notification_id: string;
  user_id: string | null;
  product_sku: string;
  verified_purchase: boolean;
  display_name: string;
  automatic_approval: boolean;
  ai_sentiment_classification: {
    negative: number;
    positive: number;
  } | null;
  imported_from: string | null;
  metadata: any | null;
  imported_id: string | null;
}

export interface Store {
  name: string;
  url: string;
  logo_url: string;
  is_enable_video: boolean;
  is_enable_pictures: boolean;
  required_review_when_rating_is_less_than: number | null;
}

export interface Customer {
  id: string;
  name: string;
}

export interface Notification {
  store_id: number;
  id: string;
  order_ref: string;
  order_id: string;
  productBody: Product[];
  reviews: Review[];
  stores: Store;
  customers: Customer;
}

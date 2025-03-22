import ReviewForm from "./ReviewForm";
import { Product, Notification } from "../types/interfaces";
interface ProductsProps {
  products: Product[];
  notification: Notification;
}

export default function Products({ products, notification }: ProductsProps) {
  return (
    <>
      {products.map((item) => (
        <ReviewForm key={item.id} product={item} notification={notification} />
      ))}
    </>
  );
}

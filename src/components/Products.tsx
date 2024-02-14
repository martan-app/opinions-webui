import ReviewForm from "./ReviewForm";

interface ProductsProps {
  products: any[];
  notification: any;
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

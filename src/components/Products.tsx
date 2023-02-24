import { Accordion } from "@mantine/core";
import { NotificationsHandle } from "./notifications";
import ProductsWrapper from "./ProductWrapper";

interface ProductsProps {
  products: any[];
  notification: any;
  alertComponent?: any | NotificationsHandle;
}

export default function Products({
  products,
  notification,
  alertComponent,
}: ProductsProps) {
  const list = products.map((item, index) => (
    <ProductsWrapper
      key={index}
      product={item}
      notification={notification}
      alertComponent={alertComponent}
    />
  ));

  return (
    <Accordion chevronPosition="right" variant="separated">
      {list}
    </Accordion>
  );
}

import { Accordion } from "@mantine/core"
import ProductsWrapper from "./ProductWrapper"
import { NotificationsHandle } from "./notifications"

interface ProductsProps {
  products: any[]
  notification: any
  alertComponent?: NotificationsHandle
}

export default function Products({
  products,
  notification,
  alertComponent,
}: ProductsProps) {
  const list = products.map((item) => (
    <ProductsWrapper
      key={item.id}
      product={item}
      notification={notification}
      alertComponent={alertComponent}
    />
  ))

  return (
    <Accordion p="sm" chevronPosition="right" variant="separated">
      {list}
    </Accordion>
  )
}

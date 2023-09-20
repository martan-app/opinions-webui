import { Accordion } from "@mantine/core"
import ProductsWrapper from "./ProductWrapper"
import { NotificationsHandle } from "./notifications"
import { useState } from "react"

interface ProductsProps {
  products: any[]
  notification: any
  alertComponent?: NotificationsHandle | null
}

export default function Products({
  products,
  notification,
  alertComponent,
}: ProductsProps) {
  const [acordionOpen, __acordionOpen] = useState<any>(null)
  const list = products.map((item) => (
    <ProductsWrapper
      openAcordion={__acordionOpen}
      key={item.id}
      product={item}
      notification={notification}
      alertComponent={alertComponent}
    />
  ))

  return (
    <Accordion
      onChange={__acordionOpen}
      value={acordionOpen}
      p="sm"
      chevronPosition="right"
      variant="separated"
    >
      {list}
    </Accordion>
  )
}

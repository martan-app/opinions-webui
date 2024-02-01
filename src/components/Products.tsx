import { Accordion } from "@mantine/core"
import ProductsWrapper from "./ProductWrapper"
import { NotificationsHandle } from "./notifications"
import { useMemo, useState } from "react"

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
  console.log(alertComponent)
  const [acordionOpen, __acordionOpen] = useState<any>(true)
  const list = products.map((item) => (
    <ProductsWrapper
      openAcordion={__acordionOpen}
      key={item.id}
      product={item}
      notification={notification}
      alertComponent={alertComponent}
    />
  ))

  const ids = useMemo(() => products.map(p => p.id), [products])

  return (
    <Accordion
      onChange={__acordionOpen}
      value={acordionOpen}
      p="sm"
      chevronPosition="right"
      variant="separated"
      multiple={true}
      defaultValue={ids}
    >
      {list}
    </Accordion>
  )
}

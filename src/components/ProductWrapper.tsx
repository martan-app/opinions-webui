/* eslint-disable react/display-name */
import { Accordion, Alert } from "@mantine/core"
import { memo, useEffect, useRef, useState } from "react"
import Form from "./Form"
import Product, { ProductHandle } from "./Product"
import AppStepper, { StepperHandle } from "./Stepper"
import { UploadImage } from "./UploadImage"
import { UploadVideo } from "./UploadVideo"
import { NotificationsHandle } from "./notifications"

interface ProductsProps {
  product: any
  notification: any
  alertComponent?: any | NotificationsHandle
  openAcordion: any
}

export default function ProductsWrapper({
  product,
  notification,
  alertComponent,
  openAcordion,
}: ProductsProps) {
  const [isLoading, __isLoading] = useState(false)
  const [reviewId, __reviewId] = useState<string | null>(null)
  const [step, __step] = useState<string>("review")

  const [hasPictures, __hasPictures] = useState(false)
  const [hasVideo, __hasVideo] = useState(false)

  const $steper = useRef<StepperHandle>(null)
  const $rating = useRef<ProductHandle>(null)

  async function updateReviewPictures(pictures: any[]): Promise<void> {
    __isLoading(true)
    const url = `/api/reviews/${reviewId}/pictures`
    const req = await fetch(url, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        "X-Token": "",
        "X-Store-Id": String(notification.store_id),
      },

      body: JSON.stringify(pictures),
    })

    if (req.ok && req.status === 204) {
      __step("video")
      __hasPictures(true)
      $steper.current?.nextStep()
    }
    __isLoading(false)
  }

  async function updateReviewVideo(videoUrl: string): Promise<void> {
    __isLoading(true)
    const url = `/api/reviews/${reviewId}/video`
    const req = await fetch(url, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        "X-Token": "",
        "X-Store-Id": String(notification.store_id),
      },

      body: JSON.stringify(videoUrl),
    })

    if (req.ok && req.status === 204) {
      __step("success")
      __hasPictures(true)
      $steper.current?.nextStep()
    }
    __isLoading(false)
  }

  useEffect(() => {
    if (notification?.reviews?.length) {
      const hasReview = notification.reviews.find(
        (r: any) => r.product_id === product.product_id
      )

      if (hasReview) {
        $steper.current?.setStep(3)
        $rating.current?.setReadOnly()
        $rating.current?.setRating(hasReview.rating)
        __step("success")
      }
    }
  }, [notification, product])

  function getPictureUrl() {
    let url = "https://img.icons8.com/ios/100/null/no-image.png"
    if (product?.pictures?.length) {
      url = product.pictures[0]
    }
    return url
  }

  function onCreateReview(id: string) {
    __reviewId(id)
    __step("pictures")
    $steper.current?.nextStep()
    $rating.current?.setReadOnly()
  }

  const FormMemo = memo(function (props: any) {
    return <Form {...props} />
  })

  return (
    <Accordion.Item value={product.id} key={product.label}>
      <Accordion.Control>
        <Product
          openAcordion={() => {
            openAcordion(product.id)
          }}
          name={product.name}
          image={getPictureUrl()}
          ref={$rating}
        />
      </Accordion.Control>

      <Accordion.Panel>
        <AppStepper ref={$steper} />

        <div
          id="review--form"
          style={{
            display: step === "review" ? "block" : "none",
          }}
        >
          <FormMemo
            notificationId={notification.id}
            customer={notification.customers}
            getRating={() => $rating.current?.getRating()}
            storeId={notification.store_id}
            product={product}
            order={notification.order_id}
            token=""
            onSave={({ id }: any): void => {
              onCreateReview(id)
            }}
            onError={() => {
              alertComponent?.error("Não foi possível enviar o review")
            }}
          />
        </div>

        <div
          id="review--upload-pictures"
          style={{
            display: step === "pictures" ? "block" : "none",
          }}
        >
          <UploadImage
            onUpload={(file) => {
              updateReviewPictures(file)
            }}
            onSkip={() => {
              $steper.current?.nextStep()
              __step("video")
            }}
            onError={(err) => {
              alertComponent?.error(err || "Não foi possivel enviar imagens")
            }}
          />
        </div>

        <div
          id="review--upload-video"
          style={{
            display: step === "video" ? "block" : "none",
          }}
        >
          <UploadVideo
            hasVideo={hasVideo}
            onUpload={(file) => {
              updateReviewVideo(file)
            }}
            onSkip={(to) => {
              to ? $steper.current?.backStep() : $steper.current?.nextStep()
              __step(to ?? "success")
            }}
            onError={(err) => {
              alertComponent?.error("Não foi possivel enviar seu vídeo")
            }}
          />
        </div>

        <div
          id="review-success"
          style={{
            display: step === "success" ? "block" : "none",
          }}
        >
          <Alert title="Enviado!" color="green" variant="light">
            Sua avaliação foi enviada com sucesso! Te informaremos assim que for
            publicada.
          </Alert>
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  )
}

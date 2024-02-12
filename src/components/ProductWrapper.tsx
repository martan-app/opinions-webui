/* eslint-disable react/display-name */
import { Alert, Card } from "@mantine/core";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { AuthorContext } from "./../context/notification";
import Form from "./Form";
import IsRecommended, { IsRecommendedHandle } from "./IsRecommended";
import Product, { ProductHandle } from "./Product";
import RatingWrapper, { RatingWrapperHandle } from "./RatingWrapper";
import { StepperHandle } from "./Stepper";
import { NotificationsHandle } from "./notifications";

interface ProductsProps {
  product: any;
  notification: any;
  alertComponent?: any | NotificationsHandle;
  openAcordion: any;
}

export default function ProductsWrapper({
  product,
  notification,
  alertComponent,
  openAcordion,
}: ProductsProps) {
  const [isLoading, __isLoading] = useState(false);
  const [reviewId, __reviewId] = useState<string | null>(null);
  const [step, __step] = useState<string>("review");
  const { author } = useContext<any>(AuthorContext);
  const [value, setValue] = useState("sim");

  const [hasPictures, __hasPictures] = useState(false);
  const [hasVideo, __hasVideo] = useState(false);
  const [hasReview, __hasReview] = useState(false);

  const $steper = useRef<StepperHandle>(null);
  const $rating = useRef<ProductHandle>(null);
  const $ratingWrapper = useRef<RatingWrapperHandle>(null);
  const $isRecommendedRef = useRef<IsRecommendedHandle>(null);

  async function updateReviewPictures(pictures: any[]): Promise<void> {
    __isLoading(true);
    const url = `/api/reviews/${reviewId}/pictures`;
    const req = await fetch(url, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        "X-Token": "",
        "X-Store-Id": String(notification.store_id),
      },

      body: JSON.stringify(pictures),
    });

    if (req.ok && req.status === 204) {
      __step("video");
      __hasPictures(true);
      $steper.current?.nextStep();
    }
    __isLoading(false);
  }

  async function updateReviewVideo(videoUrl: string): Promise<void> {
    __isLoading(true);
    const url = `/api/reviews/${reviewId}/video`;
    const req = await fetch(url, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        "X-Token": "",
        "X-Store-Id": String(notification.store_id),
      },

      body: JSON.stringify(videoUrl),
    });

    if (req.ok && req.status === 204) {
      __step("success");
      __hasPictures(true);
      $steper.current?.nextStep();
    }
    __isLoading(false);
  }

  async function apiRequest(url: string, method: string, props: any) {
    return fetch(url, {
      method,

      headers: {
        "Content-Type": "application/json",
        "X-Store-Id": String(notification.store_id),
      },

      body: JSON.stringify({
        ...props,
        author,
        order_ref: notification.order_id,
        product_id: product.product_id,
        product_sku: product.sku,
        customer: notification.customers.id,
        notification_id: notification.id,
      }),
    });
  }

  useEffect(() => {
    if (notification?.reviews?.length) {
      const hasReview = notification.reviews.find(
        (r: any) => r.product_id === product.product_id
      );

      if (hasReview) {
        // $steper.current?.setStep(3);
        $ratingWrapper.current?.setReadOnly();
        $ratingWrapper.current?.setRating(hasReview.rating);
        $rating.current?.setReadOnly();
        $rating.current?.setRating(hasReview.rating);
        //__step("success");
        __hasReview(true);
      }
    }
  }, [notification, product]);

  function getPictureUrl() {
    let url = "https://img.icons8.com/ios/100/null/no-image.png";
    if (product?.pictures?.length) {
      url = product.pictures[0];
    }
    return url;
  }

  function onCreateReview(id: string) {
    __reviewId(id);
    __hasReview(true);
    $rating.current?.setReadOnly();
    $rating.current?.setRating($ratingWrapper.current?.getRating());
    // __step("pictures");
    // $steper.current?.nextStep();
    // $rating.current?.setReadOnly();
  }

  async function updateReview(props: any) {
    const url = `/api/reviews/${reviewId}/review`;
    try {
      await apiRequest(url, "PATCH", props);
    } catch (error) {
      console.error(error);
    }
  }

  async function createReview(props: any) {
    __isLoading(true);

    // const url = "/api/reviews";
    // const req = await fetch(url, {
    //   method: "POST",

    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-Store-Id": String(notification.store_id),
    //   },

    //   body: JSON.stringify({
    //     author,
    //     order_ref: notification.order_id,
    //     product_id: product.product_id,
    //     product_sku: product.sku,
    //     rating,
    //     customer: notification.customers.id,
    //     notification_id: notification.id,
    //   }),
    // });
    const url = "/api/reviews";
    const req = await apiRequest(url, "post", props);
    const res = await req.json();

    if (req.ok) {
      __reviewId(res.id);
    }

    __isLoading(false);
  }

  function CreateOrUpdateWithRating(value: number) {
    let IsRecommended = $isRecommendedRef?.current?.getValue();
    if (!IsRecommended) {
      IsRecommended = true;
    } else {
      IsRecommended = IsRecommended === "sim";
    }
    if (reviewId) {
      updateReview({
        rating: value,
        is_recommended: IsRecommended,
      });
    } else {
      createReview({
        rating: value,
        is_recommended: IsRecommended,
      });
    }
  }

  function CreateOrUpdateWithIsRecommended(value: boolean) {
    if (reviewId && $ratingWrapper?.current?.getRating() > 0) {
      updateReview({
        is_recommended: value,
        rating: $ratingWrapper?.current?.getRating(),
      });
    } else if ($ratingWrapper?.current?.getRating() > 0) {
      createReview({
        is_recommended: value,
        rating: $ratingWrapper?.current?.getRating(),
      });
    }
  }

  const FormMemo = memo(function (props: any) {
    return <Form {...props} />;
  });

  return (
    <Card shadow="sm" mb="lg" p="lg" radius="md" withBorder key={product.label}>
      <Card.Section p="lg">
        <Product
          openAcordion={() => {
            openAcordion(product.id);
          }}
          name={product.name}
          image={getPictureUrl()}
          ref={$rating}
          onRating={(value) => {
            // CreateOrUpdateWithRating(value);
          }}
          hasReview={hasReview}
        />
      </Card.Section>
      {/* 
      <Card.Section p="lg">
        {" "}
        <AppStepper ref={$steper} />
      </Card.Section> */}

      <Card.Section p="lg">
        {!hasReview && (
          <div id="review--form">
            <RatingWrapper
              ref={$ratingWrapper}
              onRating={(value) => {
                CreateOrUpdateWithRating(value);
              }}
            />

            <IsRecommended
              ref={$isRecommendedRef}
              onChange={(value) => {
                CreateOrUpdateWithIsRecommended(value === "sim");
              }}
            />

            <FormMemo
              ratingRef={$ratingWrapper}
              alertComponent={alertComponent}
              store={notification.stores}
              reviewId={reviewId}
              step={step}
              notificationId={notification.id}
              customer={notification.customers}
              getRating={() => $ratingWrapper.current?.getRating()}
              storeId={notification.store_id}
              product={product}
              order={notification.order_id}
              onRating={(value: any) => {
                CreateOrUpdateWithRating(value);
                $ratingWrapper.current?.setRating(value);
              }}
              onSave={({ id }: any): void => {
                onCreateReview(id);
              }}
              onError={() => {
                alertComponent?.error("Não foi possível enviar o review");
              }}
              onUploadPictures={(p: any[]) => updateReviewPictures(p)}
              onUploadVideo={(v: string) => updateReviewVideo(v)}
            />
          </div>
        )}

        {hasReview && (
          <div id="review-success">
            <Alert title="Enviado!" color="green" variant="light">
              Sua avaliação foi enviada com sucesso! Te informaremos assim que
              for publicada.
            </Alert>
          </div>
        )}
      </Card.Section>
    </Card>
  );
}

/* eslint-disable react/display-name */
import {
  Alert,
  Button,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  Text,
  TextInput,
  Textarea
} from "@mantine/core";
import { useRouter } from "next/router"
import { usePostHog } from "posthog-js/react"
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { AuthorContext } from "./../context/notification";
import UploadImageWithImgKit from "./../lib/imageUploader";
import imagekit from "./../utils/imagekit-client";

import Author from "./Author";
import IsRecommended, { IsRecommendedHandle } from "./IsRecommended";
import Product, { ProductHandle } from "./Product";
import RatingWrapper, { RatingWrapperHandle } from "./RatingWrapper";
import { UploadImage } from "./UploadImage";
import { UploadVideo } from "./UploadVideo";

import { Notification, Product as ProductType } from "../types/interfaces";

interface ProductsProps {
  product: ProductType;
  notification: Notification;
}

export default function ReviewForm({ product, notification }: ProductsProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const [isLoading, __isLoading] = useState(false);
  const [hasReview, __hasReview] = useState(false);
  const [errorRating, setErrorRating] = useState(false);
  const [step, __step] = useState<string>("review");
  const [reviewId, __reviewId] = useState<string | null>(null);

  const [isRecommendedAux, setIsRecommendedAux] = useState<any>(null);
  const [ratingAux, setRatingAux] = useState<any>(null);

  const [body, __body] = useState("");
  const [title, __title] = useState("");
  const [pictures, __pictures] = useState<any>(null);
  const [video, __video] = useState<any>(null);

  const { author, __author } = useContext<any>(AuthorContext);

  const $rating = useRef<ProductHandle>(null);
  const $ratingWrapper = useRef<RatingWrapperHandle>(null);
  const $isRecommendedRef = useRef<IsRecommendedHandle>(null);

  useEffect(() => {
    if (notification?.reviews?.length) {
      const reviews = notification.reviews.find(
        (r: any) => r.product_id === product.product_id
      );

      if (reviews) {
        $rating.current?.setReadOnly();
        $rating.current?.setRating(reviews.rating);
        __step("success");
        __hasReview(true);
      }
    }

    posthog.group("store", notification.stores.name);
  }, [notification, posthog, product]);

  function getPictureUrl() {
    let url = "https://img.icons8.com/ios/100/null/no-image.png";
    if (product?.pictures?.length) {
      url = product.pictures[0];
    }
    return url;
  }

  function CreateOrUpdateWithRating(value: number) {
    $ratingWrapper?.current?.setDisabled()
    $isRecommendedRef?.current?.setDisabled()
    setRatingAux(value);
    let IsRecommended = $isRecommendedRef?.current?.getValue();
    if (!IsRecommended) {
      IsRecommended = true;
    } else {
      IsRecommended = IsRecommended === "sim";
    }

    const body = {
      rating: value,
      is_recommended: IsRecommended,
    }

    return reviewId
      ? updateReview(body)
      : createReview(body);
  }

  function CreateOrUpdateWithIsRecommended(value: boolean) {
    setIsRecommendedAux(value);
    if (reviewId && $ratingWrapper?.current?.getRating() > 0) {
      return updateReview({
        is_recommended: value,
        rating: $ratingWrapper?.current?.getRating(),
      });
    }
    if ($ratingWrapper?.current?.getRating() > 0) {
      return createReview({
        is_recommended: value,
        rating: $ratingWrapper?.current?.getRating(),
      });
    }
  }

  async function createReview(props: any) {
    try {
      const body = {
        ...props,
        author,
        order_ref: notification.order_id,
        product_id: product.product_id,
        product_sku: product.sku,
        customer: notification.customers.id,
        notification_id: notification.id,
      };
      const url = "/api/reviews";
      const req = await apiRequest(url, "POST", body);
      let reviewId = null;
      if (req.ok) {
        const res = await req.json();
        reviewId = res.id;
        __reviewId(res.id);
      }
      if (typeof window !== 'undefined' && 'clarity' in window) {
        ;(window as any).clarity("event", "review_created", {
          review_id: reviewId,
        })
      }
      return req;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      $ratingWrapper?.current?.setEnabled();
      $isRecommendedRef?.current?.setEnabled();
      __isLoading(false);
    }
  }

  async function updateReview(props: any) {
    const url = `/api/reviews/${reviewId}/review`;
    try {
      const body = {
        ...props,
        author,
      };
      await apiRequest(url, "PATCH", body);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      $ratingWrapper?.current?.setEnabled();
      $isRecommendedRef?.current?.setEnabled();
      __isLoading(false);
    }
  }

  async function apiRequest(url: string, method: string, bodyReq: any) {
    return fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Store-Id": String(notification.store_id),
        "X-Token": router.query.t,
      } as any,
      body: JSON.stringify(bodyReq),
    });
  }

  async function submit(changeSteep: boolean = true) {
    const rating = $ratingWrapper.current?.getRating();
    if (typeof rating !== "number" || rating <= 0) {
      setErrorRating(true);
      return;
    }
    setErrorRating(false);
    __isLoading(true);

    let url = "/api/reviews";
    let method = "POST";
    let bodyApi: any = {
      rating,
    };

    if (title) bodyApi["title"] = title;
    if (body) bodyApi["body"] = body;

    if (reviewId) {
      url += `/${reviewId}/review`;
      method = "PATCH";
    }

    if (method === "POST") {
      bodyApi = {
        ...bodyApi,
        order_ref: notification.order_id,
        product_id: product.product_id,
        product_sku: product.sku,
        customer: notification.customers.id,
        notification_id: notification.id,
      };
    }

    const req = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Store-Id": notification.store_id,
        "X-Token": router.query.t,
      } as any,

      body: JSON.stringify(bodyApi),
    });

    let success = false;
    if (reviewId) {
      if (req.ok && req.status === 204) {
        success = true;
        changeSteep && __step("media");
      }
    } else {
      const res = await req.json();
      if (req.ok) {
        success = true;
        changeSteep && __step("media");
        __reviewId(res.id);
      } else if (!req.ok && req.status >= 400) {
        // onError(res);
      }
    }
    const event = success ? "review_submitted_successfully" : "review_submitted_error";
    posthog.capture(event, {
      product_id: product.product_id,
      notification_id: notification.id,
      rating: rating,
      title: title,
      body: body,
      is_recommended: isRecommendedAux,
      pictures: pictures,
      video: video,
    })
    __isLoading(false);
  }

  async function uploads() {
    __isLoading(true);

    Promise.all([uploadVideo(), uploadPictures()])
      .then(() => {
        submit(false);
        __step("success");
      })
      .finally(() => {
        __isLoading(false);
      });
  }

  async function uploadVideo() {
    if (!video) return Promise.resolve();

    try {
      const videoRes = await imagekit.upload({
        file: video,
        fileName: video.name,
        useUniqueFileName: true,
        folder: "videos/reviews/",
        tags: ["reviews"],
      });

      const url = imagekit.url({
        path: videoRes.filePath,
        urlEndpoint: process.env.NEXT_PUBLIC_IMGKIT_ENDPOINT,
        transformation: [
          {
            format: "auto",
            quality: "80",
            cropMode: "pad_resize",
            height: "500",
            width: "500",
            aspectRatio: "4-3",
          },
        ],
      });
      posthog.capture("video_uploaded", {
        product_id: product.product_id,
        notification_id: notification.id,
        review_id: reviewId,
      })
      if (url) {
        return updateReviewVideo(url);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function uploadPictures() {
    if (!pictures?.length) {
      return Promise.resolve();
    }

    const listOfPictures: any = [];
    const promises = pictures?.map((file: File) =>
      UploadImageWithImgKit(file)
        .then((img) => listOfPictures.push(img))
        .catch(console.error)
    );

    await Promise.all(promises);
    posthog.capture("pictures_uploaded", {
      product_id: product.product_id,
      notification_id: notification.id,
      review_id: reviewId,
    })
    return listOfPictures.length
      ? updateReviewPictures(listOfPictures)
      : Promise.resolve();
  }

  async function updateReviewPictures(pictures: any[]) {
    const url = `/api/reviews/${reviewId}/pictures`;
    return fetch(url, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        "X-Store-Id": notification.store_id,
        "X-Token": router.query.t,
      } as any,

      body: JSON.stringify(pictures),
    });
  }

  async function updateReviewVideo(videoUrl: string) {
    const url = `/api/reviews/${reviewId}/video`;
    return fetch(url, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        "X-Store-Id": notification.store_id,
        "X-Token": router.query.t,
      } as any,

      body: JSON.stringify(videoUrl),
    });
  }

  const buttonLabel = useCallback(
    function () {
      if (isLoading) {
        return "Enviando..";
      }

      return "Enviar minha avaliação";
    },
    [isLoading]
  );

  return (
    <Card
      bg="#faf9f9"
      shadow="lg"
      mb="lg"
      p="lg"
      maw={700}
      w="100%"
      radius="md"
      withBorder
      key={product.product_id}
    >
      <Card.Section p="lg" withBorder={!hasReview}>
        <Product
          name={product.name}
          image={getPictureUrl()}
          ref={$rating}
          hasReview={hasReview}
        />
      </Card.Section>

      <Card.Section p="lg">
        <div
          id="review--form"
          style={{
            display: step === "review" ? "block" : "none",
          }}
        >
          <RatingWrapper
            ref={$ratingWrapper}
            onRating={(value) => {
              if (!isLoading) {
                CreateOrUpdateWithRating(value)
                setErrorRating(false)
              }
            }}
            isError={errorRating}
          />

          {errorRating && (
            <Alert
              title="Escolha uma nota para o produto"
              color="red.6"
              withCloseButton
              onClose={() => setErrorRating(false)}
              variant="filled"
              mt="md"
            >
              Use as estrelas acima para dar nota ao produto
            </Alert>
          )}

          <IsRecommended
            ref={$isRecommendedRef}
            onChange={(value) => {
              CreateOrUpdateWithIsRecommended(value === "sim")
            }}
          />

          <Text pb="xs" size="xl" fw={500} align="center">
            Conte o que você achou do produto
          </Text>

          <Textarea
            // placeholder="Pode ser curto tipo; fácil montagem, bem acabado, ótima embalagem de entrega, etc :)"
            placeholder={
              (typeof isRecommendedAux === "boolean" &&
                isRecommendedAux === false) ||
              (ratingAux && ratingAux <= 3)
                ? ""
                : "Pode ser curto tipo; fácil montagem, bem acabado, ótima embalagem de entrega, etc :)"
            }
            // description="Fale sobre o produto e evite comentar o atendimento ou outros serviços:"
            description=" "
            error={
              (typeof isRecommendedAux === "boolean" &&
                isRecommendedAux === false) ||
              (ratingAux && ratingAux <= 3)
                ? "Por favor, compartilhe conosco o porquê da nota escolhida para que possamos aprimorar nossos produtos e serviços."
                : null
            }
            size="lg"
            mb="xl"
            autosize
            maxRows={10}
            minRows={4}
            value={body}
            onChange={(event) => __body(event.currentTarget.value)}
          />

          <Author
            onChange={(authorName: string) => {
              if (authorName) {
                __author(authorName)
              }
              posthog.capture("author_changed", {
                product_id: product.product_id,
                notification_id: notification.id,
                review_id: reviewId,
              })
            }}
          />

          <Group position="center" mt="md" mb="mb" w="100%">
            <Button
              onClick={(e) => {
                e.preventDefault()
                if (!isLoading) submit(true).catch(console.error)
              }}
              fullWidth
              size="lg"
              type="submit"
              disabled={isLoading}
              style={{
                maxWidth: "100%",
                width: "100%",
              }}
              color="pink.7"
            >
              {buttonLabel()}
            </Button>
          </Group>
        </div>

        <div
          id="review-media"
          style={{
            display: step === "media" ? "block" : "none",
          }}
        >
          <LoadingOverlay visible={isLoading} zIndex={1000} overlayBlur={2} />

          <TextInput
            placeholder="Resuma sua avaliação em poucas palavras"
            label="Mais algum ponto que devemos saber?"
            // description="Escreva um título para a sua avaliação"
            description=" "
            size="lg"
            // mb="xl"
            maxLength={70}
            value={title}
            onChange={(event) => __title(event.currentTarget.value)}
          />
          <Group position="right">
            <Text c="gray">
              <strong>{70 - title?.length}</strong> caracteres restante
            </Text>
          </Group>

          {notification.stores?.is_enable_pictures && (
            <UploadImage
              onReady={(files: any) => {
                __pictures(files)
              }}
            />
          )}

          {notification.stores?.is_enable_video && (
            <UploadVideo
              onReady={(files: any) => {
                __video(files)
              }}
            />
          )}

          <Flex gap="md" mt="md">
            <Button
              style={{
                maxWidth: "50%",
                width: "50%",
              }}
              fullWidth
              size="lg"
              color="pink.7"
              disabled={isLoading}
              variant="outline"
              onClick={() => {
                __step("success")
                posthog.capture("review_skipped", {
                  product_id: product.product_id,
                  notification_id: notification.id,
                  review_id: reviewId,
                })
              }}
            >
              Pular etapa
            </Button>

            <Button
              style={{
                maxWidth: "50%",
                width: "50%",
              }}
              fullWidth
              color="pink.7"
              size="lg"
              disabled={isLoading}
              onClick={uploads}
            >
              {isLoading ? "Enviando.." : "Finalizar"}
            </Button>
          </Flex>
        </div>

        <div
          id="review-success"
          style={{
            display: step === "success" ? "block" : "none",
          }}
        >
          <Alert title="Enviado!" color="green.9" variant="light">
            <Text size="md">Avaliação foi enviada com sucesso!</Text>
          </Alert>
        </div>
      </Card.Section>
    </Card>
  )
}

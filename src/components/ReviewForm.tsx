/* eslint-disable react/display-name */
import {
  Alert,
  Button,
  Card,
  Flex,
  Group,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
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

interface ProductsProps {
  product: any;
  notification: any;
}

export default function ReviewForm({ product, notification }: ProductsProps) {
  const [isLoading, __isLoading] = useState(false);
  const [step, __step] = useState<string>("review");
  const [reviewId, __reviewId] = useState<string | null>(null);

  const [hasReview, __hasReview] = useState(false);
  const [body, __body] = useState("");
  const [title, __title] = useState("");
  const [errorRating, setErrorRating] = useState(false);
  const [pictures, __pictures] = useState<any>(null);
  const [video, __video] = useState<any>(null);

  const { author, __author } = useContext<any>(AuthorContext);

  const $rating = useRef<ProductHandle>(null);
  const $ratingWrapper = useRef<RatingWrapperHandle>(null);
  const $isRecommendedRef = useRef<IsRecommendedHandle>(null);
  // TODO: verificar isso aqui
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
  }, [notification, product]);

  function getPictureUrl() {
    let url = "https://img.icons8.com/ios/100/null/no-image.png";
    if (product?.pictures?.length) {
      url = product.pictures[0];
    }
    return url;
  }

  function CreateOrUpdateWithRating(value: number) {
    let IsRecommended = $isRecommendedRef?.current?.getValue();
    if (!IsRecommended) {
      IsRecommended = true;
    } else {
      IsRecommended = IsRecommended === "sim";
    }

    reviewId
      ? updateReview({
          rating: value,
          is_recommended: IsRecommended,
        })
      : createReview({
          rating: value,
          is_recommended: IsRecommended,
        });
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

  async function createReview(props: any) {
    const url = "/api/reviews";
    const req = await apiRequest(url, "post", props);
    const res = await req.json();

    if (req.ok) {
      __reviewId(res.id);
    }
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

  async function updateReview(props: any) {
    const url = `/api/reviews/${reviewId}/review`;
    try {
      await apiRequest(url, "PATCH", props);
    } catch (error) {
      console.error(error);
    }
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

    if (reviewId) {
      url += `/${reviewId}/review`;
      method = "PATCH";
    }

    const req = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Store-Id": String(notification.store_id),
      },

      body: JSON.stringify({
        title,
        body,
        order_ref: notification.order_id,
        product_id: product.product_id,
        product_sku: product.sku,
        rating,
        customer: notification.customers.id,
        notification_id: notification.id,
      }),
    });

    if (reviewId) {
      if (req.ok && req.status === 204) {
        changeSteep && __step("media");
      }
    } else {
      const res = await req.json();
      if (req.ok) {
        changeSteep && __step("media");
      } else if (!req.ok && req.status >= 400) {
        // onError(res);
      }
    }

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
        .catch((err) => {
          console.error(err);
        })
    );

    await Promise.all(promises);
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
        "X-Token": "",
        "X-Store-Id": String(notification.store_id),
      },

      body: JSON.stringify(pictures),
    });
  }

  async function updateReviewVideo(videoUrl: string) {
    const url = `/api/reviews/${reviewId}/video`;
    return fetch(url, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        "X-Token": "",
        "X-Store-Id": String(notification.store_id),
      },

      body: JSON.stringify(videoUrl),
    });
  }

  const buttonLabel = useCallback(
    function () {
      if (isLoading) {
        return "Enviando..";
      }

      if (step === "picture") {
        return "Enviar fotos";
      }

      if (step === "video") {
        return "Enviar vídeo";
      }

      return "Publicar Avaliação";
    },
    [isLoading, step]
  );

  return (
    <Card shadow="sm" mb="lg" p="lg" radius="md" withBorder key={product.label}>
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
              CreateOrUpdateWithRating(value);
              setErrorRating(false);
            }}
          />

          {errorRating && (
            <Alert
              title="Escolha uma nota para o produto"
              color="red"
              withCloseButton
              onClose={() => setErrorRating(false)}
              variant="filled"
              mb="md"
            >
              Use as estrelas acima para dar nota ao produto
            </Alert>
          )}

          <IsRecommended
            ref={$isRecommendedRef}
            onChange={(value) => {
              CreateOrUpdateWithIsRecommended(value === "sim");
            }}
          />

          <Textarea
            placeholder="Exemplo; foi facil a montagem, bem acabado, etc e tal."
            label="Conte o que você achou do produto"
            // description="Fale sobre o produto e evite comentar o atendimento ou outros serviços:"
            description=" "
            // error="Verifique o campo"
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
                __author(authorName);
              }
            }}
          />

          <Group position="center" mt="md" mb="mb" w="100%">
            <Button
              onClick={(e) => {
                e.preventDefault();
                submit().catch(console.error);
              }}
              fullWidth
              size="lg"
              type="submit"
              disabled={isLoading}
              style={{
                maxWidth: "100%",
                width: "100%",
              }}
              color="blue.8"
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
                __pictures(files);
              }}
            />
          )}

          {notification.stores?.is_enable_video && (
            <UploadVideo
              onReady={(files: any) => {
                __video(files);
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
              disabled={isLoading}
              variant="outline"
              onClick={() => {
                __step("success");
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
              color="blue.8"
              size="lg"
              disabled={isLoading}
              onClick={uploads}
            >
              {isLoading ? "Enviando.." : "Enviar"}
            </Button>
          </Flex>
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
      </Card.Section>
    </Card>
  );
}

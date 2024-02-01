import {
  Alert,
  Box,
  Button,
  Checkbox,
  Group,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useContext, useEffect, useState } from "react";
import { sanitize } from "string-sanitizer";
import { AuthorContext } from "./../context/notification";
import Author from "./Author";
import { UploadImage } from "./UploadImage";
import { UploadVideo } from "./UploadVideo";
import UploadImageWithImgKit from "./../lib/imageUploader";
import imagekit from "./../utils/imagekit-client";
import { NotificationsHandle } from "./notifications";

interface ProductsProps {
  alertComponent: NotificationsHandle;
  getRating: () => number;
  storeId: number;
  notificationId: string;
  order: any;
  product: any;
  onSave: (reviewId: any) => void;
  onUploadVideo: (file: any) => void;
  onUploadPictures: (files: any) => void;
  onError: (error: any) => void;
  customer: any;
  step: string;
  reviewId?: string;
  store?: any;
}

export default function Form({
  alertComponent,
  step,
  order,
  product,
  onSave,
  onError,
  getRating,
  storeId,
  customer,
  notificationId,
  reviewId,
  store,
  onUploadVideo,
  onUploadPictures,
}: ProductsProps) {
  const [isLoading, __isLoading] = useState(false);
  const { author } = useContext<any>(AuthorContext);

  const [pictures, setPictures] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);

  const [errorRating, setErrorRating] = useState(false);

  const form = useForm({
    initialValues: {
      author,
      title: "",
      body: "",
      is_recommended: true,
    },

    validate: {
      // title: (value) => (!value.length ? "Campo obrigatório" : null),
      // body: (value) =>
      //   value.length < 10
      //     ? "A avaliação precisa ter no mínimo 10 caracteres"
      //     : null,
    },
  });

  async function createReview(values: any) {
    console.log(getRating(), alertComponent);
    if (getRating() <= 0) {
      setErrorRating(true);
      return;
    }
    setErrorRating(false);
    __isLoading(true);

    const fieldsToSanitize = ["author", "title", "body"];
    fieldsToSanitize.forEach((field) => {
      if (values[field]) {
        values[field] = sanitize.keepUnicode(values[field]);
      }
    });

    let url = "/api/reviews";
    let method = "POST";

    if (reviewId) {
      url += `/${reviewId}/review`;
      method = "PATCH";
    }

    //const url = "/api/reviews";
    const req = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Store-Id": String(storeId),
      },

      body: JSON.stringify({
        ...values,
        order_ref: order,
        product_id: product.product_id,
        product_sku: product.sku,
        rating: getRating(),
        customer: customer.id,
        notification_id: notificationId,
      }),
    });

    const uploads = async () => {
      const promises = [];
      if (store?.is_enable_pictures && pictures?.length) {
        promises.push(uploadPictures());
      }

      if (store?.is_enable_video && video) {
        promises.push(uploadVideo());
      }

      await Promise.all(promises);
    };

    if (reviewId) {
      if (req.ok && req.status === 204) {
        onSave(reviewId);
      }

      uploads();
    } else {
      const res = await req.json();
      if (req.ok && typeof onSave === "function") {
        onSave(res);
        uploads();
      } else if (!req.ok && req.status >= 400) {
        onError(res);
      }
    }

    __isLoading(false);
  }

  async function uploadVideo() {
    if (video) {
      __isLoading(true);
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

        if (typeof onUploadVideo === "function" && url) {
          onUploadVideo(url);
        }
      } catch (error) {
        if (typeof onError === "function") {
          onError(error);
        }
      } finally {
        __isLoading(false);
      }
    }
  }

  async function uploadPictures(): Promise<void> {
    if (pictures?.length) {
      __isLoading(true);
      const listOfPictures: any = [];
      const promises = pictures?.map((file: File) =>
        UploadImageWithImgKit(file)
          .then((img) => listOfPictures.push(img))
          .catch((err) => {
            console.error(err);
          })
      );

      return Promise.all(promises)
        .then(() => {
          if (
            listOfPictures?.length &&
            typeof onUploadPictures === "function"
          ) {
            onUploadPictures(listOfPictures);
          }
        })
        .finally(() => {
          __isLoading(false);
        });
    }
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

      return "Enviar";
    },
    [isLoading, step]
  );

  return (
    <>
      <form onSubmit={form.onSubmit((values) => createReview(values))}>
        {/* <Box>
        <Checkbox
          size="xl"
          mt="md"
          label="Você recomendaria este produto?"
          {...form.getInputProps("is_recommended", { type: "checkbox" })}
        />
      </Box> */}

        <Box>
          <Author
            onChange={(author) => {
              if (author) {
                form.setFieldValue("author", author);
              }
            }}
          />

          <TextInput
            placeholder="Exemplo: Fácil manuseio"
            label="Título"
            description="Escreva um título para a sua avaliação"
            size="lg"
            mb="xl"
            {...form.getInputProps("title")}
          />

          <Textarea
            placeholder="Exemplo; foi facil a montagem, bem acabado.."
            label="Seu comentário"
            description="Fale sobre o produto e evite comentar o atendimento ou outros serviços:"
            error="Verifique o campo"
            size="lg"
            mb="xl"
            autosize
            maxRows={10}
            minRows={4}
            {...form.getInputProps("body")}
          />
        </Box>

        {store?.is_enable_pictures && (
          <UploadImage
            onReady={(files) => {
              setPictures(files);
            }}
          />
        )}

        {store?.is_enable_video && (
          <UploadVideo
            onReady={(files) => {
              setVideo(files);
            }}
          />
        )}

        {errorRating && (
          <Alert
            title="Escolha uma nota para o produto"
            color="red"
            withCloseButton
            onClose={() => setErrorRating(false)}
            variant="filled"
          >
            Escolha uma nota de 1 a 5 para o produto antes de enviar o
            formulário.
          </Alert>
        )}

        <Group position="right" mt="md" mb="mb">
          <Button size="lg" type="submit" disabled={isLoading}>
            {buttonLabel()}
          </Button>
        </Group>
      </form>
    </>
  );
}

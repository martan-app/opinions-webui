import {
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

interface ProductsProps {
  getRating: () => number;
  storeId: number;
  notificationId: string;
  order: any;
  product: any;
  token: string;
  onSave: (reviewId: any) => void;
  onError: (error: any) => void;
  customer: any;
  step: string;
}

export default function Form({
  step,
  order,
  product,
  token,
  onSave,
  onError,
  getRating,
  storeId,
  customer,
  notificationId,
}: ProductsProps) {
  console.log({ step });
  const [isLoading, __isLoading] = useState(false);
  const { author } = useContext<any>(AuthorContext);

  const form = useForm({
    initialValues: {
      author: author,
      title: "",
      body: "",
      is_recommended: true,
    },

    validate: {
      title: (value) => (!value.length ? "Campo obrigatório" : null),
      body: (value) =>
        value.length < 10
          ? "A avaliação precisa ter no mínimo 10 caracteres"
          : null,
    },
  });

  async function createReview(values: any) {
    __isLoading(true);

    const fieldsToSanitize = ["author", "title", "body"];
    fieldsToSanitize.forEach((field) => {
      if (values[field]) {
        values[field] = sanitize.keepUnicode(values[field]);
      }
    });

    const url = "/api/reviews";
    const req = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Token": token,
        "X-Store-Id": String(storeId),
      },

      body: JSON.stringify({
        ...values,
        order,
        product: product.product_id,
        sku: product.sku,
        rating: getRating(),
        customer,
        notification_id: notificationId,
      }),
    });

    const res = await req.json();
    if (req.ok && typeof onSave === "function") {
      onSave(res);
    } else if (!req.ok && req.status >= 400) {
      onError(res);
    }

    __isLoading(false);
  }

  const buttonLabel = useCallback(
    function () {
      console.log({isLoading, step})
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
    <form onSubmit={form.onSubmit((values) => createReview(values))}>
      <Box>
        <Author
          onChange={(author) => {
            if (author) {
              form.setFieldValue("author", author);
            }
          }}
        />

        <TextInput
          withAsterisk
          placeholder="Exemplo: Fácil manuseio"
          label="Título"
          description="Escreva um título para a sua avaliação"
          size="md"
          mb="xl"
          {...form.getInputProps("title")}
        />

        <Textarea
          placeholder="Exemplo; foi facil a montagem, bem acabado.."
          label="Seu comentário"
          description="Fale sobre o produto e evite comentar o atendimento ou outros serviços:"
          error="Verifique o campo"
          size="md"
          autosize
          maxRows={10}
          minRows={4}
          withAsterisk
          {...form.getInputProps("body")}
        />

        <Checkbox
          mt="md"
          label="Você recomendaria este produto?"
          {...form.getInputProps("is_recommended", { type: "checkbox" })}
        />
      </Box>

      <Group position="right" mt="md" mb="mb">
        <Button type="submit" disabled={isLoading}>
          {/* {isLoading ? "Enviando.." : "Enviar"} */}
          {buttonLabel()}
        </Button>
      </Group>
    </form>
  );
}

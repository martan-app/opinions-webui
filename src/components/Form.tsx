import {
  Box,
  Button,
  Checkbox,
  Group,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

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
}

export default function Form({
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
  const [isLoading, __isLoading] = useState(false)
  const form = useForm({
    initialValues: {
      title: "",
      body: "",
      is_recommended: true,
    },

    validate: {
      body: (value) =>
        value.length < 10
          ? "A avaliação precisa ter no mínimo 10 caracteres"
          : null,
    },
  });

  async function createReview(values: any) {
    __isLoading(true)
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
        rating: getRating(),
        customer,
        notification_id: notificationId
      }),
    });

    const res = await req.json();
    if (req.ok && typeof onSave === "function") {
      onSave(res);
    } else if (!req.ok && req.status >= 400) {
      onError(res);
    }

    __isLoading(false)
  }

  return (
    <form onSubmit={form.onSubmit((values) => createReview(values))}>
      <Box>
        <TextInput
          placeholder="Exemplo: Facil manuseio"
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
        <Button type="submit" disabled={isLoading}>{
          isLoading ? "Enviando.." : "Enviar"
        }</Button>
      </Group>
    </form>
  );
}

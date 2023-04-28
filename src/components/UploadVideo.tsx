/* eslint-disable jsx-a11y/alt-text */
import { Box, Button, FileInput, Flex } from "@mantine/core";

import { useState } from "react";
import uuid from "uuid-random";
import supabase from "../utils/supabase-client";

interface Props {
  hasPictures: boolean;
  onUpload: (files: any) => void;
  onError: (error: any) => void;
  onSkip: (to?: string) => void;
}

export function UploadVideo(props: Partial<Props>) {
  const [isLoading, __isLoading] = useState(false);
  const { onUpload, onSkip, onError, hasPictures } = props;

  const [file, __file] = useState<File | null>(null);

  async function upload() {
    if (file) {
      __isLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from("testeupload")
          .upload(`videos/${file.name}`, file, {
            upsert: true,
            contentType: file.type,
          });

        if (data?.path) {
          const { data: publicURL } = supabase.storage
            .from("testeupload")
            .getPublicUrl(`photos/${file.name}`);
          if (onUpload && publicURL && publicURL.publicUrl) {
            onUpload(publicURL.publicUrl);
          }
        }
      } catch (error) {}
      __isLoading(false);
    }
  }

  return (
    <Flex direction="column">
      <Flex
        sx={{
          width: "100%",
        }}
      >
        <FileInput
          sx={{
            width: "100%",
          }}
          accept="video/mp4"
          value={file}
          onChange={__file}
          placeholder="Escolhe um video"
          label="Video"
          description="Gostou do produto? porque não envia um video?"
        />
      </Flex>

      <Flex
        gap="md"
        justify={!hasPictures ? "space-between" : "flex-end"}
        align="center"
        direction="row"
        wrap="wrap-reverse"
        mt="md"
      >
        {!hasPictures && (
          <Button
            disabled={isLoading}
            variant="light"
            onClick={() => {
              if (onSkip) {
                onSkip("pictures");
              }
            }}
          >
            Voltar
          </Button>
        )}

        <Flex gap={10}>
          <Button
          disabled={isLoading}
          variant="outline"
          onClick={() => {
            if (onSkip) {
              onSkip();
            }
          }}
        >
          Pular etapa
        </Button>

        <Button disabled={isLoading} onClick={upload}>
          {isLoading ? "Enviando.." : "Enviar"}
        </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

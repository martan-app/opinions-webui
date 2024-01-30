/* eslint-disable jsx-a11y/alt-text */
import { Button, FileInput, Flex } from "@mantine/core";

import { useState } from "react";
import imagekit from "./../utils/imagekit-client";

interface Props {
  hasVideo?: boolean;
  onReady?: (files: any) => void;
  onUpload?: (files: any) => void;
  onError?: (error: any) => void;
  onSkip?: (to?: string) => void;
}

export function UploadVideo(props: Partial<Props>) {
  const [isLoading, __isLoading] = useState(false);
  const { onUpload, onSkip, onError, hasVideo, onReady } = props;

  const [file, __file] = useState<File | null>(null);

  async function upload() {
    if (file) {
      __isLoading(true);
      try {
        const video = await imagekit.upload({
          file,
          fileName: file.name,
          useUniqueFileName: true,
          folder: "videos/reviews/",
          tags: ["reviews"],
        });

        const url = imagekit.url({
          path: video.filePath,
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

        if (typeof onUpload === "function" && url) {
          onUpload(url);
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

  return (
    <Flex direction="column" mt="lg">
      <Flex
        sx={{
          width: "100%",
        }}
      >
        <FileInput
          size="xl"
          sx={{
            width: "100%",
          }}
          accept=".webm,.mp4,.mov"
          value={file}
          onChange={(file) => {
            __file(file);
            typeof onReady === "function" && onReady(file);
          }}
          placeholder="Escolher um video"
          label="Video"
          description="Gostou do produto? Por que não envia um video?"
        />
      </Flex>

      <Flex
        gap="md"
        justify={!hasVideo ? "space-between" : "flex-end"}
        align="center"
        direction="row"
        wrap="wrap-reverse"
        mt="md"
      >
        {/* {!hasVideo && (
          <Button
            disabled={isLoading}
            variant="light"
            onClick={() => {
              if (onSkip) {
                onSkip("pictures")
              }
            }}
          >
            Voltar
          </Button>
        )} */}

        {/* <Flex gap={10}>
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={() => {
              if (onSkip) {
                onSkip()
              }
            }}
          >
            Pular etapa
          </Button>

          <Button disabled={isLoading} onClick={() => {
            upload().catch(console.error)
          }}>
            {isLoading ? "Enviando.." : "Enviar"}
          </Button>
        </Flex> */}
      </Flex>
    </Flex>
  );
}

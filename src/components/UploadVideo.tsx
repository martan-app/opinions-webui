/* eslint-disable jsx-a11y/alt-text */
import { FileInput, Flex } from "@mantine/core";

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
          size="lg"
          sx={{
            width: "100%",
          }}
          accept=".webm,.mp4,.mov"
          value={file}
          onChange={(file) => {
            __file(file);
            typeof onReady === "function" && onReady(file);
          }}
          placeholder="Escolher um vídeo"
          label="Vídeo"
          description="Por que não envia um vídeo?"
        />
      </Flex>
    </Flex>
  );
}

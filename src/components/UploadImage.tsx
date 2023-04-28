/* eslint-disable jsx-a11y/alt-text */
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  Menu,
  SimpleGrid,
  Text,
} from "@mantine/core";
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { useState } from "react";
import uuid from "uuid-random";
import supabase from "../utils/supabase-client";

interface Props extends DropzoneProps {
  onUpload: (files: any) => void;
  onError: (error: any) => void;
  onSkip: () => void;
}

export function UploadImage(props: Partial<Props>) {
  const { onUpload, onSkip, onError } = props;

  const [isLoading, __isLoading] = useState(false);
  const [files, __files] = useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    if (!file) return null;
    const imageUrl = window.URL.createObjectURL(file);
    return (
      <Grid.Col key={index} span={3}>
        <Card
          withBorder
          shadow="sm"
          radius="md"
          key={index}
          sx={{
            maxWidth: "150px",
            height: "150px",
          }}
        >
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Menu withinPortal position="right-start" shadow="sm">
                <Menu.Target>
                  <ActionIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-dots"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                      <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                      <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                    </svg>
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-trash"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 7l16 0"></path>
                        <path d="M10 11l0 6"></path>
                        <path d="M14 11l0 6"></path>
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                      </svg>
                    }
                    color="red"
                  >
                    Remover
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Card.Section>

          <Card.Section mt="sm">
            <Image
              key={index}
              src={imageUrl}
              imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
          </Card.Section>
        </Card>
      </Grid.Col>
    );
  });

  async function upload() {
    if (files.length > 0) {
      __isLoading(true);
      try {
        const urls = [];
        for (const file of files) {
          const ext = file.name.substr(file.name.lastIndexOf(".") + 1);
          const id = uuid();
          const newName = `${id}.${ext}`;
          const { data, error } = await supabase.storage
            .from("testeupload")
            .upload(`photos/${newName}`, file, {
              upsert: true,
              contentType: file.type,
            });

          if (data?.path) {
            const { data: publicURL } = supabase.storage
              .from("testeupload")
              .getPublicUrl(`photos/${newName}`);
            urls.push({
              _id: id,
              url: publicURL.publicUrl,
              size: "original",
            });
          }

          if (error && typeof onError === "function") {
            onError(error);
          }
        }

        if (urls.length && typeof onUpload === "function") {
          onUpload(urls);
        }
      } catch (error) {}
      __isLoading(false);
    }
  }

  function setFilesToUpload(data: []) {
    __files(data);
    // __files(old => {
    //   const oldFiles = Array.from(old)
    //   if (oldFiles.length < 4) {
    //     let i = 0
    //     while (oldFiles.length < 4) {
    //       oldFiles.push(data[i]);
    //       i++
    //     }

    //     return oldFiles
    //   }

    //   return oldFiles
    // })
  }

  return (
    <Box>
      <Dropzone
        multiple
        loading={isLoading}
        onDrop={setFilesToUpload}
        onReject={(files) => {
          if (typeof onError === "function") {
            onError("Máximo de arquivos permitido: 4");
          }
        }}
        maxSize={3 * 1024 ** 2}
        maxFiles={4}
        accept={IMAGE_MIME_TYPE}
        {...props}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: 220, pointerEvents: "none" }}
        >
          <div>
            <Text size="xl" inline>
              Arraste imagens ou toque para adicionar.
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Envie até 4 fotos do produto.
            </Text>
          </div>
        </Group>
      </Dropzone>

      <Grid mt={previews.length > 0 ? "xl" : 0}>{previews}</Grid>

      <Flex
        mih={50}
        gap="md"
        justify="flex-end"
        align="center"
        direction="row"
        wrap="wrap-reverse"
        mt="md"
      >
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
    </Box>
  );
}

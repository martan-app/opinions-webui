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
  Text,
} from "@mantine/core"
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone"
import { useState } from "react"
import UploadImageWithImgKit from "./../lib/imageUploader"

interface Props extends DropzoneProps {
  onUpload: (files: any) => void
  onError: (error: any) => void
  onSkip: () => void
}

export function UploadImage(props: Partial<Props>) {
  const { onUpload, onSkip, onError } = props

  const [isLoading, __isLoading] = useState(false)
  const [files, __files] = useState<FileWithPath[]>([])

  const previews = files.map((file) => {
    if (!file) return null
    const imageUrl = window.URL.createObjectURL(file)
    return (
      <Grid.Col key={file.name} span={3}>
        <Card
          withBorder
          shadow="sm"
          radius="md"
          key={file.name}
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
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
            <div className="preview-pictures">
              <Image
                alt={file.name}
                key={file.name}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
              />
            </div>
          </Card.Section>
        </Card>
      </Grid.Col>
    )
  })

  async function upload(): Promise<void> {
    if (files.length > 0) {
      __isLoading(true)
      const listOfPictures: any = []
      const promises = files.map((file) =>
        UploadImageWithImgKit(file)
          .then((img) => listOfPictures.push(img))
          .catch((err) => {
            console.error(err)
          })
      )

      return Promise.all(promises)
        .then(() => {
          if (listOfPictures?.length && typeof onUpload === "function") {
            onUpload(listOfPictures)
          }
        })
        .finally(() => {
          __isLoading(false)
        })
    }
  }

  function setFilesToUpload(data: []) {
    __files(data)
  }

  return (
    <Box>
      <Dropzone
        multiple
        loading={isLoading}
        onDrop={setFilesToUpload}
        onReject={(files) => {
          if (typeof onError === "function") {
            onError("Máximo de arquivos permitido: 5")
          }
        }}
        maxSize={3 * 1024 ** 2}
        maxFiles={5}
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
              onSkip()
            }
          }}
        >
          Pular etapa
        </Button>

        <Button
          disabled={isLoading}
          onClick={() => {
            upload().catch(console.error)
          }}
        >
          {isLoading ? "Enviando.." : "Enviar"}
        </Button>
      </Flex>
    </Box>
  )
}

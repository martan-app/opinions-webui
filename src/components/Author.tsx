import { Box, Button, Menu, Text, TextInput } from "@mantine/core"
import { useContext, useState } from "react"
import sinitizer from "string-sanitizer"
import { AuthorContext } from "./../context/notification"

interface Props {
  onChange: (author: string) => void
}

export default function Author({ onChange }: Props) {
  const { author, __author } = useContext<any>(AuthorContext)
  const [newAuthor, __newAuthor] = useState("")

  function saveAuthor() {
    if (newAuthor) {
      __author(sinitizer.sanitize.keepUnicode(newAuthor))
      onChange(newAuthor)
    }
  }

  return (
    <>
      <Box mb="xl">
        <Menu shadow="md">
          <Text fz="lg" fw={500}>
            Autor
          </Text>

          <Text fz="sm" c="dimmed">
            Publicar como{" "}
            <span style={{ textTransform: "capitalize" }}>{author}</span>{" "}
            <Menu.Target>
              <span
                style={{
                  color: "#e03131",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                editar
              </span>
            </Menu.Target>
          </Text>
          <Menu.Dropdown p="md">
            <TextInput
              onChange={(e) => __newAuthor(e.target.value)}
              label="Editar autor"
              size="md"
              mb="xl"
              defaultValue={author}
              key={author}
            />

            <Button disabled={!newAuthor} onClick={() => saveAuthor()}>
              Salvar
            </Button>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </>
  )
}

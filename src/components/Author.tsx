import { Box, Button, Menu, Text, TextInput } from "@mantine/core";
import { useContext, useState } from "react";
import sinitizer from "string-sanitizer";
import { displayName } from "../utils/display-name";
import { AuthorContext } from "./../context/notification";

interface Props {
  onChange: (author: string) => void;
}

export default function Author({ onChange }: Props) {
  const { author, __author } = useContext<any>(AuthorContext);
  const [newAuthor, __newAuthor] = useState("");
  const [opened, setOpened] = useState(false);

  function saveAuthor() {
    if (newAuthor) {
      __author(sinitizer.sanitize.keepUnicode(newAuthor));
      onChange(newAuthor);
      setOpened(false);
    }
  }

  return (
    <Box mb="xl">
      <Menu shadow="md" opened={opened} onChange={setOpened}>
        <Text align="right" fz="sm" c="dimmed">
          Publicar como{" "}
          <span style={{ textTransform: "capitalize" }}>
            {displayName(author)}
          </span>{" "}
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
  );
}

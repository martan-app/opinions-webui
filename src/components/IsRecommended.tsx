import { Button, Flex, Group, Text } from "@mantine/core";
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

interface RecommendedProps {
  onChange?: (value: any) => void;
}

export type IsRecommendedHandle = {
  getValue: () => any;
  setValue: (rating: string) => void;
  setDisabled: () => void;
  setEnabled: () => void;
};

const IsRecommended: ForwardRefRenderFunction<
  IsRecommendedHandle,
  RecommendedProps
> = ({ onChange }, ref) => {
  const [value, setValue] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setValue: (value) => setValue(value),
    setDisabled: () => setDisabled(true),
    setEnabled: () => setDisabled(false),
  }));

  return (
    <Group
      style={{
        flexDirection: "column",
        marginBottom: "3rem",
        marginTop: "3rem",
      }}
    >
      <Text size="xl" fw={550} align="center">
        Você recomendaria este produto?
      </Text>

      <Flex
        w="100%"
        align="center"
        sx={{
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Button
          onClick={() => {
            typeof onChange === "function" && onChange("sim");
            setValue("sim");
          }}
          color="green"
          size="lg"
          variant={value === "sim" ? "filled" : "outline"}
          style={{
            // maxWidth: "130px",
            width: "100%",
          }}
          rightIcon={<IconThumbUp />}
          disabled={disabled}
        >
          Sim, eu recomendo
        </Button>

        <Button
          onClick={() => {
            setValue("nao");
            typeof onChange === "function" && onChange("nao");
          }}
          color="red"
          size="lg"
          variant={value === "nao" ? "filled" : "outline"}
          style={{
            // maxWidth: "130px",
            width: "100%",
          }}
          rightIcon={<IconThumbDown />}
          disabled={disabled}
        >
          Não, eu não recomendo
        </Button>
      </Flex>
    </Group>
  );
};

export default forwardRef(IsRecommended);

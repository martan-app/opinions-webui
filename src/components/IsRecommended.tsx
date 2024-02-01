import {
  Radio,
  Box,
  Flex,
  Group,
  Image,
  Rating,
  Text,
  Button,
} from "@mantine/core";
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
};

const IsRecommended: ForwardRefRenderFunction<
  IsRecommendedHandle,
  RecommendedProps
> = ({ onChange }, ref) => {
  const [value, setValue] = useState("");

  useImperativeHandle(ref, () => ({
    getValue: () => ({
      is_recommended: value === "sim",
    }),
    setValue: (value) => setValue(value),
  }));

  return (
    // <Radio.Group
    //   value={value}
    //   onChange={(value) => {
    //     setValue(value);
    //     typeof onChange === "function" &&
    //       onChange({
    //         is_recommended: value === "sim",
    //       });
    //   }}
    //   name="is_recommeded"
    //   label="Recomendaria o produto"
    //   spacing="xl"
    //   offset="sm"
    //   size="lg"
    //   mb="lg"
    // >
    //   <Radio value="sim" label="Sim" />
    //   <Radio value="nao" label="Não" />
    // </Radio.Group>

    <Group
      style={{
        flexDirection: "column",
      }}
    >
      <Text size="xl" fw={500}>
        Você recomendaria o produto
      </Text>

      <Group>
        <Button
          onClick={() => setValue("sim")}
          color="green"
          size="lg"
          variant={value === "sim" ? "filled" : "outline"}
        >
          Sim
        </Button>
        <Button
          onClick={() => setValue("nao")}
          color="red"
          size="lg"
          variant={value === "nao" ? "filled" : "outline"}
        >
          Não
        </Button>
      </Group>
    </Group>
  );
};

export default forwardRef(IsRecommended);

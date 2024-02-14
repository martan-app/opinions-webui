import { Button, Group, Text } from "@mantine/core";
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
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
  const [value, setValue] = useState<string>("");

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setValue: (value) => setValue(value),
  }));

  // useEffect(() => {
  //   typeof onChange === 'function' && onChange({
  //     is_recommended: value === "sim"
  //   })
  // }, [onChange, value])

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
        marginBottom: "3rem",
        marginTop: "3rem",
      }}
    >
      <Text size="xl" fw={500} align="center">
        Você recomendaria esse produto
      </Text>

      <Group
        w="100%"
        align="center"
        sx={{
          justifyContent: "center",
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
            maxWidth: "130px",
            width: "100%",
          }}
          leftIcon={<IconThumbUp />}
        >
          Sim
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
            maxWidth: "130px",
            width: "100%",
          }}
          leftIcon={<IconThumbDown />}
        >
          Não
        </Button>
      </Group>
    </Group>
  );
};

export default forwardRef(IsRecommended);

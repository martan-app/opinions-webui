import { Box, Flex, Group, Image, Rating, Text, rem } from "@mantine/core";
import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

interface RatingProps {
  onRating?: (value: any) => void;
}

export type RatingWrapperHandle = {
  getRating: () => any;
  setReadOnly: () => void;
  setRating: (rating: number) => void;
};

const RatingWrapper: ForwardRefRenderFunction<
  RatingWrapperHandle,
  RatingProps
> = ({ onRating }, ref) => {
  const [rating, __rating] = useState(0);
  const [isReadOnly, __isReadOnly] = useState(false);

  useImperativeHandle(ref, () => ({
    getRating: () => rating,
    setReadOnly: () => __isReadOnly(true),
    setRating: (rating) => __rating(rating),
  }));

  return (
    <Flex direction="column" align="center" mb="lg">
      <Text size="xl" fw={500}>
        Escolha uma nota para o produto!
      </Text>
      <Text c="gray">Campo obrigatório</Text>

      <Group>
        <Rating
          onChange={(r) => {
            __rating(r);
            typeof onRating === "function" && onRating(r);
          }}
          defaultValue={rating}
          readOnly={isReadOnly}
          size="xl"
          mt="md"
        />

        {/* <Text size="xl" fw={500}>
          ({rating})
        </Text> */}
      </Group>
    </Flex>
  );
};

export default forwardRef(RatingWrapper);

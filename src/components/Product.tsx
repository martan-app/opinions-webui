import { Avatar, Group, Image, Rating, Text } from "@mantine/core";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from "react";

interface ProductProps {
  name: string;
  image?: string;
}

export type ProductHandle = {
  getRating: () => any;
  setReadOnly: () => void;
  setRating: (rating: number) => void;
};

const Product: ForwardRefRenderFunction<ProductHandle, ProductProps> = (
  { name, image },
  ref
) => {
  const [rating, __rating] = useState(5);
  const [isReadOnly, __isReadOnly] = useState(false);

  useImperativeHandle(ref, () => ({
    getRating: () => rating,
    setReadOnly: () => __isReadOnly(true),
    setRating: (rating) => __rating(rating),
  }));

  return (
    <Group noWrap>
      <Image
        width={200}
        height={150}
        src={image}
        alt="With default placeholder"
        withPlaceholder
        radius="md"
        fit="cover"
        sx={{
          transition: "transform 1s, filter 2s ease-in-out",
          filter: "blur(0.3px)",
          transform: "scale(1.1)",
          "&:hover": {
            filter: "blur(0)",
            transform: "scale(1)",
          },
        }}
      />

      <div>
        <Text>{name}</Text>
        <Text size="sm" color="dimmed" weight={400}>
          <Rating
            defaultValue={rating}
            onChange={__rating}
            name={name}
            readOnly={isReadOnly}
            size="lg"
            mt="md"
          />
        </Text>
      </div>
    </Group>
  );
};

export default forwardRef(Product);

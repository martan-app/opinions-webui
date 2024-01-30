import { Box, Group, Image, Rating, Text } from "@mantine/core";
import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

interface ProductProps {
  name: string;
  image?: string;
  openAcordion?: any;
  onRating?: (value: any) => void;
  hasReview?: boolean;
}

export type ProductHandle = {
  getRating: () => any;
  setReadOnly: () => void;
  setRating: (rating: number) => void;
};

const Product: ForwardRefRenderFunction<ProductHandle, ProductProps> = (
  { name, image, openAcordion, onRating, hasReview },
  ref
) => {
  const [rating, __rating] = useState(0);
  const [isReadOnly, __isReadOnly] = useState(false);

  useImperativeHandle(ref, () => ({
    getRating: () => rating,
    setReadOnly: () => __isReadOnly(true),
    setRating: (rating) => __rating(rating),
  }));

  return (
    <Group noWrap>
      <Image
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
          maxWidth: "200px",
          width: "100%",

          // Static media query
          "@media (max-width: 580px)": {
            maxWidth: "100px",
          },
        }}
      />

      <Box p="md">
        <Text
          sx={{
            // Static media query
            "@media (max-width: 580px)": {
              fontSize: "14px",
            },
          }}
        >
          {name}
        </Text>
        {hasReview && (
          <Text size="sm" color="dimmed" weight={400}>
            <Rating
              defaultValue={rating}
              name={name}
              readOnly={hasReview}
              size="xl"
              mt="md"
            />
          </Text>
        )}
      </Box>
    </Group>
  );
};

export default forwardRef(Product);

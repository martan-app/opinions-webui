import { Flex, Text } from "@mantine/core";
import { Rating } from "@smastrom/react-rating";
import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

const CUSTOM_GROUP_LABEL = "O que achou do produto?";
const CUSTOM_GROUP_LABEL_ID = "group_label";

const CUSTOM_ITEM_LABELS = ["Ruim", "Fraco", "Médio", "Muito Bom", "Excelente"];
const CUSTOM_ITEM_LABELS_IDS = [
  "label_1",
  "label_2",
  "label_3",
  "label_4",
  "label_5",
];

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
    <Flex
      direction="column"
      align="center"
      mb="xl"
      style={{
        marginBottom: "2rem",
      }}
    >
      <Text size="xl" fw={500}>
        Escolha uma nota para o produto
      </Text>

      {rating <= 0 && (
        <Text size="xs" c="gray">
          Resposta obrigatório
        </Text>
      )}
      {/* <Group>
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

        <Text size="xl" fw={500}>
          ({rating})
        </Text>
      </Group> */}

      <div role="group" style={{ maxWidth: 400, width: "100%" }}>
        <Rating
          value={rating}
          // itemStyles={customStyles}
          onChange={(value: any) => {
            __rating(value)
            typeof onRating === 'function' && onRating(value)
          }}
          visibleLabelId={CUSTOM_GROUP_LABEL_ID}
          invisibleItemLabels={CUSTOM_ITEM_LABELS}
          spaceBetween="small"
          spaceInside="medium"
          transition="colors"
          isRequired
        />
      </div>
    </Flex>
  );
};

export default forwardRef(RatingWrapper);

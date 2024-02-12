import { Flex, Text } from "@mantine/core";
import { Rating } from "@smastrom/react-rating";
import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

const CUSTOM_GROUP_LABEL = "Qual é a sua nota para este produto?";
const CUSTOM_GROUP_LABEL_ID = "group_label";

const CUSTOM_ITEM_LABELS = [
  "Não gostei",
  "Poderia ser melhor",
  "Bom",
  "Muito Bom",
  "Excelente",
];
const CUSTOM_ITEM_LABELS_IDS = [1, 2, 3, 4, 5];

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
        marginBottom: "3rem",
      }}
    >
      <Text size="xl" mt="md" fw={500} align="center">
        Qual é a sua nota para este produto?
      </Text>

      {rating <= 0 && (
        <Text size="xs" mb="md" mt="md" c="gray">
          Resposta obrigatória
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

      <div role="group">
        <Rating
          value={rating}
          // itemStyles={customStyles}
          onChange={(value: any) => {
            __rating(value);
            typeof onRating === "function" && onRating(value);
          }}
          visibleLabelId={CUSTOM_GROUP_LABEL_ID}
          invisibleItemLabels={CUSTOM_ITEM_LABELS}
          spaceBetween="small"
          spaceInside="medium"
          transition="colors"
          isRequired
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            justifyItems: "center",
          }}
        >
          {CUSTOM_ITEM_LABELS.map((label, index) => (
            <span
              onClick={() => {
                __rating(CUSTOM_ITEM_LABELS_IDS[index]);
                typeof onRating === "function" &&
                  onRating(CUSTOM_ITEM_LABELS_IDS[index]);
              }}
              key={label}
              id={"label_" + CUSTOM_ITEM_LABELS_IDS[index]}
              style={{
                opacity: index + 1 === rating ? 1 : 0.35,
                textDecoration: index + 1 === rating ? "underline" : "inherit",
                padding: "0 5%",
                textAlign: "center",
                cursor: 'pointer'
              }}
            >
              <strong>{label}</strong>
            </span>
          ))}
        </div>
      </div>
    </Flex>
  );
};

export default forwardRef(RatingWrapper);

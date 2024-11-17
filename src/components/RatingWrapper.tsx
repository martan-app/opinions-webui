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
  "Muito ruim",
  "Ruim",
  "Pode ser melhor",
  "Bom",
  "Ótimo",
];
const CUSTOM_ITEM_LABELS_IDS = [1, 2, 3, 4, 5];

interface RatingProps {
  onRating?: (value: any) => void;
  isError?: boolean;
}

export type RatingWrapperHandle = {
  getRating: () => any;
  setRating: (rating: number) => void;
  setDisabled: () => void;
  setEnabled: () => void;
};

const RatingWrapper: ForwardRefRenderFunction<
  RatingWrapperHandle,
  RatingProps
> = ({ onRating, isError }, ref) => {
  const [rating, __rating] = useState(0);
  const [isDisabled, __isDisabled] = useState(false);

  useImperativeHandle(ref, () => ({
    getRating: () => rating,
    setRating: (rating) => __rating(rating),
    setDisabled: () => __isDisabled(true),
    setEnabled: () => __isDisabled(false),
  }));

  return (
    <Flex direction="column" align="center">
      <Text size="xl" mt="md" fw={500} align="center">
        Qual é a sua nota para este produto?
      </Text>

      {rating <= 0 && (
        <Text size="xs" mt="xs" c="gray">
          Resposta obrigatória
        </Text>
      )}
      <div role="group">
        <Rating
          value={rating}
          // itemStyles={customStyles}
          onChange={(value: any) => {
            __rating(value)
            typeof onRating === "function" && onRating(value)
          }}
          visibleLabelId={CUSTOM_GROUP_LABEL_ID}
          invisibleItemLabels={CUSTOM_ITEM_LABELS}
          spaceBetween="small"
          spaceInside="medium"
          transition="colors"
          isRequired
          isDisabled={isDisabled}
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
                __rating(CUSTOM_ITEM_LABELS_IDS[index])
                typeof onRating === "function" &&
                  onRating(CUSTOM_ITEM_LABELS_IDS[index])
              }}
              key={label}
              id={"label_" + CUSTOM_ITEM_LABELS_IDS[index]}
              style={
                !isError
                  ? {
                      opacity: index + 1 === rating ? 1 : 0.59,
                      textDecoration:
                        index + 1 === rating ? "underline" : "inherit",
                      padding: "0 5%",
                      textAlign: "center",
                      cursor: "pointer",
                      fontSize: "20px",
                    }
                  : {
                      // opacity: index + 1 === rating ? 1 : 0.35,
                      textDecoration: 1,
                      // fontWeight: 'bold',
                      padding: "0 5%",
                      textAlign: "center",
                      cursor: "pointer",
                      color: "red",
                      fontSize: "20px",
                    }
              }
            >
              <strong>{label}</strong>
            </span>
          ))}
        </div>
      </div>
    </Flex>
  )
};

export default forwardRef(RatingWrapper);

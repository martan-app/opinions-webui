import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from "react";

import {
  Dialog,
  Group,
  Button,
  TextInput,
  Text,
  Notification,
} from "@mantine/core";
import { CircleCheck, CircleX } from "tabler-icons-react";

interface Props {}

export type NotificationsHandle = {
  success: (msg: string) => void;
  error: (msg: string) => void;
};

const Notifications: ForwardRefRenderFunction<NotificationsHandle, Props> = (
  props,
  ref
) => {
  const [opened, __opened] = useState(false);
  const [message, __message] = useState("");
  const [type, __type] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    success: (msg: string) => {
      __message(msg);
      __type("success");
      __opened(true);
    },

    error: (msg: string) => {
      __message(msg);
      __type("error");
      __opened(true);
    },
  }));

  function close() {
    __message("");
    __type(null);
    __opened(false);
  }

  return (
    <Dialog
      opened={opened}
      withCloseButton
      onClose={close}
      p={0}
      size="lg"
      radius="md"
    >
      <Notification
        onClose={close}
        icon={
          type === "success" ? <CircleCheck size={18} /> : <CircleX size={18} />
        }
        color={type === "success" ? "teal" : "red"}
      >
        {message}
      </Notification>
    </Dialog>
  );
};

export default forwardRef(Notifications);

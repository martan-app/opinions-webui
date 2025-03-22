import { Anchor, Flex, Image, Text } from "@mantine/core";

export const LogoMartan = ({ store }: { store: string }) => (
  <Flex align="center" justify="center">
    <Text fw="normal" italic size="xs" c="dimmed">
      Powered by
    </Text>

    <Anchor
      href={`https://martan.app?ref=opinioes&store=${store}`}
      target="_blank"
    >
      <Image
        src="https://ik.imagekit.io/2wovc1fdm/storefront-widget.png"
        fit="cover"
        maw="150px"
        alt="Logo"
      />
    </Anchor>
  </Flex>
);

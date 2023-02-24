import { Image } from "@mantine/core";

type Props = {
  src: string;
};

export const Logo = ({ src }: Props) => <Image src={src} fit="cover" width="120px" alt="Logo"/>;

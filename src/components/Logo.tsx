import { Image } from "@mantine/core"

type Props = {
  src: string
}

export const Logo = ({ src }: Props) => (
  <Image src={src} fit="cover" maw="200px" alt="Logo" />
)

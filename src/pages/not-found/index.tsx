import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
} from "@mantine/core";
import image from "./../../assets/404.svg";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  mobileImage: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

export default function NotFoundImage() {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}
      >
        <Image src={image.src} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>
            Aff, não era pra ter acontecido isto...
          </Title>
          <Text color="dimmed" size="lg">
            A página que você está tentando abrir não existe. Você pode ter
            digitado errado o endereço ou a página foi movida para outro URL. se
            você acha este é um erro, entre em contato com o suporte.
          </Text>

          <a href="https://martan.app" target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              size="md"
              mt="xl"
              className={classes.control}
            >
              Home
            </Button>
          </a>
        </div>

        <Image
          src={image.src}
          className={classes.desktopImage}
          alt="not found image"
        />
      </SimpleGrid>
    </Container>
  );
}

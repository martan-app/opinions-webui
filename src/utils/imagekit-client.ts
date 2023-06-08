import ImageKit from "imagekit-javascript"

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMGKIT_PUK,
  urlEndpoint: process.env.NEXT_PUBLIC_IMGKIT_ENDPOINT,
  authenticationEndpoint: "http://localhost:3000/api/auth",
})

export default imagekit

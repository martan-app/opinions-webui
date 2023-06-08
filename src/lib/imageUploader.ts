import { ColorThief } from "colorthief"
import uuid from "uuid-random"
import imagekit from "./../utils/imagekit-client"

const transformations: any = {
  big: {
    format: "auto",
    quality: 80,
    cropMode: "pad_resize",
    // background: "#eee",
    height: "500",
    width: "500",
    aspectRatio: "4-3",
  },

  normal: {
    format: "auto",
    quality: 80,
    cropMode: "at_least",
    // background: "#eee",
    // height: "200",
    width: "300",
    //aspectRatio: "4:3",
  },

  thumb: {
    format: "auto",
    quality: 80,
    // cropMode: "pad_resize",
    // background: "#eee",
    height: "100",
    width: "100",
    aspectRatio: "4-3",
  },
}

const rgbToHex = (r: number, g: number, b: number) =>
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16)
      return hex.length === 1 ? "0" + hex : hex
    })
    .join("")

async function getBackgroundColor(file: File) {
  const imgEl = document.querySelector(`img[alt="${file.name}"]`)

  let background = "FFFFFF"
  try {
    const colorThief = new ColorThief()
    const [r, g, b] = await colorThief.getColor(imgEl)
    background = rgbToHex(r, g, b)
  } catch (error) {}

  return background
}

export default async function UploadImageWithImgKit(file: File) {
  const background = await getBackgroundColor(file)
  return imagekit
    .upload({
      file,
      fileName: file.name,
      useUniqueFileName: true,
      folder: "images/reviews/",
      tags: ["reviews"],
    })
    .then((img) => {
      const pictureObj: any = {
        _id: uuid(),
        original: img.url,
      }

      for (const key in transformations) {
        if (Object.prototype.hasOwnProperty.call(transformations, key)) {
          const config = {
            path: img.filePath,
            urlEndpoint: process.env.NEXT_PUBLIC_IMGKIT_ENDPOINT,
            transformation: [
              {
                ...transformations[key],
                background,
              },
            ],
          }

          pictureObj[key] = imagekit.url(config)
        }
      }

      return pictureObj
    })
}

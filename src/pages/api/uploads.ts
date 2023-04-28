import multiparty from "multiparty"
import { NextRequest } from "next/server"
import uuid from "uuid-random"
import supabase from "../../utils/supabase-client"

export const config = {
  api: {
    bodyParser: false,
  },
  runtime: 'edge',
}

const saveFile = async (files: any) => {
  const success: any = []
  const errors: any = []
  const promises = files.map(async (file: any) => {
    const { data, error } = await supabase.storage
      .from("testeupload")
      .upload(`photos/${file.newFilename}`, file, {
        upsert: true,
        contentType: file.mimetype,
      })

    const { data: publicURL } = supabase.storage
      .from("testeupload")
      .getPublicUrl(`photos/${file.newFilename}`)

    if (data) {
      success.push({
        _id: uuid(),
        url: publicURL,
        size: "original",
      })
    } else if (error) {
      errors.push(error)
    }
  })

  await Promise.all(promises)
  return Promise.resolve({
    data: success,
    errors,
  })
}

const post = async (req: NextRequest) => {
  // const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
  const form = new multiparty.Form()

  form.parse(req, async function (err, fields, { files }) {
    const { data, errors } = await saveFile(files)
    return data
      ? new Response(JSON.stringify(data), {
          status: 201,
          headers: {
            "content-type": "application/json",
          },
        })
      : new Response(JSON.stringify(errors), {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        })
  })
}

export default function handler(
  req: NextRequest
) {
  switch (req.method) {
    case "POST":
      post(req)
      break
    case "PUT":
    case "DELETE":
    case "PATCH":
    case "GET":
      return new Response(
        JSON.stringify({
          status: 405,
          error_code: 105,
          message: "Metodo não permitido",
          user_message: {
            en_us: "Method not allowed",
            pt_br: "Metodo não permitido",
          },
          more_info: null,
        }),
        {
          status: 405,
          headers: {
            "content-type": "application/json",
          },
        }
      )
  }
}

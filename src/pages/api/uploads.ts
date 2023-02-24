import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import supabase from "./../../utils/supabase-client";
import uuid from "uuid-random";
import multiparty from "multiparty"
type Data = any;

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (files: any) => {
  const success: any = [];
  const errors: any = [];
  const promises = files.map(async (file: any) => {
    const { data, error } = await supabase.storage
      .from("testeupload")
      .upload(`photos/${file.newFilename}`, file, {
        upsert: true,
        contentType: file.mimetype
      });

    const { data: publicURL } = supabase.storage
      .from("testeupload")
      .getPublicUrl(`photos/${file.newFilename}`);

    if (data) {
      success.push({
        _id: uuid(),
        url: publicURL,
        size: "original",
      });
    } else if (error) {
      errors.push(error);
    }
  });

  await Promise.all(promises);
  return Promise.resolve({
    data: success,
    errors,
  });
};

const post = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
  const form = new multiparty.Form();

  form.parse(req, async function (err, fields, { files }) {
    const { data, errors } = await saveFile(files);
    return data ? res.status(201).send(data) : res.status(400).send(errors);
  });
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      post(req, res);
      break;
    case "PUT":
    case "DELETE":
    case "PATCH":
    case "GET":
      res.status(405).send("method not allowed");
      break;
  }
}

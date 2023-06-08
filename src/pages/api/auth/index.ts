import uuid  from "uuid-random"
import * as crypto from "crypto";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = req.query.token ?? uuid()
  const expire = req.query.expire ?? parseInt(Date.now() / 1000) + 2400
  const privateAPIKey = process.env.IMGKIT_PK
  const signature = crypto
    .createHmac("sha1", privateAPIKey)
    .update(token + expire)
    .digest("hex")

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.status(200)
  res.send({
    token: token,
    expire: expire,
    signature: signature,
  })
}

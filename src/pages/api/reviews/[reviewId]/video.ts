// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import supabase from "../../../../utils/supabase-client"

type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "PATCH") {
    const { body, query } = req
    const { error } = await supabase
      .from("reviews")
      .update([
        {
          video_url: body,
        },
      ])
      .eq("id", query.reviewId)

    return error ? res.status(500).json(error) : res.status(204).send(null)
  } else {
    res.status(405).json({
      status: 405,
      error_code: 105,
      message: "Metodo não permitido",
      user_message: {
        en_us: "Method not allowed",
        pt_br: "Metodo não permitido",
      },
      more_info: null,
    })
  }
}

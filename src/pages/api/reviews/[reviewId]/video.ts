// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../../../utils/supabase-client";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "PATCH") {
    const token = req.headers["x-token"];
    const storeId = req.headers["x-store-id"];
    // verificar se token ta valido
    const { body, query } = req;
    // Process a POST request
    const { error } = await supabase.from("reviews").update([
      {
        video_url: body,
      },
    ]).eq("id", query.reviewId)

    return error ? res.status(500).json(error) : res.status(204).send();
  } else {
    // erro
    // Handle any other HTTP method
    res.status(405).json({
      status: 405,
      error_code: 105,
      message: "Metodo não permitido",
      user_message: {
        en_us: "Method not allowed",
        pt_br: "Metodo não permitido",
      },
      more_info: null,
    });
  }
}

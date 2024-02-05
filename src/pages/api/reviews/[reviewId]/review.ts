// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "./../../../../utils/supabase-client";
import { log } from "@logtail/next";
import { displayName } from "../../../../utils/display-name";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "PATCH") {
    const { body, query } = req;
    const payload = body
    if (payload.author) {
      payload.display_name = displayName(payload.author)
    }
    const { error } = await supabase
      .from("reviews")
      .update([body])
      .eq("id", query.reviewId);
    // res.setHeader('Content-Type', 'application/json')
    if (!error) {
      log.info("Avaliacao atualizada com sucesso!", { body, query });
      res.status(204).end()
    } else {
      log.error("Erro ao atualizar a avaliacao", { body, error, query });
      res.status(500).json(error)
    }
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
    });
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { log } from "@logtail/next";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.ALLOWED_ORIGINS ?? "*"
  );
  if (req.method === "PATCH") {
    const { body, query, headers } = req;

    const storeId = headers["x-store-id"];
    const token = headers["x-token"];

    const urlReviews = new URL(
      "/v1/reviews/" + query.reviewId,
      process.env.CORE_API
    );

    const options: any = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "X-Store-Id": storeId,
        "X-Token": token,
      },
      body: JSON.stringify({
        pictures: body,
      }),
    };

    try {
      const response = await fetch(urlReviews, options);
      if (response.ok) {
        log.info("Fotos adicionada com sucesso a avaliacao!");
        res.status(204).end();
      }
    } catch (error) {
      log.error("Erro ao adicionar as fotos na avaliacao");
      res.status(500).json(error);
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

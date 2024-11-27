import { log } from "@logtail/next";
import type { NextApiRequest, NextApiResponse } from "next";
import sinitizer from "string-sanitizer";
import { displayName } from "../../utils/display-name";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.ALLOWED_ORIGINS ?? "*"
  );

  if (req.method === "POST") {
    const storeId: any = req.headers["x-store-id"];
    const token = req.headers["x-token"];

    const { body } = req;
    const payload: any = {
      order_ref: body.order_ref,
      rating: body.rating,
      status: "under_analysis",
      customer: body.customer,
      is_recommended: body.is_recommended,
      product_id: body.product_id,
      product_sku: body.product_sku,
      notification_id: body.notification_id,
      verified_purchase: true,
    };

    const sanitizeProps = ["author", "title", "body"];
    sanitizeProps.forEach((prop) => {
      if (body[prop]) {
        payload[prop] = sinitizer.sanitize.keepUnicode(body[prop]);
      }
    });

    if (payload.author) {
      payload.display_name = displayName(payload.author);
    }

    const urlReviews = new URL("/v1/reviews", process.env.CORE_API);

    const options: any = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Store-Id": parseInt(storeId),
        "X-Token": token,
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(urlReviews, options);
      const data = await response.json();

      if (response.ok && response.status >= 200 && response.status <= 204) {
        log.info("Avaliaçao criada " + data.id);
        res.status(201).json(data);
      } else if (response.status >= 400) {
        res.status(500).json(data);
      }
    } catch (error) {
      log.error("Erro ao criar a avaliacao", { body, error, payload });
      res.status(500).json(error);
    }
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

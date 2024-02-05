import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../utils/supabase-client";
import sinitizer from "string-sanitizer";
import { log } from "@logtail/next";
import { displayName } from "../../utils/display-name";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const storeId = req.headers["x-store-id"];
    const { body } = req;
    const payload: any = {
      order_ref: body.order_ref,
      store_id: storeId,
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
      payload.display_name = displayName(payload.author)
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([payload])
      .select("id");

    if (data && data.length > 0) {
      log.info("Avaliação criada com sucesso!", { body, payload});
      const { error } = await supabase.rpc(
        "add_review_id_to_notification_body",
        {
          store: storeId,
          review: data[0].id,
          notification: body.notification_id,
        }
      );

      res.status(201).json(data[0]);
    } else if (error) {
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

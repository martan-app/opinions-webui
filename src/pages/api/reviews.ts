import type { NextApiRequest, NextApiResponse } from "next"
import supabase from "../../utils/supabase-client"
import sinitizer from "string-sanitizer"

type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const storeId = req.headers["x-store-id"]
    const { body } = req
    const payload = [
      {
        order_ref: body.order,
        store_id: storeId,
        rating: body.rating,
        status: "under_analysis",
        author: sinitizer.sanitize.keepUnicode(body.author),
        customer: body.customer.id,
        title: sinitizer.sanitize.keepUnicode(body.title),
        body: sinitizer.sanitize.keepUnicode(body.body),
        is_recommended: body.is_recommended,
        product_id: body.product,
        product_sku: body.sku,
        notification_id: body.notification_id,
      },
    ]

    const { data, error } = await supabase
      .from("reviews")
      .insert(payload)
      .select("id")

    if (data && data.length > 0) {
      const { error } = await supabase.rpc(
        "add_review_id_to_notification_body",
        {
          store: storeId,
          review: data[0].id,
          notification: body.notification_id,
        }
      )

      res.status(201).json(data[0])
    } else if (error) {
      res.status(500).json(error)
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
    })
  }
}

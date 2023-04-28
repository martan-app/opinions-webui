import { NextRequest } from "next/server"
import supabase from "../../utils/supabase-client"

type Data = any

export const config = {
  runtime: "edge",
}

export default async function handler(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const token = req.headers.get("x-token")
      const storeId = req.headers.get("x-store-id")
      // verificar se token ta valido
      const body = await req.json()
      // Process a POST request
      const payload = [
        {
          order_ref: body.order,
          store_id: storeId,
          rating: body.rating,
          status: "under_analysis",
          author: body.customer.name,
          customer: body.customer.id,
          title: body.title,
          body: body.body,
          is_recommended: body.is_recommended,
          product_id: body.product,
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

        return new Response(JSON.stringify(data[0]), {
          status: 201,
          headers: {
            "content-type": "application/json",
          },
        })
      } else if (error) {
        return new Response(JSON.stringify(error), {
          status: 500,
          headers: {
            "content-type": "application/json",
          },
        })
      }
    } catch (error) {
      return new Response(JSON.stringify(error), {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      })
    }
  } else {
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

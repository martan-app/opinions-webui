// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import supabase from "../../../../utils/supabase-client"
import { NextRequest } from "next/server"

export const config = {
  runtime: "edge",
}

export default async function handler(req: NextRequest) {
  if (req.method === "PATCH") {
    try {
      const token = req.headers.get("x-token")
      const storeId = req.headers.get("x-store-id")
      // verificar se token ta valido
      const body = await req.json()
      const { searchParams } = new URL(req.url)
      const reviewId = searchParams.get("reviewId")
      // Process a POST request
      const { error, status, statusText } = await supabase
        .from("reviews")
        .update([
          {
            video_url: body,
          },
        ])
        .eq("id", reviewId)

      if (status >= 400) {
        return new Response(JSON.stringify(error), {
          statusText,
          status,
          headers: {
            "content-type": "application/json",
          },
        })
      }

      return new Response(null, {
        statusText,
        status,
        headers: {
          "content-type": "application/json",
        },
      })

    } catch (error) {
      new Response(JSON.stringify(error), {
        status: 500,
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

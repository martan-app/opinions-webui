import { PostHog } from "posthog-node"

export default function PostHogClient() {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  })
}

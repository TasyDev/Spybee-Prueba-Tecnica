import { handle } from "hono/vercel"
import { getApp } from "@infrastructure/composition"

const handler = (req: Request) => {
  const app = getApp()
  return handle(app)(req)
}

export const GET = handler
export const POST = handler
export const PATCH = handler
export const DELETE = handler

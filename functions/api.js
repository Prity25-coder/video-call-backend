import serverless from "serverless-http"
import server from "../"

export const handler = serverless(server);
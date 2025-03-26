import serverless from "serverless-http";
import { server, io } from "../";

export const handler = serverless(server);
export const handler2 = serverless(io);

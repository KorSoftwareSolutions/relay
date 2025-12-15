import { relayServer } from "@/libs/relay-server";

export const GET = (request: Request) => {
  return relayServer.handler(request);
};

export const POST = (request: Request) => {
  return relayServer.handler(request);
};

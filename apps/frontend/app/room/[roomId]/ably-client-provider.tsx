"use client";

import * as Ably from "ably";

import { AblyProvider } from "ably/react";
import React from "react";
import { getClientId } from "@/lib/client-id-storage";

export default function AblyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const ablyClient = new Ably.Realtime.Promise({
    key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
    clientId: getClientId(),
  });

  return <AblyProvider client={ablyClient}>{children}</AblyProvider>;
}

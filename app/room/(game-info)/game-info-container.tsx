"use client";

import { Log } from "@/lib/dto/log";

const GameInfoLogBox = ({ logs }: { logs: Log[] }) => {
  return (
    <div className={"h-1/2 w-full overflow-y-scroll rounded-lg bg-gray-200"}>
      {logs &&
        logs.map(({ id, text }) => (
          <div key={id} className={"p-2"}>
            {text}
          </div>
        ))}
    </div>
  );
};

export const GameInfoContainer = ({ logs }: { logs: Log[] }) => {
  return (
    <div className={"col-span-2 m-6"}>
      <div className={"text-2xl font-semibold"}>{"경매 진행 정보"}</div>
      <GameInfoLogBox logs={logs} />
    </div>
  );
};

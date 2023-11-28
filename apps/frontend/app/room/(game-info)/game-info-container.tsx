"use client";

import { Log } from "lib/dto/log";

const GameController = () => {
  return <div className={"row-span-1 m-6"}>{"경매 버튼 들어갈 자리"}</div>;
};

const GameInfoLogBox = ({ logs }: { logs: Log[] }) => {
  return (
    <div
      className={
        "row-span-4 m-2 overflow-y-scroll rounded-lg border-2 border-gray-300"
      }
    >
      {logs &&
        logs.map(({ id, text }) => (
          <div key={id} className={"p-2 text-left text-sm font-semibold"}>
            {text}
          </div>
        ))}
    </div>
  );
};

export const GameInfoContainer = ({ logs }: { logs: Log[] }) => {
  return (
    <div className={"col-span-2 m-6 grid grid-rows-6 gap-2"}>
      <div className={"row-span-1 m-auto text-center text-2xl font-semibold"}>
        {"경매 기록"}
      </div>
      <GameInfoLogBox logs={logs} />
      <GameController />
    </div>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { nanoid } from "nanoid";
import { RefreshRoomsButton } from "@/app/lobby/refresh-rooms-button";
import { mockRooms, refreshMockRooms } from "lib/room-info.mock";
import { isRoomFull } from "lib/is-room-full";
import { MAX_PARTICIPANTS } from "lib/constants";

const getRooms = async () => {
  refreshMockRooms();
  return mockRooms;
};

const createNewRoomId = () => {
  return nanoid();
};

export default async function Home() {
  const rooms = await getRooms();

  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {"게임 목록"}
        </h2>
      </div>
      <div className="mt-8 h-4/5 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex h-full flex-col bg-white px-4 py-8 shadow dark:bg-gray-800 sm:rounded-lg sm:px-10">
          <RefreshRoomsButton />
          <div className="h-full flex-grow space-y-4 overflow-y-scroll">
            {rooms
              .filter((room) => !isRoomFull(room))
              .map((room) => (
                <Card key={room.id}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>{room.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text- text-base">
                      {room.players.length}/{MAX_PARTICIPANTS}
                    </span>
                    <LinkButton
                      href={"/room/" + room.id}
                      className="ml-auto"
                      variant="outline"
                    >
                      {"입장"}
                    </LinkButton>
                  </CardContent>
                </Card>
              ))}
          </div>
          <LinkButton
            href={"/room/" + createNewRoomId()}
            className="mt-4 w-full"
            variant={"outline"}
          >
            {"새 게임 생성"}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

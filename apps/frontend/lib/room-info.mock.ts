import { RoomInfo } from "@/lib/dto/room-info";
import { nanoid } from "nanoid";
import { fakerKO as faker } from "@faker-js/faker";

const _fakeUser = () => {
  return {
    id: nanoid(),
    name: faker.internet.userName(),
  };
};

const _fakerRoom = () => {
  // random number of players [1, 6]
  const numPlayers = Math.floor(Math.random() * 6) + 1;
  return {
    name: faker.lorem.words(),
    id: nanoid(),
    players: Array.from({ length: numPlayers }, _fakeUser),
  };
};

const MIN_ROOMS = 10;

const MAX_ROOMS = 20;

export const mockRooms: RoomInfo[] = Array.from(
  { length: Math.floor(Math.random() * (MAX_ROOMS - MIN_ROOMS)) + MIN_ROOMS },
  _fakerRoom
);

export const refreshMockRooms = () => {
  mockRooms.splice(0, mockRooms.length);
  mockRooms.push(
    ...Array.from(
      {
        length: Math.floor(Math.random() * (MAX_ROOMS - MIN_ROOMS)) + MIN_ROOMS,
      },
      _fakerRoom
    )
  );
};

export type RoomInfo = {
  name: string;
  id: string;
  players: Player[];
};

type Player = {
  id: string;
  name: string;
};

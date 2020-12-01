import IListenerDetail from "./IListenerDetail";

export default interface IStationDetail {
  id: number;
  name: string;
  ownerUsername: string;
  ownerId: number;
  description: string;
  private: boolean;
  numberOfListeners: number;
}

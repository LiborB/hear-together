export default interface IStationSimple {
    id: number;
    name: string;
    description: string;
    ownerUsername: string;
    ownerId: number;
    numberOfListeners: number;
}
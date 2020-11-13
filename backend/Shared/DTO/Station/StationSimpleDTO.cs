namespace Shared.DTO.Station
{
    public class StationSimpleDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string OwnerUsername { get; set; }
        public int OwnerId { get; set; }
        public int NumberOfListeners { get; set; }
    }
}
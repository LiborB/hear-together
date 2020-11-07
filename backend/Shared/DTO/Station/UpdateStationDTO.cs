namespace Shared.DTO.Station
{
    public class UpdateStationDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Private { get; set; }
    }
}
using System.Collections;
using System.Collections.Generic;

namespace Shared.DTO.Station
{
    public class StationDetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string OwnerUsername { get; set; }
        public int OwnerId { get; set; }
        public bool Private { get; set; }
        public int NumberOfListeners { get; set; }
    }
}
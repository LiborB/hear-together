﻿using System;
using System.Collections.Generic;
using DataAccess.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.DTO.Station;

namespace API.Controllers
{
    [Route("api/station")]
    public class StationController : BaseController
    {
        private readonly IStationService _stationService;
        public StationController(IStationService stationService, IUserService userService) : base(userService)
        {
            _stationService = stationService;
        }

        [Route("create")]
        [HttpPost]
        public ActionResult<int> CreateStation()
        {
            var user = HandleAuthGetUser();
            var stationId = _stationService.CreateStation(user.Id);
            return Ok(stationId);
        }

        [Route("update")]
        [HttpPost]
        public IActionResult UpdateStation([FromBody] UpdateStationDTO updateStation)
        {
            var user = HandleAuthGetUser();
            _stationService.UpdateStation(updateStation);
            return Ok();
        }

        [Route("details/{stationId}")]
        [HttpGet]
        public ActionResult<StationDetailDTO> GetStationDetail(int stationId)
        {
            var user = HandleAuthGetUser();
            var stationDetail = _stationService.GetStationDetail(stationId);
            return Ok(stationDetail);
        }

        [Route("getallstations")]
        [HttpGet]
        public ActionResult<List<StationSimpleDTO>> GetAllStations(int skip = 0, int take = 0)
        {
            var user = HandleAuthGetUser();
            var stations = _stationService.GetAllStations(skip, take);
            return Ok(stations);
        }
    }
}
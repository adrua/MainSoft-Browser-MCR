//McrcoAutomovilesController.cs
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using Microsoft.Extensions.Logging;

using MilesCarRental.Rentals.Interfaces.v1;
using MilesCarRental.Rentals.Models.v1;

namespace MilesCarRental.Rentals.Controllers.v1
{
    //[Authorize]
    public class McrcoAutomovilesController : ODataController
	{
        private readonly ILogger<McrcoAutomovilesController> logger;
        private readonly IMcrcoAutomovilesManager McrcoAutomovilesManager;

        public McrcoAutomovilesController(ILogger<McrcoAutomovilesController> logger,
                                    IMcrcoAutomovilesManager McrcoAutomovilesManager)
        {
            this.logger = logger;
            this.McrcoAutomovilesManager = McrcoAutomovilesManager;
        }

        [EnableQuery]
        public IActionResult Get(CancellationToken token)
        {
            logger.Log(LogLevel.Information, $"Inicio de consumo del API: {System.Reflection.MethodBase.GetCurrentMethod().Name}");
            return Ok(this.McrcoAutomovilesManager.GetAll());
        }

        [EnableQuery]
        public async Task<IActionResult> Post([FromBody] McrcoAutomoviles row, CancellationToken token)
        {
            try
            {
                var orgrow = await this.McrcoAutomovilesManager.AddAsync(row);
                if (orgrow == null)
                {
                    HttpContext.Response.StatusCode = StatusCodes.Status406NotAcceptable;
                    return BadRequest($"Llave primaria duplicada ({row.McrcoAutomovilesId})");
                }
                else
                {
                    await this.McrcoAutomovilesManager.SaveChangesAsync();
                    return Created(row);
                }
            }
            catch (Exception ex)
            {
                var errors = ex.Message + "\n" +String.Join("\n", ModelState.Root.Errors.Select((e) => e.Exception.Message));
                return BadRequest($"Código repetido en 'McrcoAutomoviles' o datos inválidos\n{errors}\n");
            }
        }

        [EnableQuery]
        public async Task<IActionResult> Patch([FromODataUri]int keyMcrcoAutomovilesId, Delta<McrcoAutomoviles> changes)
        {
            try
            {
                var row = this.McrcoAutomovilesManager.UpdateAsync(keyMcrcoAutomovilesId, changes);
                if (row == null)
                {
                    return BadRequest($"Error actualizando, Fila no existe.");
                }
                else
                {
                    await this.McrcoAutomovilesManager.SaveChangesAsync();
                    return Updated(row);
                }
            }
            catch (Exception)
            {
                var errors = String.Join("\n", ModelState.Root.Errors.Select((e) => e.Exception.Message));
                return BadRequest($"Código repetido en 'McrcoAutomoviles' o datos inválidos\n{errors}\n");
            }
        }

        [HttpDelete("OData/{version}/McrcoAutomoviles")]
        public async Task<IActionResult> Delete([FromQuery]int keyMcrcoAutomovilesId, [FromRoute]string version)
        {
            try
            {
                var row = await this.McrcoAutomovilesManager.DeleteAsync(keyMcrcoAutomovilesId);
                if (row == null)
                {
                    return BadRequest($"Error eliminando, Fila no existe.");
                }
                else
                {
                    await this.McrcoAutomovilesManager.SaveChangesAsync();
                    return Ok();
                }
            }
            catch (Exception)
            {
                return BadRequest($"Error eliminando en 'McrcoAutomoviles', el registro está en uso.");
            }
        }
    }
}

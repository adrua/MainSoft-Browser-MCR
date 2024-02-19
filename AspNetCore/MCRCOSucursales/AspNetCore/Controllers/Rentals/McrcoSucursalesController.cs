//McrcoSucursalesController.cs
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
    public class McrcoSucursalesController : ODataController
	{
        private readonly ILogger<McrcoSucursalesController> logger;
        private readonly IMcrcoSucursalesManager McrcoSucursalesManager;

        public McrcoSucursalesController(ILogger<McrcoSucursalesController> logger,
                                    IMcrcoSucursalesManager McrcoSucursalesManager)
        {
            this.logger = logger;
            this.McrcoSucursalesManager = McrcoSucursalesManager;
        }

        [EnableQuery]
        public IActionResult Get(CancellationToken token)
        {
            logger.Log(LogLevel.Information, $"Inicio de consumo del API: {System.Reflection.MethodBase.GetCurrentMethod().Name}");
            return Ok(this.McrcoSucursalesManager.GetAll());
        }

        [EnableQuery]
        public async Task<IActionResult> Post([FromBody] McrcoSucursales row, CancellationToken token)
        {
            try
            {
                var orgrow = await this.McrcoSucursalesManager.AddAsync(row);
                if (orgrow == null)
                {
                    HttpContext.Response.StatusCode = StatusCodes.Status406NotAcceptable;
                    return BadRequest($"Llave primaria duplicada ({row.McrcoSucursalesId})");
                }
                else
                {
                    await this.McrcoSucursalesManager.SaveChangesAsync();
                    return Created(row);
                }
            }
            catch (Exception ex)
            {
                var errors = ex.Message + "\n" +String.Join("\n", ModelState.Root.Errors.Select((e) => e.Exception.Message));
                return BadRequest($"Código repetido en 'McrcoSucursales' o datos inválidos\n{errors}\n");
            }
        }

        [EnableQuery]
        public async Task<IActionResult> Patch([FromODataUri]int keyMcrcoSucursalesId, Delta<McrcoSucursales> changes)
        {
            try
            {
                var row = this.McrcoSucursalesManager.UpdateAsync(keyMcrcoSucursalesId, changes);
                if (row == null)
                {
                    return BadRequest($"Error actualizando, Fila no existe.");
                }
                else
                {
                    await this.McrcoSucursalesManager.SaveChangesAsync();
                    return Updated(row);
                }
            }
            catch (Exception)
            {
                var errors = String.Join("\n", ModelState.Root.Errors.Select((e) => e.Exception.Message));
                return BadRequest($"Código repetido en 'McrcoSucursales' o datos inválidos\n{errors}\n");
            }
        }

        [HttpDelete("OData/{version}/McrcoSucursales")]
        public async Task<IActionResult> Delete([FromQuery]int keyMcrcoSucursalesId, [FromRoute]string version)
        {
            try
            {
                var row = await this.McrcoSucursalesManager.DeleteAsync(keyMcrcoSucursalesId);
                if (row == null)
                {
                    return BadRequest($"Error eliminando, Fila no existe.");
                }
                else
                {
                    await this.McrcoSucursalesManager.SaveChangesAsync();
                    return Ok();
                }
            }
            catch (Exception)
            {
                return BadRequest($"Error eliminando en 'McrcoSucursales', el registro está en uso.");
            }
        }
    }
}

//McrcoAutomovilesManager.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

using MilesCarRental.Rentals.Interfaces.v1;
using MilesCarRental.Models.v1;
using MilesCarRental.Rentals.Models.v1;

namespace MilesCarRental.Rentals.Managers.v1
{
    public class McrcoAutomovilesManager : IMcrcoAutomovilesManager
	{
        private readonly ILogger<McrcoAutomovilesManager> logger;
        private readonly McrcoAutomovilesContext context;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly int enterpriseId;
 		private readonly string userId;

        public McrcoAutomovilesManager(ILogger<McrcoAutomovilesManager> logger,
                                McrcoAutomovilesContext context,
                                IHttpContextAccessor httpContextAccessor)
        {
            this.logger = logger;
            this.context = context;
            this.httpContextAccessor = httpContextAccessor;
            //this.userId = ApplicationUserTokenHelper.GetIdFromAuthorization(httpContextAccessor.HttpContext.Request);
        }

        McrcoAutomovilesContext IMcrcoAutomovilesManager.Context { get { return context; } }
        
        IQueryable<McrcoAutomoviles> IMcrcoAutomovilesManager.GetAll()
        {
            // Obtenemos el nombre del método para logging
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            IQueryable<McrcoAutomoviles> result = null;

            try
            {
                // Loggeamos el inicio de la operación
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                // obtenemos los datos como IQueryable para optimizar oData
                result = context.McrcoAutomoviles;
                // retornamos la query
            }
            catch (Exception ex)
            {
                logger.Log(LogLevel.Error, $"Error en: {methodName}\n{ex.Message}\n{ex.StackTrace}");
            }
            finally
            {
                // Loggeamos el inicio de la operación
                logger.Log(LogLevel.Debug, $"Finalizada operación: {methodName}");
            }
            return result;
        }

        async Task<McrcoAutomoviles> IMcrcoAutomovilesManager.GetByIdAsync(int keyMcrcoAutomovilesId)
        {
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            McrcoAutomoviles result = null;

            try
            {
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                result = await context.McrcoAutomoviles.FindAsync(keyMcrcoAutomovilesId);
            }
            catch (Exception ex)
            {
                logger.Log(LogLevel.Error, $"Error en: {methodName}\n{ex.Message}\n{ex.StackTrace}");
            }
            finally
            {
                logger.Log(LogLevel.Debug, $"Finalizada operación: {methodName}");
            }
            return result;
        }

        async Task<McrcoAutomoviles> IMcrcoAutomovilesManager.AddAsync(McrcoAutomoviles row)
        {
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            McrcoAutomoviles result = null;

            try
            {
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                row.McrcoAutomovilesId = (context.McrcoAutomoviles.OrderByDescending((x) => x.McrcoAutomovilesId).FirstOrDefault()?.McrcoAutomovilesId ?? 0) + 1;

                if (result == null)
                {
                    result = row;

                    await context.McrcoAutomoviles.AddAsync(row);
                }
                else
                {
                    logger.Log(LogLevel.Error, $"Llave Duplicada: McrcoAutomoviles({row.McrcoAutomovilesId})");
                    return null;
                }
            }
            catch (Exception ex)
            {
                logger.Log(LogLevel.Error, $"Error en: {methodName}\n{ex.Message}\n{ex.StackTrace}");
            }
            finally
            {
                logger.Log(LogLevel.Debug, $"Finalizada operación: {methodName}");
            }
            return result;
        }

        async Task<McrcoAutomoviles> IMcrcoAutomovilesManager.UpdateAsync(int keyMcrcoAutomovilesId, Delta<McrcoAutomoviles> changes)
        {
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            McrcoAutomoviles result = null;

            try
            {
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                result = await context.McrcoAutomoviles.FindAsync(keyMcrcoAutomovilesId);

                if (result == null)
                {
                    logger.Log(LogLevel.Error, $"Llave no Existe: McrcoAutomoviles({keyMcrcoAutomovilesId})");
                    return null;
                }
                else
                {
                    changes.CopyChangedValues(result);
                }
            }
            catch (Exception ex)
            {
                logger.Log(LogLevel.Error, $"Error en: {methodName}\n{ex.Message}\n{ex.StackTrace}");
            }
            finally
            {
                logger.Log(LogLevel.Debug, $"Finalizada operación: {methodName}");
            }
            return result;
        }

        async Task<McrcoAutomoviles> IMcrcoAutomovilesManager.DeleteAsync(int keyMcrcoAutomovilesId)
        {
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            McrcoAutomoviles result = null;

            try
            {
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                result = await context.McrcoAutomoviles.FindAsync(keyMcrcoAutomovilesId);

                if (result == null)
                {
                    logger.Log(LogLevel.Error, $"Llave no Existe: McrcoAutomoviles({keyMcrcoAutomovilesId})");
                    return null;
                }
                else
                {
                    context.McrcoAutomoviles.Remove(result);
                }
            }
            catch (Exception ex)
            {
                logger.Log(LogLevel.Error, $"Error en: {methodName}\n{ex.Message}\n{ex.StackTrace}");
            }
            finally
            {
                logger.Log(LogLevel.Debug, $"Finalizada operación: {methodName}");
            }
            return result;
        }

        async Task<int> IMcrcoAutomovilesManager.SaveChangesAsync()
        {
            return await context.SaveChangesAsync(); 
        }
	}
}
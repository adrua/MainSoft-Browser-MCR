//McrcoSucursalesManager.cs
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
    public class McrcoSucursalesManager : IMcrcoSucursalesManager
	{
        private readonly ILogger<McrcoSucursalesManager> logger;
        private readonly McrcoSucursalesContext context;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly int enterpriseId;
 		private readonly string userId;

        public McrcoSucursalesManager(ILogger<McrcoSucursalesManager> logger,
                                McrcoSucursalesContext context,
                                IHttpContextAccessor httpContextAccessor)
        {
            this.logger = logger;
            this.context = context;
            this.httpContextAccessor = httpContextAccessor;
            //this.userId = ApplicationUserTokenHelper.GetIdFromAuthorization(httpContextAccessor.HttpContext.Request);
        }

        McrcoSucursalesContext IMcrcoSucursalesManager.Context { get { return context; } }
        
        IQueryable<McrcoSucursales> IMcrcoSucursalesManager.GetAll()
        {
            // Obtenemos el nombre del método para logging
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            IQueryable<McrcoSucursales> result = null;

            try
            {
                // Loggeamos el inicio de la operación
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                // obtenemos los datos como IQueryable para optimizar oData
                result = context.McrcoSucursales;
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

        async Task<McrcoSucursales> IMcrcoSucursalesManager.GetByIdAsync(int keyMcrcoSucursalesId)
        {
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            McrcoSucursales result = null;

            try
            {
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                result = await context.McrcoSucursales.FindAsync(keyMcrcoSucursalesId);
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

        async Task<McrcoSucursales> IMcrcoSucursalesManager.AddAsync(McrcoSucursales row)
        {
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            McrcoSucursales result = null;

            try
            {
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                row.McrcoSucursalesId = (context.McrcoSucursales.OrderByDescending((x) => x.McrcoSucursalesId).FirstOrDefault()?.McrcoSucursalesId ?? 0) + 1;

                if (result == null)
                {
                    result = row;

                    await context.McrcoSucursales.AddAsync(row);
                }
                else
                {
                    logger.Log(LogLevel.Error, $"Llave Duplicada: McrcoSucursales({row.McrcoSucursalesId})");
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

        async Task<McrcoSucursales> IMcrcoSucursalesManager.UpdateAsync(int keyMcrcoSucursalesId, Delta<McrcoSucursales> changes)
        {
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            McrcoSucursales result = null;

            try
            {
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                result = await context.McrcoSucursales.FindAsync(keyMcrcoSucursalesId);

                if (result == null)
                {
                    logger.Log(LogLevel.Error, $"Llave no Existe: McrcoSucursales({keyMcrcoSucursalesId})");
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

        async Task<McrcoSucursales> IMcrcoSucursalesManager.DeleteAsync(int keyMcrcoSucursalesId)
        {
            var methodName = System.Reflection.MethodBase.GetCurrentMethod().Name;

            McrcoSucursales result = null;

            try
            {
                logger.Log(LogLevel.Debug, $"Iniciando operación: {methodName}");
                result = await context.McrcoSucursales.FindAsync(keyMcrcoSucursalesId);

                if (result == null)
                {
                    logger.Log(LogLevel.Error, $"Llave no Existe: McrcoSucursales({keyMcrcoSucursalesId})");
                    return null;
                }
                else
                {
                    context.McrcoSucursales.Remove(result);
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

        async Task<int> IMcrcoSucursalesManager.SaveChangesAsync()
        {
            return await context.SaveChangesAsync(); 
        }
	}
}
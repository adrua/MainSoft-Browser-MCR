//IMcrcoSucursalesManager.cs
using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.Mvc;

using MilesCarRental.Models.v1;
using MilesCarRental.Rentals.Models.v1;

namespace MilesCarRental.Rentals.Interfaces.v1
{
    public interface IMcrcoSucursalesManager
	{
        McrcoSucursalesContext Context { get; } 
        IQueryable<McrcoSucursales> GetAll();
        Task<McrcoSucursales> GetByIdAsync(int keyMcrcoSucursalesId);
        Task<McrcoSucursales> AddAsync(McrcoSucursales row);
        Task<McrcoSucursales> UpdateAsync(int keyMcrcoSucursalesId, Delta<McrcoSucursales> changes);
        Task<McrcoSucursales> DeleteAsync(int keyMcrcoSucursalesId);

        Task<int> SaveChangesAsync();
    }
}

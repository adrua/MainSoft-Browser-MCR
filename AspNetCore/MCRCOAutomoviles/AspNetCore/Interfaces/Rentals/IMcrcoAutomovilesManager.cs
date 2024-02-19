//IMcrcoAutomovilesManager.cs
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
    public interface IMcrcoAutomovilesManager
	{
        McrcoAutomovilesContext Context { get; } 
        IQueryable<McrcoAutomoviles> GetAll();
        Task<McrcoAutomoviles> GetByIdAsync(int keyMcrcoAutomovilesId);
        Task<McrcoAutomoviles> AddAsync(McrcoAutomoviles row);
        Task<McrcoAutomoviles> UpdateAsync(int keyMcrcoAutomovilesId, Delta<McrcoAutomoviles> changes);
        Task<McrcoAutomoviles> DeleteAsync(int keyMcrcoAutomovilesId);

        Task<int> SaveChangesAsync();
    }
}

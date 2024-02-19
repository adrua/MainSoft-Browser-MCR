//McrcoAutomovilesModel.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.OData.ModelBuilder;
using Microsoft.EntityFrameworkCore;

namespace MilesCarRental.Rentals.Models.v1
{
    [Table("Automoviles", Schema = "MCRCO")]
    public class McrcoAutomoviles : IDisposable
	{
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int McrcoAutomovilesId {get; set;}

        //[Column(TypeName = "Date")]
        public DateTime McrcoAutomovilesFechaIngreso {get; set;}

        [MaxLength(50)]
        public string McrcoAutomovilesMarca {get; set;}

        [MaxLength(8)]
        public string McrcoAutomovilesModelo {get; set;}

        public int McrcoAutomovilesAno {get; set;}

        [MaxLength(20)]
        public string McrcoAutomovilesClase {get; set;}

        public int McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar {get; set;}

        public int McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega {get; set;}

        public Enum_MCRCOAutomovilesEstado McrcoAutomovilesEstado {get; set;}

        public McrcoSucursales McrcoSucursalesReclamar { get; set; }

        public McrcoSucursales McrcoSucursalesEntrega { get; set; }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        private bool disposed = false;
        
        protected virtual void Dispose(bool disposing)
        {
            if(!this.disposed)
            {
                disposed = true;
            }
        }
	}

    #region Enums
    public enum Enum_MCRCOAutomovilesEstado : int
    {
        Disponible = 1,
        Mantenimiento = 2,
        Fuera_de_servicio = 3
    }
    #endregion


    /// <summary>
    /// Extensión para registrar mapping con el Entity Framework y oData
    /// </summary>
	public static class McrcoAutomovilesExtension
	{
        #region EF Mapping
        public static ModelBuilder McrcoAutomovilesMapping(this ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<McrcoAutomoviles>();

            //PrimaryKey
            entity.HasKey(c => new { c.McrcoAutomovilesId });

           //Relationships
            entity.HasOne(typeof(McrcoSucursales), "McrcoSucursalesReclamar")
                .WithMany()
                .HasForeignKey("McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar")
                .OnDelete(DeleteBehavior.Restrict); // no ON DELETE

            entity.HasOne(typeof(McrcoSucursales), "McrcoSucursalesEntrega")
                .WithMany()
                .HasForeignKey("McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega")
                .OnDelete(DeleteBehavior.Restrict); // no ON DELETE


			return modelBuilder;
		}

        /// <summary>
        /// Mapping con el oData Framework
        /// </summary>
        /// <param name="oDataModelBuilder"></param>
        public static void McrcoAutomovilesMapping(this ODataConventionModelBuilder oDataModelBuilder)
        {
            var entityConfig = oDataModelBuilder.EntitySet<McrcoAutomoviles>(nameof(McrcoAutomoviles));

            var entity = entityConfig.EntityType;

            // PrimaryKey
            entity.HasKey(c => new { c.McrcoAutomovilesId });



            //Ignored properties for oData
            // entityConfig.EntityType.Ignore(x => x.Summary);
        }
        #endregion
    }
}

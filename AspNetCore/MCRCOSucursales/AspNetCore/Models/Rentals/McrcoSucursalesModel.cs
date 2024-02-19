//McrcoSucursalesModel.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.OData.ModelBuilder;
using Microsoft.EntityFrameworkCore;
using Cxc.TablasBasicas.Models.v1;

namespace MilesCarRental.Rentals.Models.v1
{
    [Table("Sucursales", Schema = "MCRCO")]
    public class McrcoSucursales : IDisposable
	{
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int McrcoSucursalesId {get; set;}

        //[Column(TypeName = "Date")]
        public DateTime McrcoSucursalesFechaInicio {get; set;}

        [MaxLength(105)]
        public string McrcoSucursalesDescripcion {get; set;}

        [MaxLength(250)]
        public string McrcoSucursalesDireccion {get; set;}

        public int CiudadDepartamentoId {get; set;}

        public int Ciudadid {get; set;}

        [NotMapped]
        public string CntCiudadesComp
        {
        	get { return $"{CiudadDepartamentoId}/{Ciudadid}"; }
        	private set {}
        }
        [Column(TypeName = "decimal(9, 6)")]
        public decimal McrcoSucursalesLongitud {get; set;}

        [Column(TypeName = "decimal(8, 5)")]
        public decimal McrcoSucursalesLatitud {get; set;}

        public Enum_MCRCOSucursalesEstado McrcoSucursalesEstado {get; set;}

        public CntCiudades CntCiudades { get; set; }

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
    public enum Enum_MCRCOSucursalesEstado : int
    {
        Activo = 1,
        En_Mantenimiento = 2,
        Cerrado = 3
    }
    #endregion


    /// <summary>
    /// Extensión para registrar mapping con el Entity Framework y oData
    /// </summary>
	public static class McrcoSucursalesExtension
	{
        #region EF Mapping
        public static ModelBuilder McrcoSucursalesMapping(this ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<McrcoSucursales>();

            //PrimaryKey
            entity.HasKey(c => new { c.McrcoSucursalesId });

           //Relationships
            entity.HasOne(typeof(CntCiudades), "CntCiudades")
                .WithMany()
                .HasForeignKey("CiudadDepartamentoId", "Ciudadid")
                .OnDelete(DeleteBehavior.Restrict); // no ON DELETE


			return modelBuilder;
		}

        /// <summary>
        /// Mapping con el oData Framework
        /// </summary>
        /// <param name="oDataModelBuilder"></param>
        public static void McrcoSucursalesMapping(this ODataConventionModelBuilder oDataModelBuilder)
        {
            var entityConfig = oDataModelBuilder.EntitySet<McrcoSucursales>(nameof(McrcoSucursales));

            var entity = entityConfig.EntityType;

            // PrimaryKey
            entity.HasKey(c => new { c.McrcoSucursalesId });



            //Ignored properties for oData
            // entityConfig.EntityType.Ignore(x => x.Summary);
        }
        #endregion
    }
}

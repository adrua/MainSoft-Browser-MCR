//<#@ assembly name="appData/Arkeos/MCRCOSucursales.dll" #>
//<#@ assembly name="appData/Arkeos/CNTCiudades.dll" #>

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Data.Common;
using System.Linq;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations.Design;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OData.ModelBuilder;

using MilesCarRental.Models.v1;

#if testing        
using MilesCarRental.Rentals.Models.v1;
using MilesCarRental.Rentals.Models.v1;
using static MilesCarRental.Rentals.Models.v1.McrcoSucursalesExtension;
using Cxc.TablasBasicas.Models.v1;
using static Cxc.TablasBasicas.Models.v1.CntCiudadesExtension;
#endif

namespace MilesCarRental.Models.v1
{
    public class McrcoAutomovilesContext
                    : DbContext
    {
        public DbSet<McrcoAutomoviles> McrcoAutomoviles { get; set; }

        // Foreign Keys Tables
        // Use only for ArkeosFactory Test. Please remove on Application
#if testing        
        public DbSet<McrcoSucursales> McrcoSucursales { get; set; }
        public DbSet<CntCiudades> CntCiudades { get; set; }
#endif

        private readonly IConfiguration Configuration;
        public readonly bool Production; 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.McrcoAutomovilesMapping();

            // Use only for ArkeosFactory Test. Please remove on Application
            // Foreign Keys Tables
#if testing            
            modelBuilder.McrcoSucursalesMapping();
            modelBuilder.CntCiudadesMapping();
#endif
        }

        public static bool MigrationsExecuted = false; 

        // Use only for ArkeosFactory Test. Please remove on Application
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            base.OnConfiguring(options);
            lock(this)
            {
                if(Production)
                {
                    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                }
                else
                {
                    options.UseInMemoryDatabase("MCRCOAutomovilesDb");
                }
            }
        }

        public void Migrations()
        {
            try
            {
                if (!MigrationsExecuted)
                {
                    if(Production)
                    {
                        var databaseCreator = this.GetService<IRelationalDatabaseCreator>();
                        databaseCreator.CreateTables();
                    }
                    else 
                    {
                        MigrationsExecuted = this.Database.EnsureCreated();
                        if(!MigrationsExecuted)
                        {
                            this.Database.EnsureDeleted();
                            MigrationsExecuted = this.Database.EnsureCreated();
                        }
                    }			  
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
            }
        }

        // Use only for ArkeosFactory Test. Please remove on Application
#if testing || stage   
        public McrcoAutomovilesContext(DbContextOptions<McrcoAutomovilesContext> options, IConfiguration configuration, bool production) : base(options)
        {
            Configuration = configuration;
            Production = production;
        }

        // Use only for Application, Not use in plugin-mode
#else
        public McrcoAutomovilesContext(DbContextOptions<McrcoAutomovilesContext> options, IConfiguration configuration) : base(options)
        {
            Configuration = configuration;
        }
#endif

#if testing   
        #region Initialize database
        public static void Initialize(McrcoAutomovilesContext context)
        {
            if (context.McrcoAutomoviles.Any())
            {
                return;   // DB has been seeded
            }
            context.McrcoAutomoviles.AddRange(McrcoAutomovilesContextExtension.rowsBaseMcrcoAutomoviles);
            context.SaveChanges();  

            context.SaveChanges();  

            context.SaveChanges();  

            context.McrcoSucursales.AddRange(MilesCarRental.Models.v1.McrcoSucursalesContextExtension.rowsBaseMcrcoSucursales);
            context.SaveChanges();

            context.CntCiudades.AddRange(Cxc.Models.v1.CntCiudadesContextExtension.rowsBaseCntCiudades);
            context.SaveChanges();
        }
        #endregion
    }

    // Foreign Keys Tables
    // Use only for ArkeosFactory Test. Please remove on Application
    /// <summary>
    /// Extensión para registrar mapping con el Entity Framework y oData
    /// </summary>
	public static class McrcoAutomovilesContextExtension
	{	        

        /// <summary>
        /// Mapping con el oData Framework
        /// </summary>
        /// <param name="oDataModelBuilder"></param>
        public static void MilesCarRentalRentalsFakeMapping(this ODataConventionModelBuilder oDataModelBuilder)
        {
            oDataModelBuilder.McrcoSucursalesMapping();
            oDataModelBuilder.CntCiudadesMapping();
        }

        public static McrcoAutomoviles[] rowsBaseMcrcoAutomoviles = new McrcoAutomoviles[] 
        {
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 1234,
                McrcoAutomovilesFechaIngreso = new DateTime(2011, 12, 12, 12, 0, 0),
                McrcoAutomovilesMarca = "Tesla",
                McrcoAutomovilesModelo = "Toadster",
                McrcoAutomovilesAno = 2023,
                McrcoAutomovilesClase = "Electrico",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 1,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 1,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 2,
                McrcoAutomovilesFechaIngreso = new DateTime(2018, 10, 8, 12, 1, 0),
                McrcoAutomovilesMarca = "aliquet ultrices erat tortor sollicitudin mi sit a",
                McrcoAutomovilesModelo = "molestie",
                McrcoAutomovilesAno = 29,
                McrcoAutomovilesClase = "a libero nam dui pro",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 2,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 2,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 3,
                McrcoAutomovilesFechaIngreso = new DateTime(2015, 8, 30, 12, 1, 0),
                McrcoAutomovilesMarca = "sit amet turpis elementum ligula vehicula consequa",
                McrcoAutomovilesModelo = "ultrices",
                McrcoAutomovilesAno = 92,
                McrcoAutomovilesClase = "quam nec dui luctus ",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 3,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 3,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 4,
                McrcoAutomovilesFechaIngreso = new DateTime(2022, 9, 20, 12, 1, 0),
                McrcoAutomovilesMarca = "eu mi nulla ac enim in tempor turpis nec euismod",
                McrcoAutomovilesModelo = "non quam",
                McrcoAutomovilesAno = 16,
                McrcoAutomovilesClase = "mauris sit amet eros",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 4,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 4,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 5,
                McrcoAutomovilesFechaIngreso = new DateTime(2010, 12, 25, 12, 1, 0),
                McrcoAutomovilesMarca = "curabitur gravida nisi at nibh in hac habitasse pl",
                McrcoAutomovilesModelo = "eget vul",
                McrcoAutomovilesAno = 91,
                McrcoAutomovilesClase = "pellentesque at null",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 5,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 5,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 6,
                McrcoAutomovilesFechaIngreso = new DateTime(2011, 7, 23, 12, 1, 0),
                McrcoAutomovilesMarca = "nunc nisl duis bibendum felis sed interdum venenat",
                McrcoAutomovilesModelo = "adipisci",
                McrcoAutomovilesAno = 46,
                McrcoAutomovilesClase = "in purus eu magna vu",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 6,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 6,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 7,
                McrcoAutomovilesFechaIngreso = new DateTime(2013, 11, 29, 12, 1, 0),
                McrcoAutomovilesMarca = "consequat nulla nisl nunc nisl duis bibendum felis",
                McrcoAutomovilesModelo = "facilisi",
                McrcoAutomovilesAno = 46,
                McrcoAutomovilesClase = "tempus vel pede morb",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 7,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 7,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 8,
                McrcoAutomovilesFechaIngreso = new DateTime(2021, 3, 27, 12, 1, 0),
                McrcoAutomovilesMarca = "tincidunt eu felis fusce posuere felis sed lacus m",
                McrcoAutomovilesModelo = "vel accu",
                McrcoAutomovilesAno = 96,
                McrcoAutomovilesClase = "nulla integer pede j",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 8,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 8,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 9,
                McrcoAutomovilesFechaIngreso = new DateTime(2016, 9, 28, 12, 1, 0),
                McrcoAutomovilesMarca = "lacus at turpis donec posuere metus vitae ipsum al",
                McrcoAutomovilesModelo = "pede jus",
                McrcoAutomovilesAno = 48,
                McrcoAutomovilesClase = "donec semper sapien ",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 9,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 9,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 10,
                McrcoAutomovilesFechaIngreso = new DateTime(2016, 7, 16, 12, 1, 0),
                McrcoAutomovilesMarca = "amet nulla quisque arcu libero rutrum ac lobortis ",
                McrcoAutomovilesModelo = "orci luc",
                McrcoAutomovilesAno = 71,
                McrcoAutomovilesClase = "augue aliquam erat v",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 10,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 10,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 11,
                McrcoAutomovilesFechaIngreso = new DateTime(2017, 11, 16, 12, 1, 0),
                McrcoAutomovilesMarca = "convallis tortor risus dapibus augue vel accumsan ",
                McrcoAutomovilesModelo = "sed nisl",
                McrcoAutomovilesAno = 18,
                McrcoAutomovilesClase = "felis donec semper s",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 11,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 11,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 12,
                McrcoAutomovilesFechaIngreso = new DateTime(2020, 6, 18, 12, 1, 0),
                McrcoAutomovilesMarca = "nec nisi volutpat eleifend donec ut dolor morbi ve",
                McrcoAutomovilesModelo = "pellente",
                McrcoAutomovilesAno = 38,
                McrcoAutomovilesClase = "ligula suspendisse o",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 12,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 12,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 13,
                McrcoAutomovilesFechaIngreso = new DateTime(2012, 8, 28, 12, 1, 0),
                McrcoAutomovilesMarca = "leo pellentesque ultrices mattis odio donec vitae ",
                McrcoAutomovilesModelo = "integer ",
                McrcoAutomovilesAno = 96,
                McrcoAutomovilesClase = "sociis natoque penat",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 13,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 13,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 14,
                McrcoAutomovilesFechaIngreso = new DateTime(2018, 2, 16, 12, 1, 0),
                McrcoAutomovilesMarca = "nam dui proin leo odio porttitor id consequat in c",
                McrcoAutomovilesModelo = "vitae co",
                McrcoAutomovilesAno = 75,
                McrcoAutomovilesClase = "amet diam in magna b",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 14,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 14,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            },
            new McrcoAutomoviles()
            {
                McrcoAutomovilesId = 15,
                McrcoAutomovilesFechaIngreso = new DateTime(2015, 2, 23, 12, 1, 0),
                McrcoAutomovilesMarca = "mattis pulvinar nulla pede ullamcorper augue a sus",
                McrcoAutomovilesModelo = "a ipsum ",
                McrcoAutomovilesAno = 97,
                McrcoAutomovilesClase = "aenean sit amet just",
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = 15,
                McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = 15,
                McrcoAutomovilesEstado = Enum_MCRCOAutomovilesEstado.Disponible
            }
        };
    }
#endif    
}

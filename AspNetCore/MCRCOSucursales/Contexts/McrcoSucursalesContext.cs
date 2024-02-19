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
using Cxc.TablasBasicas.Models.v1;
using static Cxc.TablasBasicas.Models.v1.CntCiudadesExtension;
#endif

namespace MilesCarRental.Models.v1
{
    public class McrcoSucursalesContext
                    : DbContext
    {
        public DbSet<McrcoSucursales> McrcoSucursales { get; set; }

        // Foreign Keys Tables
        // Use only for ArkeosFactory Test. Please remove on Application
#if testing        
        public DbSet<CntCiudades> CntCiudades { get; set; }
#endif

        private readonly IConfiguration Configuration;
        public readonly bool Production; 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.McrcoSucursalesMapping();

            // Use only for ArkeosFactory Test. Please remove on Application
            // Foreign Keys Tables
#if testing            
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
                    options.UseInMemoryDatabase("MCRCOSucursalesDb");
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
        public McrcoSucursalesContext(DbContextOptions<McrcoSucursalesContext> options, IConfiguration configuration, bool production) : base(options)
        {
            Configuration = configuration;
            Production = production;
        }

        // Use only for Application, Not use in plugin-mode
#else
        public McrcoSucursalesContext(DbContextOptions<McrcoSucursalesContext> options, IConfiguration configuration) : base(options)
        {
            Configuration = configuration;
        }
#endif

#if testing   
        #region Initialize database
        public static void Initialize(McrcoSucursalesContext context)
        {
            if (context.McrcoSucursales.Any())
            {
                return;   // DB has been seeded
            }
            context.McrcoSucursales.AddRange(McrcoSucursalesContextExtension.rowsBaseMcrcoSucursales);
            context.SaveChanges();  

            context.SaveChanges();  

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
	public static class McrcoSucursalesContextExtension
	{	        

        /// <summary>
        /// Mapping con el oData Framework
        /// </summary>
        /// <param name="oDataModelBuilder"></param>
        public static void MilesCarRentalRentalsFakeMapping(this ODataConventionModelBuilder oDataModelBuilder)
        {
            oDataModelBuilder.CntCiudadesMapping();
        }

        public static McrcoSucursales[] rowsBaseMcrcoSucursales = new McrcoSucursales[] 
        {
            new McrcoSucursales()
            {
                McrcoSucursalesId = 1234,
                McrcoSucursalesFechaInicio = new DateTime(2011, 12, 12, 12, 0, 0),
                McrcoSucursalesDescripcion = "Barranquilla - Centro ",
                McrcoSucursalesDireccion = "Calle 44  # 23-50",
                CiudadDepartamentoId = 1,
                Ciudadid = 1,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 10.960379m,
                McrcoSucursalesLatitud = 74.79446m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 2,
                McrcoSucursalesFechaInicio = new DateTime(2014, 10, 12, 12, 1, 0),
                McrcoSucursalesDescripcion = "eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit",
                McrcoSucursalesDireccion = "38 Arkansas Lane",
                CiudadDepartamentoId = 2,
                Ciudadid = 2,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 9.268091m,
                McrcoSucursalesLatitud = 62.47338m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 3,
                McrcoSucursalesFechaInicio = new DateTime(2019, 5, 13, 12, 1, 0),
                McrcoSucursalesDescripcion = "rhoncus sed vestibulum sit amet cursus id turpis integer aliquet massa",
                McrcoSucursalesDireccion = "889 Farragut Park",
                CiudadDepartamentoId = 3,
                Ciudadid = 3,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 10.224338m,
                McrcoSucursalesLatitud = 64.20258m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 4,
                McrcoSucursalesFechaInicio = new DateTime(2023, 12, 11, 12, 1, 0),
                McrcoSucursalesDescripcion = "vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem pra",
                McrcoSucursalesDireccion = "53 Lindbergh Drive",
                CiudadDepartamentoId = 4,
                Ciudadid = 4,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 9.830837m,
                McrcoSucursalesLatitud = 69.88086m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 5,
                McrcoSucursalesFechaInicio = new DateTime(2018, 7, 6, 12, 1, 0),
                McrcoSucursalesDescripcion = "ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae",
                McrcoSucursalesDireccion = "04 Bay Avenue",
                CiudadDepartamentoId = 5,
                Ciudadid = 5,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 10.650866m,
                McrcoSucursalesLatitud = 62.92935m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 6,
                McrcoSucursalesFechaInicio = new DateTime(2010, 1, 10, 12, 1, 0),
                McrcoSucursalesDescripcion = "nunc nisl duis bibendum felis sed interdum venenatis turpis enim bland",
                McrcoSucursalesDireccion = "08203 Harbort Trail",
                CiudadDepartamentoId = 6,
                Ciudadid = 6,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 10.615324m,
                McrcoSucursalesLatitud = 70.69226m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 7,
                McrcoSucursalesFechaInicio = new DateTime(2011, 12, 3, 12, 1, 0),
                McrcoSucursalesDescripcion = "ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia ",
                McrcoSucursalesDireccion = "54 Glendale Way",
                CiudadDepartamentoId = 7,
                Ciudadid = 7,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 10.87841m,
                McrcoSucursalesLatitud = 70.05828m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 8,
                McrcoSucursalesFechaInicio = new DateTime(2020, 7, 26, 12, 1, 0),
                McrcoSucursalesDescripcion = "turpis a pede posuere nonummy integer non velit donec diam neque vesti",
                McrcoSucursalesDireccion = "036 Oakridge Junction",
                CiudadDepartamentoId = 8,
                Ciudadid = 8,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 9.995923m,
                McrcoSucursalesLatitud = 65.80364m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 9,
                McrcoSucursalesFechaInicio = new DateTime(2015, 5, 7, 12, 1, 0),
                McrcoSucursalesDescripcion = "posuere metus vitae ipsum aliquam non mauris morbi non lectus aliquam ",
                McrcoSucursalesDireccion = "4533 Schiller Trail",
                CiudadDepartamentoId = 9,
                Ciudadid = 9,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 9.777615m,
                McrcoSucursalesLatitud = 65.91803m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 10,
                McrcoSucursalesFechaInicio = new DateTime(2023, 7, 15, 12, 1, 0),
                McrcoSucursalesDescripcion = "nunc vestibulum ante ipsum primis in faucibus orci luctus et ultrices ",
                McrcoSucursalesDireccion = "8 American Road",
                CiudadDepartamentoId = 10,
                Ciudadid = 10,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 9.29823m,
                McrcoSucursalesLatitud = 63.59849m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 11,
                McrcoSucursalesFechaInicio = new DateTime(2023, 10, 8, 12, 1, 0),
                McrcoSucursalesDescripcion = "rutrum rutrum neque aenean auctor gravida sem praesent id massa id nis",
                McrcoSucursalesDireccion = "53 Mcguire Lane",
                CiudadDepartamentoId = 11,
                Ciudadid = 11,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 9.072475m,
                McrcoSucursalesLatitud = 70.57879m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 12,
                McrcoSucursalesFechaInicio = new DateTime(2019, 10, 12, 12, 1, 0),
                McrcoSucursalesDescripcion = "purus sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibu",
                McrcoSucursalesDireccion = "64254 Cardinal Drive",
                CiudadDepartamentoId = 12,
                Ciudadid = 12,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 10.933122m,
                McrcoSucursalesLatitud = 74.53392m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 13,
                McrcoSucursalesFechaInicio = new DateTime(2014, 12, 9, 12, 1, 0),
                McrcoSucursalesDescripcion = "aliquam convallis nunc proin at turpis a pede posuere nonummy integer ",
                McrcoSucursalesDireccion = "67 Sullivan Terrace",
                CiudadDepartamentoId = 13,
                Ciudadid = 13,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 9.238176m,
                McrcoSucursalesLatitud = 63.95354m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 14,
                McrcoSucursalesFechaInicio = new DateTime(2022, 7, 17, 12, 1, 0),
                McrcoSucursalesDescripcion = "vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id m",
                McrcoSucursalesDireccion = "371 Oak Valley Court",
                CiudadDepartamentoId = 14,
                Ciudadid = 14,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 8.837534m,
                McrcoSucursalesLatitud = 65.02759m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            },
            new McrcoSucursales()
            {
                McrcoSucursalesId = 15,
                McrcoSucursalesFechaInicio = new DateTime(2019, 4, 12, 12, 1, 0),
                McrcoSucursalesDescripcion = "praesent blandit lacinia erat vestibulum sed magna at nunc commodo pla",
                McrcoSucursalesDireccion = "5163 Mifflin Point",
                CiudadDepartamentoId = 15,
                Ciudadid = 15,
                //CntCiudadesComp = convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
                McrcoSucursalesLongitud = 10.932252m,
                McrcoSucursalesLatitud = 71.95255m,
                McrcoSucursalesEstado = Enum_MCRCOSucursalesEstado.Activo
            }
        };
    }
#endif    
}

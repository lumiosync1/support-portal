
using Lumio.Balance;
using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Lumio.Domain.Utils;
using Lumio.DomainServices;
using Lumio.SupportPortal.Services.Auth;
using Lumio.SupportPortal.Services.Seller;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.ModelBuilder;
using System.Reflection;
using System.Text;

namespace SupportPortalBackend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<MainDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            JwtConfiguration jwtConfiguration = builder.Configuration.GetSection("JwtConfiguration").Get<JwtConfiguration>();
            builder.Services.AddTransient<JwtConfiguration>(s => jwtConfiguration);

            Assembly serviceAssembly = Assembly.GetAssembly(typeof(AuthService));
            RegisterServices(builder.Services, serviceAssembly);

            // configure authentication
            var key = Encoding.ASCII.GetBytes(jwtConfiguration.Secret);
            builder.Services.AddAuthentication("Bearer")
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(key);
                    //options.TokenValidationParameters.ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256Signature };
                    options.TokenValidationParameters.ValidAudiences = jwtConfiguration.ValidAudiences;
                    options.TokenValidationParameters.ValidIssuers = jwtConfiguration.ValidIssuers;
                    options.TokenValidationParameters.ValidateIssuerSigningKey = true;
                });
            builder.Services.AddAuthorization();


            var modelBuilder = SetupOdata(builder.Services, serviceAssembly);
            builder.Services.AddControllers(config =>
            {
                config.Filters.Add(typeof(Attributes.CurrentUserFilterAttribute));
            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
            })
            .AddOData(options => options.Select().Filter().OrderBy().Expand().Count().SetMaxTop(null)
                .AddRouteComponents("odata", modelBuilder.GetEdmModel())
            );
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseCors(policy =>
            {
                policy.WithOrigins("*")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }

        private static void RegisterServices(IServiceCollection services, Assembly serviceAssembly)
        {
            var types = serviceAssembly.GetTypes();
            var serviceTypes = types.Where(t => t.Name.EndsWith("Service")
                && !t.IsInterface // not interfaces
                ).ToList();
            foreach (var type in serviceTypes)
            {
                services.AddScoped(type.GetInterfaces()[0], type);
            }

            services.AddScoped<BalanceManager>();

            services.AddScoped<OrderManager>();
        }

        private static ODataConventionModelBuilder SetupOdata(IServiceCollection services, Assembly assembly)
        {
            var modelBuilder = new ODataConventionModelBuilder();
            modelBuilder.EntitySet<seller>("SellersOdata").EntityType.HasKey(e => e.seller_id);
            //modelBuilder.EntitySet<portal_order_import>("OrderImportsOdata").EntityType.HasKey(e => e.import_id);
            modelBuilder.EntitySet<om_order>("OrdersOdata").EntityType.HasKey(e => e.order_id);
            modelBuilder.EntitySet<BalanceTransactionListDto>("BalanceTransactionsOdata").EntityType.HasKey(e => e.tx_id);

            return modelBuilder;
        }

        private static void RegisterOtherServices(WebApplicationBuilder builder)
        {
            // AWS
            //string region = builder.Configuration["Aws:Region"];
            //string accessKeyId = builder.Configuration["Aws:AccessKeyId"];
            //string secretAccessKey = builder.Configuration["Aws:SecretAccessKey"];
            //builder.Services.AddScoped<AmazonS3Client>(provider => new AmazonS3Client
            //    (accessKeyId,
            //    secretAccessKey,
            //    new AmazonS3Config { RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(region) }
            //    ));
        }
    }
}

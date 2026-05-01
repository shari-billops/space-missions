using SpaceMissions.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var csvPath = Path.Combine(AppContext.BaseDirectory, "space_missions.csv");
var service = new MissionService(csvPath);
builder.Services.AddSingleton(service);

var app = builder.Build();

app.UseCors();

// --- Filter metadata endpoints (used by dashboard dropdowns) ---

app.MapGet("/api/companies", (MissionService svc) => svc.GetCompanies());
app.MapGet("/api/statuses/rocket", (MissionService svc) => svc.GetRocketStatuses());
app.MapGet("/api/statuses/mission", (MissionService svc) => svc.GetMissionStatuses());

// --- Full mission list with optional filters (used by dashboard table) ---

app.MapGet("/api/missions", (
    MissionService svc,
    string? company,
    string? missionStatus,
    string? rocketStatus,
    string? startDate,
    string? endDate) =>
{
    var missions = svc.GetAll();

    if (!string.IsNullOrWhiteSpace(company))
        missions = missions.Where(m =>
            m.Company.Equals(company, StringComparison.OrdinalIgnoreCase));

    if (!string.IsNullOrWhiteSpace(missionStatus))
        missions = missions.Where(m =>
            m.MissionStatus.Equals(missionStatus, StringComparison.OrdinalIgnoreCase));

    if (!string.IsNullOrWhiteSpace(rocketStatus))
        missions = missions.Where(m =>
            m.RocketStatus.Equals(rocketStatus, StringComparison.OrdinalIgnoreCase));

    if (DateOnly.TryParse(startDate, out var start))
        missions = missions.Where(m =>
            DateOnly.TryParse(m.Date, out var d) && d >= start);

    if (DateOnly.TryParse(endDate, out var end))
        missions = missions.Where(m =>
            DateOnly.TryParse(m.Date, out var d) && d <= end);

    return missions;
});

// --- Required grading functions ---

app.MapGet("/api/getMissionCountByCompany", (MissionService svc, string company) =>
    svc.getMissionCountByCompany(company));

app.MapGet("/api/getSuccessRate", (MissionService svc, string company) =>
    svc.getSuccessRate(company));

app.MapGet("/api/getMissionsByDateRange", (MissionService svc, string startDate, string endDate) =>
    svc.getMissionsByDateRange(startDate, endDate));

app.MapGet("/api/getTopCompaniesByMissionCount", (MissionService svc, int n) =>
    svc.getTopCompaniesByMissionCount(n)
       .Select(x => new { company = x.Company, count = x.Count }));

app.MapGet("/api/getMissionStatusCount", (MissionService svc) =>
    svc.getMissionStatusCount());

app.MapGet("/api/getMissionsByYear", (MissionService svc, int year) =>
    svc.getMissionsByYear(year));

app.MapGet("/api/getMostUsedRocket", (MissionService svc) =>
    svc.getMostUsedRocket());

app.MapGet("/api/getAverageMissionsPerYear", (MissionService svc, int startYear, int endYear) =>
    svc.getAverageMissionsPerYear(startYear, endYear));

app.Run();

using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using SpaceMissions.Api.Models;

namespace SpaceMissions.Api.Services;

/// <summary>
/// Domain Service class
/// </summary>
public class MissionService
{
    private readonly List<Mission> _missions;

    public MissionService(string csvPath)
    {
        _missions = LoadMissions(csvPath);
    }

    /// <summary>
    /// For unit tests
    /// </summary>
    /// <param name="missions"></param>
    public MissionService(List<Mission> missions)
    {
        _missions = missions;
    }

    private static List<Mission> LoadMissions(string csvPath)
    {
        if (!File.Exists(csvPath))
            throw new FileNotFoundException($"Data file not found: {csvPath}");

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            MissingFieldFound = null,
            BadDataFound = null,
        };

        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader, config);
        return csv.GetRecords<Mission>().ToList();
    }

    // All missions — used by the dashboard table endpoint
    public IEnumerable<Mission> getAll() => _missions;

    // Distinct values for filter dropdowns
    public IEnumerable<string> getCompanies() =>
        _missions.Select(m => m.Company).Distinct().OrderBy(c => c);

    public IEnumerable<string> getRocketStatuses() =>
        _missions.Select(m => m.RocketStatus).Distinct().OrderBy(s => s);

    public IEnumerable<string> getMissionStatuses() =>
        _missions.Select(m => m.MissionStatus).Distinct().OrderBy(s => s);

    // Function 1
    public int getMissionCountByCompany(string companyName)
    {
        if (string.IsNullOrWhiteSpace(companyName)) return 0;
        return _missions.Count(m =>
            m.Company.Equals(companyName, StringComparison.OrdinalIgnoreCase));
    }

    // Function 2
    public double getSuccessRate(string companyName)
    {
        if (string.IsNullOrWhiteSpace(companyName)) return 0.0;

        var company = _missions.Where(m =>
            m.Company.Equals(companyName, StringComparison.OrdinalIgnoreCase)).ToList();

        if (company.Count == 0) return 0.0;

        var successes = company.Count(m =>
            m.MissionStatus.Equals("Success", StringComparison.OrdinalIgnoreCase));

        return Math.Round((double)successes / company.Count * 100, 2);
    }

    // Function 3
    public List<string> getMissionsByDateRange(string startDate, string endDate)
    {
        if (!DateOnly.TryParse(startDate, out var start) ||
            !DateOnly.TryParse(endDate, out var end))
            return [];

        return _missions
            .Where(m => DateOnly.TryParse(m.Date, out var d) && d >= start && d <= end)
            .OrderBy(m => m.Date)
            .Select(m => m.Name)
            .ToList();
    }

    // Function 4
    public List<(string Company, int Count)> getTopCompaniesByMissionCount(int n)
    {
        if (n <= 0) return [];

        return _missions
            .GroupBy(m => m.Company)
            .Select(g => (Company: g.Key, Count: g.Count()))
            .OrderByDescending(x => x.Count)
            .ThenBy(x => x.Company)
            .Take(n)
            .ToList();
    }

    // Function 5
    public Dictionary<string, int> getMissionStatusCount()
    {
        var counts = new Dictionary<string, int>
        {
            ["Success"] = 0,
            ["Failure"] = 0,
            ["Partial Failure"] = 0,
            ["Prelaunch Failure"] = 0,
        };

        foreach (var m in _missions)
        {
            if (counts.ContainsKey(m.MissionStatus))
                counts[m.MissionStatus]++;
        }

        return counts;
    }

    // Function 6
    public int getMissionsByYear(int year)
    {
        return _missions.Count(m =>
            DateOnly.TryParse(m.Date, out var d) && d.Year == year);
    }

    // Function 7
    public string getMostUsedRocket()
    {
        return _missions
            .GroupBy(m => m.Rocket)
            .Select(g => (Rocket: g.Key, Count: g.Count()))
            .OrderByDescending(x => x.Count)
            .ThenBy(x => x.Rocket)
            .Select(x => x.Rocket)
            .FirstOrDefault() ?? "";
    }

    // Function 8
    public double getAverageMissionsPerYear(int startYear, int endYear)
    {
        if (startYear > endYear) return 0.0;

        var count = _missions.Count(m =>
            DateOnly.TryParse(m.Date, out var d) &&
            d.Year >= startYear && d.Year <= endYear);

        var years = endYear - startYear + 1;
        return Math.Round((double)count / years, 2);
    }
}

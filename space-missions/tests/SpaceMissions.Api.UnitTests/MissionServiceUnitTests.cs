namespace SpaceMissions.Api.UnitTests;

using SpaceMissions.Api.Models;
using SpaceMissions.Api.Services;

public class MissionUnitTests
{
    private MissionService missionService;
    private List<Mission> missions = new List<Mission>();

    public MissionUnitTests()
    {
        this.missions = LoadMissions();
        this.missionService = new MissionService(missions);
    }

    [Theory]
    [InlineData("RVSN USSR", 2)]
    [InlineData("US NAVY", 1)]
    public void getMissionCountByCompany_Returns_Expected(string companyName, int expected)
    {
        var result = missionService.getMissionCountByCompany(companyName);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("RVSN USSR", 100)]
    [InlineData("US NAVY", 0)]
    public void getSuccessRateByCompany_Returns_Expected(string companyName, int expected)
    {
        var result = missionService.getSuccessRate(companyName);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("1957-01-01", "1957-12-31", new string[] { "Sputnik-1", "Sputnik-2", "Vanguard TV3" })]
    public void getMissionsByDateRange_Returns_Expected(string startDate, string endDate, string[] expected)
    {
        var result = missionService.getMissionsByDateRange(startDate, endDate);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(1, new string[] { "RVSN USSR" }, new int[] { 2 })]
    [InlineData(2, new string[] { "RVSN USSR", "US Navy" }, new int[] { 2, 1 })]
    [InlineData(0, new string[] { }, new int[] { })]
    public void getTopCompaniesByMissionCount_Returns_Expected(
        int n,
        string[] expectedCompanies,
        int[] expectedCounts)
    {
        var result = missionService.getTopCompaniesByMissionCount(n);

        Assert.Equal(expectedCompanies.Length, result.Count);

        for (var i = 0; i < expectedCompanies.Length; i++)
        {
            Assert.Equal(expectedCompanies[i], result[i].Company);
            Assert.Equal(expectedCounts[i], result[i].Count);
        }
    }

    [Fact]
    public void getMissionStatusCount_Returns_Expected()
    {
        var result = missionService.getMissionStatusCount();

        Assert.Equal(2, result["Success"]);
        Assert.Equal(1, result["Failure"]);
        Assert.Equal(0, result["Partial Failure"]);
        Assert.Equal(0, result["Prelaunch Failure"]);
    }

    [Theory]
    [InlineData(1957, 3)]
    [InlineData(1958, 0)]
    public void getMissionsByYear_Returns_Expected(int year, int expected)
    {
        var result = missionService.getMissionsByYear(year);

        Assert.Equal(expected, result);
    }

    [Fact]
    public void getMostUsedRocket_Returns_Expected()
    {
        var result = missionService.getMostUsedRocket();

        Assert.Equal("Sputnik 8K71PS", result);
    }

    [Theory]
    [InlineData(1957, 1957, 3)]
    [InlineData(1957, 1958, 1.5)]
    [InlineData(1958, 1957, 0.0)]
    public void getAverageMissionsPerYear_Returns_Expected(
        int startYear,
        int endYear,
        double expected)
    {
        var result = missionService.getAverageMissionsPerYear(startYear, endYear);
        Assert.Equal(expected, result);
    }

    private static List<Mission> LoadMissions()
    {
        return new List<Mission> {
            new Mission
            {
                Company = "RVSN USSR",
                Location = "Site 1/5, Baikonur Cosmodrome, Kazakhstan",
                Date = "1957-10-04",
                Time = "19:28:00",
                Rocket = "Sputnik 8K71PS",
                Name = "Sputnik-1",
                RocketStatus = "Retired",
                Price = null,
                MissionStatus = "Success"
            },
            new Mission
            {
                Company = "RVSN USSR",
                Location = "Site 1/5, Baikonur Cosmodrome, Kazakhstan",
                Date = "1957-11-03",
                Time = "02:30:00",
                Rocket = "Sputnik 8K71PS",
                Name = "Sputnik-2",
                RocketStatus = "Retired",
                Price = null,
                MissionStatus = "Success"
            },
            new Mission
            {
                Company = "US Navy",
                Location = "LC-18A, Cape Canaveral AFS, Florida, USA",
                Date = "1957-12-06",
                Time = "16:44:00",
                Rocket = "Vanguard",
                Name = "Vanguard TV3",
                RocketStatus = "Retired",
                Price = null,
                MissionStatus = "Failure"
            }
        };
    }
}

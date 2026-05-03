using System.Net;
using System.Net.Http.Json;
using Xunit;

public class SpaceMissionsApiIntegrationTests : IClassFixture<SpaceMissionsWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public SpaceMissionsApiIntegrationTests(SpaceMissionsWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetMissions_ReturnsSuccess()
    {
        var response = await _client.GetAsync("/api/missions");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Theory]
    [InlineData("RVSN USSR", 1777)]
    [InlineData("US NAVY", 17)]
    public async Task GetMissionCountByCompany_ReturnsExpected(
        string company,
        int expected)
    {
        var response = await _client.GetAsync(
            $"/api/getMissionCountByCompany/?company={Uri.EscapeDataString(company)}");

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<int>();

        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("RVSN USSR", 90.83)]
    [InlineData("US NAVY", 11.76)]
    public async Task GetSuccessRateByCompany_ReturnsExpected(
        string company,
        double expected)
    {
        var response = await _client.GetAsync(
            $"/api/getSuccessRate/?company={Uri.EscapeDataString(company)}");

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<double>();

        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("1990-01-01", "2001-12-03")]
    public async Task GetMissionsByDateRange_ReturnsExpected(
        string startDate,
        string endDate)
    {
        var response = await _client.GetAsync(
            $"/api/getMissionsByDateRange?startDate={startDate}&endDate={endDate}");

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<List<string>>();

        Assert.NotNull(result);
        Assert.Contains("NROL-12", result);
        Assert.Contains("Genesis Probe", result);
        Assert.DoesNotContain("Vanguard TV3", result);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    public async Task GetTopCompaniesByMissionCount_ReturnsExpected(int n)
    {
        var response = await _client.GetAsync(
            $"/api/getTopCompaniesByMissionCount/?n={n}");

        response.EnsureSuccessStatusCode();

        var result = await response.Content
            .ReadFromJsonAsync<List<TopCompanyResponse>>();

        Assert.NotNull(result);
        Assert.True(result.Count <= n);
    }

    [Fact]
    public async Task GetMissionStatusCount_ReturnsExpected()
    {
        var response = await _client.GetAsync("/api/getMissionStatusCount");

        response.EnsureSuccessStatusCode();

        var result = await response.Content
            .ReadFromJsonAsync<Dictionary<string, int>>();

        Assert.NotNull(result);
        Assert.True(result.ContainsKey("Success"));
        Assert.True(result.ContainsKey("Failure"));
        Assert.True(result.ContainsKey("Partial Failure"));
        Assert.True(result.ContainsKey("Prelaunch Failure"));
    }

    [Theory]
    [InlineData(1957, 3)]
    [InlineData(1958, 28)]
    public async Task GetMissionsByYear_ReturnsExpected(
        int year,
        int expected)
    {
        var response = await _client.GetAsync(
            $"/api/getMissionsByYear/?year={year}");

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<int>();

        Assert.Equal(expected, result);
    }

    [Fact]
    public async Task GetMostUsedRocket_ReturnsExpected()
    {
        var response = await _client.GetAsync("/api/getMostUsedRocket");

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadAsStringAsync();

        Assert.False(string.IsNullOrWhiteSpace(result));
    }

    [Theory]
    [InlineData(1957, 1957, 3)]
    [InlineData(1957, 1958, 15.5)]
    [InlineData(1958, 1957, 0.0)]
    public async Task GetAverageMissionsPerYear_ReturnsExpected(
        int startYear,
        int endYear,
        double expected)
    {
        var response = await _client.GetAsync(
            $"/api/getAverageMissionsPerYear?startYear={startYear}&endYear={endYear}");

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<double>();

        Assert.Equal(expected, result);
    }
}

public record TopCompanyResponse(string Company, int Count);
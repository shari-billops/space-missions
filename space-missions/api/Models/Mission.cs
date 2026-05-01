using CsvHelper.Configuration.Attributes;

namespace SpaceMissions.Api.Models;

public class Mission
{
    [Name("Company")]
    public string Company { get; set; } = "";

    [Name("Location")]
    public string Location { get; set; } = "";

    [Name("Date")]
    public string Date { get; set; } = "";

    [Name("Time")]
    public string? Time { get; set; }

    [Name("Rocket")]
    public string Rocket { get; set; } = "";

    [Name("Mission")]
    public string Name { get; set; } = "";

    [Name("RocketStatus")]
    public string RocketStatus { get; set; } = "";

    [Name("Price")]
    public string? Price { get; set; }

    [Name("MissionStatus")]
    public string MissionStatus { get; set; } = "";
}

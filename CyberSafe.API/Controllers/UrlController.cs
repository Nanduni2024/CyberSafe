using Microsoft.AspNetCore.Mvc;

namespace CyberSafe.API.Controllers;

[ApiController]
[Route("api/url")]
public sealed class UrlController : ControllerBase
{
    private static readonly string[] ShortenerHosts =
    [
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "is.gd",
        "ow.ly",
        "buff.ly"
    ];

    private static readonly string[] BrandWords =
    [
        "paypal",
        "apple",
        "microsoft",
        "google",
        "facebook",
        "instagram",
        "whatsapp",
        "netflix",
        "amazon"
    ];

    [HttpPost("check")]
    [ProducesResponseType(typeof(UrlCheckResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<UrlCheckResponse> Check([FromBody] UrlCheckRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest("URL is required.");
        }

        var input = request.Url.Trim();
        if (!Uri.TryCreate(input, UriKind.Absolute, out var uri))
        {
            return Ok(new UrlCheckResponse(75, "Invalid URL", ["Enter a full URL that starts with http:// or https://."]));
        }

        var findings = new List<string>();
        var riskScore = 0;
        var host = uri.Host.ToLowerInvariant();

        if (uri.Scheme != Uri.UriSchemeHttps)
        {
            riskScore += 30;
            findings.Add("The URL does not use HTTPS.");
        }

        if (Uri.CheckHostName(host) == UriHostNameType.IPv4 || Uri.CheckHostName(host) == UriHostNameType.IPv6)
        {
            riskScore += 25;
            findings.Add("The host is an IP address instead of a readable domain.");
        }

        if (ShortenerHosts.Contains(host))
        {
            riskScore += 20;
            findings.Add("This appears to use a link shortener, which can hide the real destination.");
        }

        if (host.Count(ch => ch == '-') >= 2)
        {
            riskScore += 10;
            findings.Add("The domain contains several hyphens.");
        }

        if (host.Count(ch => ch == '.') >= 3)
        {
            riskScore += 10;
            findings.Add("The URL uses multiple subdomains. Confirm the real registered domain.");
        }

        if (ContainsBrandTrap(host))
        {
            riskScore += 20;
            findings.Add("The domain includes a well-known brand word in a suspicious way.");
        }

        if (input.Length > 120)
        {
            riskScore += 10;
            findings.Add("The URL is unusually long.");
        }

        if (string.IsNullOrWhiteSpace(uri.Host))
        {
            riskScore += 25;
            findings.Add("The URL host could not be identified.");
        }

        riskScore = Math.Clamp(riskScore, 0, 100);
        var rating = riskScore switch
        {
            >= 70 => "High risk",
            >= 40 => "Suspicious",
            >= 15 => "Review carefully",
            _ => "Looks normal"
        };

        if (findings.Count == 0)
        {
            findings.Add("No obvious URL warning signs were found. Still confirm the sender and destination before signing in or paying.");
        }

        return Ok(new UrlCheckResponse(riskScore, rating, findings));
    }

    private static bool ContainsBrandTrap(string host)
    {
        foreach (var brand in BrandWords)
        {
            if (host.Contains(brand, StringComparison.OrdinalIgnoreCase) && !host.EndsWith($"{brand}.com", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }
}

public sealed record UrlCheckRequest(string Url);

public sealed record UrlCheckResponse(int RiskScore, string Rating, IReadOnlyList<string> Findings);

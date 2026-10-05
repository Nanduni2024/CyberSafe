using Microsoft.AspNetCore.Mvc;

namespace CyberSafe.API.Controllers;

[ApiController]
[Route("api/password")]
public sealed class PasswordController : ControllerBase
{
    private static readonly string[] CommonPasswords =
    [
        "password",
        "password123",
        "123456",
        "12345678",
        "qwerty",
        "admin",
        "letmein",
        "welcome",
        "iloveyou",
        "abc123"
    ];

    [HttpPost("check")]
    [ProducesResponseType(typeof(PasswordCheckResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<PasswordCheckResponse> Check([FromBody] PasswordCheckRequest request)
    {
        if (request is null || request.Password is null)
        {
            return BadRequest("Password is required.");
        }

        var password = request.Password;
        var feedback = new List<string>();
        var score = 0;

        if (password.Length >= 12) score += 25;
        else if (password.Length >= 8) score += 15;
        else feedback.Add("Use at least 12 characters.");

        if (password.Any(char.IsUpper)) score += 15;
        else feedback.Add("Add at least one uppercase letter.");

        if (password.Any(char.IsLower)) score += 15;
        else feedback.Add("Add at least one lowercase letter.");

        if (password.Any(char.IsDigit)) score += 15;
        else feedback.Add("Add at least one number.");

        if (password.Any(ch => !char.IsLetterOrDigit(ch))) score += 15;
        else feedback.Add("Add a symbol or punctuation mark.");

        if (HasRepeatedCharacters(password))
        {
            score -= 10;
            feedback.Add("Avoid repeated character patterns.");
        }

        if (HasSequentialCharacters(password))
        {
            score -= 10;
            feedback.Add("Avoid simple sequences like 1234 or abcd.");
        }

        if (CommonPasswords.Contains(password, StringComparer.OrdinalIgnoreCase))
        {
            score = Math.Min(score, 20);
            feedback.Add("This looks like a very common password.");
        }

        score = Math.Clamp(score, 0, 100);
        var rating = score switch
        {
            >= 85 => "Strong",
            >= 65 => "Good",
            >= 40 => "Weak",
            _ => "Very weak"
        };

        if (feedback.Count == 0)
        {
            feedback.Add("This password has a strong mix of length and character types.");
        }

        return Ok(new PasswordCheckResponse(score, rating, feedback));
    }

    private static bool HasRepeatedCharacters(string value)
    {
        for (var i = 2; i < value.Length; i++)
        {
            if (value[i] == value[i - 1] && value[i] == value[i - 2])
            {
                return true;
            }
        }

        return false;
    }

    private static bool HasSequentialCharacters(string value)
    {
        var lower = value.ToLowerInvariant();
        const string sequences = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i <= lower.Length - 4; i++)
        {
            var chunk = lower.Substring(i, 4);
            if (sequences.Contains(chunk))
            {
                return true;
            }
        }

        return false;
    }
}

public sealed record PasswordCheckRequest(string Password);

public sealed record PasswordCheckResponse(int Score, string Rating, IReadOnlyList<string> Feedback);

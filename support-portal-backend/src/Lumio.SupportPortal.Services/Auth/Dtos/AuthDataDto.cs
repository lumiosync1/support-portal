namespace Lumio.SupportPortal.Services.Auth
{
    public class AuthDataDto
    {
        public string AccessToken { get; set; }
        public DateTime ExpiresAt { get; set; }
        public CurrentUserDto User { get; set; }
    }
}
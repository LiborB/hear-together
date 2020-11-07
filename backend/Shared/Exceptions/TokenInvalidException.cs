using System;

namespace Shared.Exceptions
{
    public class TokenInvalidException : Exception
    {
        public TokenInvalidException()
        {
            
        }

        public TokenInvalidException(string message) : base(message)
        {
            
        }
    }
}
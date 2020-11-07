using System;
using System.Runtime.Serialization;

namespace Shared.Exceptions
{
    [Serializable]
    public class StationNotFoundException : Exception
    {
        //
        // For guidelines regarding the creation of new exception types, see
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpgenref/html/cpconerrorraisinghandlingguidelines.asp
        // and
        //    http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dncscol/html/csharp07192001.asp
        //

        public StationNotFoundException()
        {
        }

        public StationNotFoundException(string message) : base(message)
        {
        }

        public StationNotFoundException(string message, Exception inner) : base(message, inner)
        {
        }

        protected StationNotFoundException(
            SerializationInfo info,
            StreamingContext context) : base(info, context)
        {
        }
    }
}
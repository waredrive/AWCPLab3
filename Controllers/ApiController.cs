using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Lernia.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {
        const string TYPEAHEAD_KEY = "2c1b9845ad4d4ac5b2fe48b4c25b9bb7";
        const string SEARCH_KEY = "a8f11745ef554c52aeb27e9c27daf361";

        [Route("typeahead/{term}")]
        public async Task Typeahead([FromRoute] string term)
        {
            await Query($"https://api.sl.se/api2/typeahead.json?key={TYPEAHEAD_KEY}&searchstring={term}");
        }

        [Route("search/{term}")]
        public async Task Search([FromRoute] string term)
        {
            await Query($"https://api.sl.se/api2/realtimedeparturesV4.json?key={SEARCH_KEY}&siteid={term}&timewindow=60");
        }

        [Route("stops/{originID}/{destination}/{transportType}/{lineNumber}/{departureTime}/{currentTime}")]
        public async Task Stops([FromRoute] string originID, string destination, string transportType, string lineNumber, string departureTime, string currentTime)
        {
            await Query($"https://sl.se/api/RealTime/GetStationsInBetween/{originID}/{destination}/{transportType}/{lineNumber}/{departureTime}/{currentTime}");
        }

        private async Task Query(string url)
        {
            using (var request = new HttpClient())
            {
                var stream = await request.GetStreamAsync(url);
                Response.ContentType = "application/json";
                await stream.CopyToAsync(Response.Body);
            }
        }
    }
}
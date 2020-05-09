using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DatingApp_API;

namespace DatingApp.API.Controllers
{
    [Route("api/v1/[controller]")] // api/v1/values
    [ApiController]
    public class ValuesController : ControllerBase
    {
        
        [HttpGet]
        public ActionResult <IEnumerable<string>> Get()
        {
            return new string[] { "hello", "world" };
        }

        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
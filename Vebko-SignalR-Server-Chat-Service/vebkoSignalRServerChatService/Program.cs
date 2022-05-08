using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Hosting;
using Newtonsoft.Json;
using Owin;
using SocketIOClient;
using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace vebkoSignalRChatService
{
    public class Program
    {
        private const string Url = "http://127.0.0.1:9080";

        public static IDictionary<string, string> allUserDict = new Dictionary<string, string>();

        public static SocketIO client;

        private static void Main(string[] args)
        {
            Console.WriteLine("Server started");

            client = new SocketIO("http://192.168.0.76:5002/");
            //client = new SocketIO("http://127.0.0.1:5002/");

            client.On("getAllOnlineUser", async response =>
            {
                string allUserJson = JsonConvert.SerializeObject(allUserDict);
                await client.EmitAsync("setAllOnlineUserFromChatServer", allUserJson);
            });


            client.On("callingSocket", async response =>
            {
                var res = response.GetValue<string>();
                string[] myRes = res.Split(new[] { "~!@#$" }, StringSplitOptions.None); // roomid - from - to

                var context = GlobalHost.ConnectionManager.GetHubContext<MyHub>();
                context.Clients.All.broadcast(myRes[0], myRes[1], myRes[2]);
            });

            client.OnConnected += async (sender, e) =>
            {
                // Emit a string
                //await client.EmitAsync("hi", "socket.io");

                // Emit a string and an object
                //var dto = new TestDTO { Id = 123, Name = "bob" };
                //await client.EmitAsync("register", "source", dto);
                await client.EmitAsync("setAdminSocket", "admin", client.Id);
            };

            using (WebApp.Start(Url, Configuration))
            {
                client.ConnectAsync().Wait();

                Console.WriteLine($"Server running on {Url}");
                Console.WriteLine("Press any key to send a message to connected clients");
                Console.ReadKey();

                // Send message to all connected clients
                //var context = GlobalHost.ConnectionManager.GetHubContext<MyHub>();
                //context.Clients.All.addMessage("Server", "Hello from server");
                //Console.ReadLine();
            }

        }

        public static void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);

            app.MapSignalR();

            //GlobalHost.Configuration.ConnectionTimeout = TimeSpan.FromSeconds(110);
            GlobalHost.Configuration.DisconnectTimeout = TimeSpan.FromSeconds(6);
            //GlobalHost.Configuration.KeepAlive = TimeSpan.FromSeconds(10);

        }
    }
}

using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace vebkoSignalRChatService
{
    public class MyHub : Hub
    {
        //public void addMessage(string name, string message)
        //{
        //    Console.WriteLine($"Server send: {name} - {message}");
        //    Clients.All.addMessage(name, message);

        //    //Clients.User(Context.ConnectionId).addMessage(name, message);
        //}

        public async void addUserToMyHub(string userName)
        {

            Program.allUserDict.Add(Context.ConnectionId, userName);

            Console.WriteLine($"Server send: {userName}");

            //Clients.All.broadcast(userName, Context.ConnectionId, "111");

            string allUserJson = JsonConvert.SerializeObject(Program.allUserDict);
            await Program.client.EmitAsync("setAllOnlineUser", allUserJson);
        }

        public override Task OnConnected()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            return base.OnConnected();
        }

        public async override Task OnDisconnected(bool stopCalled)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");

            Program.allUserDict.Remove(Context.ConnectionId);

            string allUserJson = JsonConvert.SerializeObject(Program.allUserDict);
            await Program.client.EmitAsync("setAllOnlineUser", allUserJson);

            base.OnDisconnected(stopCalled);
        }

        //public async Task Register(string username)
        //{
        //    var currentId = Context.ConnectionId;
        //    if (!userLookup.ContainsKey(currentId))
        //    {
        //        // maintain a lookup of connectionId-to-username
        //        userLookup.Add(currentId, username);
        //        // re-use existing message for now
        //        await Clients.AllExcept(currentId).SendAsync(
        //            Messages.RECEIVE,
        //            username, $"{username} joined the chat");
        //    }
        //}

        ///// <summary>
        ///// Log connection
        ///// </summary>
        ///// <returns></returns>
        //public override Task OnConnectedAsync()
        //{
        //    Console.WriteLine("Connected");
        //    return base.OnConnectedAsync();
        //}

        ///// <summary>
        ///// Log disconnection
        ///// </summary>
        ///// <param name="e"></param>
        ///// <returns></returns>
        //public override async Task OnDisconnectedAsync(Exception e)
        //{
        //    Console.WriteLine($"Disconnected {e?.Message} {Context.ConnectionId}");
        //    // try to get connection
        //    string id = Context.ConnectionId;
        //    if (!userLookup.TryGetValue(id, out string username))
        //        username = "[unknown]";

        //    userLookup.Remove(id);
        //    await Clients.AllExcept(Context.ConnectionId).SendAsync(
        //        Messages.RECEIVE,
        //        username, $"{username} has left the chat");
        //    await base.OnDisconnectedAsync(e);
        //}

    }
}

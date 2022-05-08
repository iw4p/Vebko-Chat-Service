using System;
using System.Diagnostics;
using System.Windows.Forms;
using Microsoft.AspNet.SignalR.Client;

namespace vebkoSignalRClientNetFramework4
{
    public partial class Form1 : Form
    {

        private IHubProxy myHub;
        private HubConnection connection;
        
        public Form1()
        {
            InitializeComponent();
        }
        private void Form1_Load(object sender, EventArgs e)
        {
            //Set connection
            connection = new HubConnection("http://localhost:9080");

            //Make proxy to hub based on hub name on server
            myHub = connection.CreateHubProxy("MyHub");

            string userName = "test1";

            //Start connection
            connection.Start().ContinueWith(task =>
            {
                if (task.IsFaulted)
                {
                    Console.WriteLine("There was an error opening the connection:{0}", task.Exception.GetBaseException());
                }
                else
                {
                    Console.WriteLine("Connected");
                    myHub.Invoke<string>("addUserToMyHub", userName);

                    myHub.On<string, string, string>("broadcast", (roomID, from, to) =>
                    {
                        if (userName == to)
                        {
                            DialogResult res = MessageBox.Show("Are you sure you want to Chat with " + from, "Confirmation", MessageBoxButtons.OKCancel, MessageBoxIcon.Information);
                            if (res == DialogResult.OK)
                            {
                                //MessageBox.Show("You have clicked Ok Button");
                                Process.Start("VebkoWinformsChatService.exe", roomID + " " + from + " " + to);
                            }
                            if (res == DialogResult.Cancel)
                            {
                                //MessageBox.Show("You have clicked Cancel Button");
                            }

                        }
                    });

                }
            }).Wait();
        }
    }
}

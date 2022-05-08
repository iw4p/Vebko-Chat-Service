using Microsoft.Web.WebView2.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace VebkoWinformsChatService
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        void EnsureHttps(object sender, CoreWebView2NavigationStartingEventArgs args)
        {
            String uri = args.Uri;
            if (!uri.StartsWith("https://"))
            {
                webView21.CoreWebView2.ExecuteScriptAsync($"alert('{uri} is not safe, try an https link')");
                args.Cancel = true;
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            string[] args = Environment.GetCommandLineArgs();

            //webView21.Source = new Uri($"http://192.168.0.186:3000/chat?username=test1&connectionid=123");
            //webView21.Source = new Uri($"http://192.168.0.186:3000/chat?username=test1&roomname=test1");
            //webView21.Source = new Uri($"https://mirotalk.up.railway.app/join/95601BlackBeaver");
            webView21.Source = new Uri($"http://192.168.0.76:3000/chat?roomID=" + args[1] + "&username=" + args[3]);

        }
    }
}

using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NewYearsEveChallenge
{
    public class DrawingHandler : WebSocketHandler
    {
        public Predictor Predictor { get; set; }
        public DrawingHandler(ConnectionManager webSocketConnectionManager) : base(webSocketConnectionManager)
        {
            Predictor = new Predictor();
        }

        public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            var socketId = WebSocketConnectionManager.GetId(socket);
            var jsonString = Encoding.UTF8.GetString(buffer, 0, result.Count);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            try
            {
                var cords = JsonSerializer.Deserialize<List<Cords>>(jsonString, options);
                Predictor.WriteData(cords);
                var prediction = Predictor.Predict();
                await SendMessageAsync(socketId, prediction);
            }
            catch (System.Exception)
            {
                await SendMessageAsync(socketId, "dupa");
            }

        }
    }
}

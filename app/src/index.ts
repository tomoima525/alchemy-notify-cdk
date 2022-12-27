import express from "express";
import * as path from "path";
import { Server } from "socket.io";
import fetch from "node-fetch";

const PORT = 80;
const alchemyToken = process.env.ALCHEMY_TOKEN as string;
const webhookId = process.env.WEBHOOK_ID as string;
// start the express server with the appropriate routes for our webhook and web requests
const app = express()
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .post("/alchemyhook", (req, res) => {
    notificationReceived(req);
    res.status(200).end();
  })
  .get("/health", (req, res) => {
    res.status(200).send({
      message: `Hello from AWS AppRunner service running!`,
    });
  })
  .get("/*", (req, res) => res.sendFile(path.join(__dirname + "/index.html")))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// start the websocket server
const io = new Server(app);

// listen for client connections/calls on the WebSocket server
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
  socket.on("register address", (msg) => {
    //send address to Alchemy to add to notification
    addAddress(msg);
  });
});

// notification received from Alchemy from the webhook. Let the clients know.
function notificationReceived(req: any) {
  console.log("notification received!", req.body);
  io.emit("notification", JSON.stringify(req.body));
}

// add an address to a notification in Alchemy
async function addAddress(new_address: string) {
  console.log("adding address " + new_address);
  const body = {
    webhook_id: webhookId,
    addresses_to_add: [new_address],
    addresses_to_remove: [],
  };
  try {
    fetch("https://dashboard.alchemyapi.io/api/update-webhook-addresses", {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "X-Alchemy-Token": alchemyToken,
      },
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  } catch (err) {
    console.error(err);
  }
}

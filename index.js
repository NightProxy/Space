import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import cors from "cors";
import http from "node:http";
import path from "node:path";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet"

const server = http.createServer();
const app = express();
const __dirname = process.cwd();
const bare = createBareServer("/bare/");
const PORT = 6060;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/!", express.static(uvPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/&", (req, res) => {
    res.sendFile(path.join(__dirname, "public/&.html"));
});;

app.get("/~", (req, res) => {
    res.sendFile(path.join(__dirname, "public/~.html"));
});;

app.get("/g", (req, res) => {
    res.sendFile(path.join(__dirname, "public/g.html"));
});;

app.get("/a", (req, res) => {
    res.sendFile(path.join(__dirname, "public/a.html"));
});;

app.get("/err", (req, res) => {
    res.sendFile(path.join(__dirname, "public/err.html"));
});;

server.on("request", (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on("upgrade", (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.destroy();
    }
});

server.on("listening", () => {
    console.log(`Server listening on port ${PORT}`);
});

server.listen(PORT);

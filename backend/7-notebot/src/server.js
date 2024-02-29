const express = require('express');
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const http = require("http");
const debugLib = require("debug");
const { Eureka } = require("eureka-js-client");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const HttpError = require("./models/http-error");
const os = require('os');

dotenv.config();
const env = process.env.NODE_ENV || "production";
const debug = debugLib("7-notebot:src/server");
const db = require("./models");

global.__basedir = __dirname;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(logger("dev"));
// app.use(cors());
app.use(require("./middlewares/check-auth"));

const mongoURL = process.env.MONGO_DB;

// Create connection to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("**** Successfully connected to MongoDB ****");
})
.catch((err) => {
    console.error("!!!! Error connecting to MongoDB !!!!", err);
    process.exit(1);
});

// Routes
const apiURL = "/api/notebot";
const userRoutes = require("./routes/user.routes");
const noteRoutes = require("./routes/note.Routes");
const widgetsRoutes = require("./routes/widgets");
const sectionsRoutes = require("./routes/sections");
const coursesRoutes = require("./routes/courses");

app.use(`${apiURL}`, userRoutes);
app.use(`${apiURL}/courses`, coursesRoutes);
app.use(`${apiURL}/nots`, noteRoutes);
app.use(`${apiURL}/widgets`, widgetsRoutes);
app.use(`${apiURL}/sections`, sectionsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Server Configuration
const port = normalizePort(process.env.PORT || "8007");
const hostName = normalizePort(process.env.HOSTNAME || "backend-7-notebot");
app.set("port", port);

const server = http.createServer(app);

// Event listeners for HTTP server
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// Function to get the local IP address
function getIPAddress() {
  const ifaces = os.networkInterfaces();
  let ipAddress = '127.0.0.1';

  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
      }
    });
  });

  return ipAddress;
}

// Configuration for Eureka client
const client = new Eureka({
  instance: {
    app: "ELAS-NOTEBOT",
    hostName: os.hostname(),
    ipAddr: getIPAddress(),
    port: {
      '$': port,
      '@enabled': 'true',
    },
    statusPageUrl: `http://${hostName}:${port}`,
    vipAddress: "ELAS-NOTEBOT",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    // Eureka server host / port / servicePath
    host: process.env.EUREKA_HOST_NAME,
    port: process.env.EUREKA_PORT,
    servicePath: "/eureka/apps/",
  },
});

// Connect to Eureka server
client.start((error) => {
  console.log(error || "**** Notebot started and registered with Eureka ****");
});

// Helper Functions

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Starting " + env.trim() + " server on port " + port);
  debug("Listening on " + bind);
}

// Exit handler
function exitHandler(options, exitCode) {
  if (options.exit) {
    client.stop(function (error) {
      process.exit();
    });
  }
}

process.on("SIGINT", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));

module.exports = server;
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const app = express();
const ejs = require("ejs");
const port = process.env.SERVER_PORT;

app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
  let accessControlAllowOrigin =
    [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://gofishingdao.com",
      "https://www.gofishingdao.com",
    ].includes(req.headers.origin) && req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", accessControlAllowOrigin);
  res.setHeader("Access-Control-Allow-Credentials", `true`);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization",
  );
  next();
});

app.use((req, res, next) => {
  if (process.env.HTTP_SECURE === "true") {
    req.serverUrl = req.protocol + "s://" + req.headers.host + "/";
  } else {
    req.serverUrl = req.protocol + "://" + req.headers.host + "/";
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api", require("./api"));
// app.use("/api/auth", authRoutes);

app.use("/", express.static("build"));
app.use("/uploads", express.static("uploads"));
app.engine("html", ejs.renderFile);

let server;

if (port) {
  server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
} else {
  server = app.listen();
}

// require("./websocket")(server);

if (!require("fs").existsSync("./uploads")) {
  require("fs").mkdirSync("./uploads");
}

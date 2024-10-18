//    /home/khalfani/Projects/MainProjects/Projects/MANAGE/docker/docker-server.js
import express from "express";
import { proxySubdomainRequest } from "./proxy.js";
import path from "path";
import session from "express-session";
const app = express();
// Configure session middleware

app.use(
  session({
    secret: "jdsoifjj3408",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 60_000 * 10,
    },
  }),
);

app.all("/set", (req, res) => {
  req.session.test = "AJFIOWEJ";
  console.log(req.session);
  res.send("t");
});
app.all("/check", (req, res) => {
  console.log(req.session);
  res.json({ session: req.session });
});

app.all("/cc", (...params) => {
  const [req] = params;
  console.log("req.session", req.session);
  // req.session.username = "John Doe";
  express.static(path.join(import.meta.dirname, "public"))(...params);
});

const proxyDictionary = [];

const PORT = process.env.PORT || 80 || 4000;

let mostRecentIndexes;

// app.get("/c", (...params) =>
//   express.static(path.join(import.meta.dirname, "public"))(...params),
// );
app.use("/containers/", (...p) => {
  express.static(path.join(import.meta.dirname, "public"))(...p);
  // express.static("public")(...p);
});

app.all("/", (...params) => proxySubdomainRequest(...params));
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server listening on port ${PORT}`);
});

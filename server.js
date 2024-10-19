import express from "express";
import { proxySubdomainRequest } from "./proxy.js";
import path from "path";
import session from "express-session";
const app = express();

const proxyDictionary = [];
const PORT = process.env.PORT || 80 || 4000;

app.use("/containers/", (...p) => {
  express.static(path.join(import.meta.dirname, "public"))(...p);
});

app.use("/", proxySubdomainRequest);

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server listening on port ${PORT}`);
});

import { listRunningContainers } from "./docker.js";
import fuzzy from "fuzzy";

import proxy from "express-http-proxy";

export async function proxySubdomainRequest(...params) {
  //when querytning search for container
  // if found only one then send
  // else return list
  const [req, res, next] = params;

  const containers = await listRunningContainers();

  const [firstSubdomain, proxyAppName] = req.headers.host.split(".");
  if (!req.headers.host.includes(".")) {
    next();
    return;
  }

  const matchIndexes = fuzzy
    .filter(
      firstSubdomain,
      containers.map((container) => container.name),
    )
    .map((match) => match.index);

  if (matchIndexes.length == 1) {
    const matchingContainer = containers[matchIndexes[0]];
    const portsLowToHigh = [...matchingContainer.ports].sort((a, b) => a - b);

    proxy(`http://${matchingContainer.ipAddress}:${portsLowToHigh[0]}/`)(
      ...params,
    );
    return;
  }
  if (req.path == "/") {
    res.cookie(
      "serverData",
      JSON.stringify(matchIndexes.map((i) => containers[i])),
      {
        maxAge: 1000 * 60 * 10,
        secure: process.env.NODE_ENV === "production", //  Secure in production
        sameSite: "strict", // or 'lax'
      },
    );

    // res.redirect(`/check`);
    res.redirect(`/containers/containers.html`);
  }
}

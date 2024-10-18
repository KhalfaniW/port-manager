import Docker from "dockerode";
import { getDockerPortInfo } from "./list-docker-ports.js";
// Function to list container names, their compose project label, and IP address as an array of objects
export async function listRunningContainers() {
  const docker = new Docker();
  try {
    // Fetch the list of running containers
    const containers = await docker.listContainers({
      filters: { status: ["running"] },
    }); // Include stopped containers if needed

    // Map container data to the desired format
    const containerList = await Promise.all(
      containers.map(async (container) => {
        const name = container.Names[0].replace(/^\//, "");
        const composeProjectLabel =
          container.Labels["com.docker.compose.project"] || "N/A";

        let ipAddress = "N/A";
        if (container.State === "running") {
          // Only get IP for running containers
          const containerInspect = await docker
            .getContainer(container.Id)
            .inspect();
          if (containerInspect.NetworkSettings.Networks) {
            // Get IP from the first network found (you can specify a specific network if needed)
            const networkName = Object.keys(
              containerInspect.NetworkSettings.Networks,
            )[0];
            ipAddress =
              containerInspect.NetworkSettings.Networks[networkName].IPAddress;

            // For containers using the host network mode:
          } else if (
            containerInspect.NetworkSettings.HostConfig.NetworkMode === "host"
          ) {
            ipAddress = "Host"; // Or get the host's actual IP if required.
          }
        }

        const portInfoGroup = await getDockerPortInfo(container.Id);

        const ports = portInfoGroup
          .filter(
            (portInfo) =>
              portInfo["State"] === "LISTEN" &&
              // checks if the service is listening on all available interfaces/also outside the container
              portInfo["Local Address:Port"].split(":")[0] == "*",
          )
          .map((portInfo) =>
            Number(portInfo["Local Address:Port"].split(":")[1]),
          );

        return {
          name: name,
          composeProject: composeProjectLabel,
          ipAddress: ipAddress,
          ports,
        };
      }),
    );

    return containerList;
  } catch (err) {
    console.error("Error listing containers:", err);
    return [];
  }
}

import { exec } from "child_process";

export async function getDockerPortInfo(dockerContainerId) {
  const isNotValidID = !/^[a-f0-9]{12,64}$/.test(dockerContainerId);
  if (isNotValidID || !dockerContainerId) {
    throw new Error(
      "Error: Please provide the Docker container ID as a command-line argument.",
    );
  }
  try {
    const pidCommand = `docker inspect -f '{{.State.Pid}}' ${dockerContainerId}`;
    const { stdout: pid } = await execPromise(pidCommand);
    const dockerPortCommand = `sudo nsenter -t ${pid.trim()} -n ss -ltu`;
    const { stdout: dockerPortOutput } = await execPromise(dockerPortCommand);

    return parseNetworkData(dockerPortOutput);
  } catch (error) {
    console.error("Error:", error);
    return []; // Return an empty array in case of error
  }
}

function parseNetworkData(data) {
  const lines = data.trim().split("\n");

  return lines.slice(1).map((line) => {
    const values = line.split(/\s+/);

    return {
      //enumrating these explciity instead of parsing the header is more readable
      Netid: values[0],
      State: values[1],
      "Recv-Q": parseInt(values[2], 10),
      "Send-Q": parseInt(values[3], 10),
      "Local Address:Port": values[4],
      "Peer Address:Port": values[5],
      Process: values[6] || null,
    };
  });
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

# docker-manage

This project provides a simple proxy server to easily access your Docker containers running on the same machine via subdomains. It uses fuzzy matching to resolve subdomain requests to the correct container based on the container name or compose project label.

## Features

- **Subdomain Routing:** Access containers using subdomains that match their name (e.g., `my-container.localhost`).
- **Fuzzy Matching:** Handles typos and partial matches in subdomains.
- **Compose Project Support:** Works with containers launched via Docker Compose, using compose project labels.
- **Port Detection:** Automatically detects the exposed port of the container.
- **Simple UI:** Provides a basic HTML page to list matching containers if multiple matches are found.

## Prerequisites

- **Docker:** Installed and running.
- **Docker Compose (optional):** If you are using Docker Compose.
- **Node.js and npm:** For running the proxy server. `pnpm` is the preferred package manager
- **sudo privilege**: for netstat access within containers via `nsenter` and to run on port `localhost:80`

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/docker-manage.git
```

2. Navigate to the project directory:

```bash
cd docker-manage
```

3. Install dependencies:

```bash
pnpm install
```

4. Build the frontend React components if they have changes

```bash
pnpm run build-js
```

## Usage

1. Start the proxy server:
   Needs to be run with `sudo` to allow port listing inside of containers

```bash
pnpm start
```

2. Access your containers via subdomains:

```
http://my-container.localhost   // Accesses the 'my-container' container, assuming it has a web server running.
http://another-app.localhost // Accesses the 'another-app' container.
```

If the subdomain matches multiple containers, a simple HTML page will list the possible matches.

## Configuration

The server listens on `127.0.0.1` and uses port `80` by default. You can change this by setting the `PORT` environment variable.

## How it works

- **`server.js`:** The main Express server file. It uses `express-http-proxy` to proxy requests. The `proxySubdomainRequest` middleware handles incoming requests, extracts the subdomain, performs fuzzy matching against running container names, and proxies the request to the matched container's IP address and port.
- **`docker.js`:** Contains the logic for fetching running container information from the Docker daemon using the `dockerode` library. It retrieves the container name, compose project label, IP address, and exposed ports.
- **`list-docker-ports.js`:** provides network data within each container using `nsenter`. Specifically it checks for services that are `LISTEN`ing on all interfaces of the host( `*` ). The output of `ss -ltu` is parsed into a Javascript object for ease of use.
- **`src/containers.jsx`:** A simple React component to render the list of matching containers if multiple matches are found for the subdomain. It assumes there is a `serverData` provided via server side rendering.

## Development

To rebuild the React components after a change:

```bash
pnpm run build-js
```

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

ISC

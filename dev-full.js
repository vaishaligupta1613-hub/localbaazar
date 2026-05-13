import { spawn } from 'child_process';
import net from 'net';

const DEFAULT_BACKEND_PORT = 4000;
const DEFAULT_FRONTEND_PORT = 5173;
const PORT_FALLBACK_RANGE = 10;

function checkPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port, '127.0.0.1');
  });
}

async function probeUrl(port, path = '/api/products') {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const response = await fetch(`http://127.0.0.1:${port}${path}`, { signal: controller.signal });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

async function findFreePort(startPort) {
  for (let port = startPort; port < startPort + PORT_FALLBACK_RANGE; port += 1) {
    if (await checkPortFree(port)) {
      return port;
    }
  }
  return null;
}

function startProcess({ name, command, args, env }) {
  const proc = spawn(command, args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env, ...env }
  });

  proc.stdout.on('data', (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  proc.stderr.on('data', (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  proc.on('close', (code) => {
    console.log(`[${name}] exited with code ${code}`);
    if (code !== 0) {
      process.exit(code);
    }
  });

  return proc;
}

async function run() {
  const tasks = [];
  const runningProcesses = [];
  let backendPort = DEFAULT_BACKEND_PORT;
  let frontendPort = DEFAULT_FRONTEND_PORT;

  if (await checkPortFree(backendPort)) {
    console.log(`Starting backend on port ${backendPort}`);
    tasks.push({ name: 'backend', command: 'node', args: ['server/index.js'], env: { PORT: `${backendPort}` } });
  } else if (await probeUrl(backendPort)) {
    console.log(`Using existing backend on port ${backendPort}`);
  } else {
    const freePort = await findFreePort(backendPort + 1);
    if (!freePort) {
      console.error(`Cannot start backend: no free port found near ${backendPort}`);
      process.exit(1);
    }
    backendPort = freePort;
    console.log(`Port ${DEFAULT_BACKEND_PORT} is busy; starting backend on port ${backendPort}`);
    tasks.push({ name: 'backend', command: 'node', args: ['server/index.js'], env: { PORT: `${backendPort}` } });
  }

  if (await checkPortFree(frontendPort)) {
    console.log(`Starting frontend on port ${frontendPort}`);
    tasks.push({ name: 'frontend', command: 'npm', args: ['run', 'dev'], env: { PORT: `${frontendPort}`, VITE_API_PORT: `${backendPort}` } });
  } else if (await probeUrl(frontendPort, '/')) {
    console.log(`Using existing frontend on port ${frontendPort}`);
  } else {
    const freePort = await findFreePort(frontendPort + 1);
    if (!freePort) {
      console.error(`Cannot start frontend: no free port found near ${frontendPort}`);
      process.exit(1);
    }
    frontendPort = freePort;
    console.log(`Port ${DEFAULT_FRONTEND_PORT} is busy; starting frontend on port ${frontendPort}`);
    tasks.push({ name: 'frontend', command: 'npm', args: ['run', 'dev'], env: { PORT: `${frontendPort}`, VITE_API_PORT: `${backendPort}` } });
  }

  tasks.forEach((task) => runningProcesses.push(startProcess(task)));

  function shutdown() {
    runningProcesses.forEach((proc) => {
      if (!proc.killed) {
        proc.kill('SIGINT');
      }
    });
    process.exit(0);
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', shutdown);
}

run().catch((err) => {
  console.error('Failed to start dev-full:', err);
  process.exit(1);
});

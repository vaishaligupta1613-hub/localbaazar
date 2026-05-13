import { spawn } from 'child_process';
import net from 'net';

const PORTS = {
  backend: 4000,
  frontend: 5173
};

function checkPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

function startProcess({ name, command, args }) {
  const proc = spawn(command, args, { stdio: ['inherit', 'pipe', 'pipe'], shell: true });

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

  const backendFree = await checkPortFree(PORTS.backend);
  if (backendFree) {
    tasks.push({ name: 'backend', command: 'npm', args: ['run', 'backend'] });
  } else {
    console.log(`Skipping backend: port ${PORTS.backend} already in use. Using existing backend instance.`);
  }

  const frontendFree = await checkPortFree(PORTS.frontend);
  if (frontendFree) {
    tasks.push({ name: 'frontend', command: 'npm', args: ['run', 'dev'] });
  } else {
    console.log(`Skipping frontend: port ${PORTS.frontend} already in use. Using existing frontend instance.`);
  }

  if (tasks.length === 0) {
    console.error('No servers started because both ports are already in use. Stop the existing processes or choose different ports.');
    process.exit(1);
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

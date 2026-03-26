import { spawn } from "node:child_process";
import process from "node:process";

function run(name, cmd, args, opts = {}) {
  const child = spawn(cmd, args, {
    stdio: "inherit",
    shell: true,
    ...opts,
  });
  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      process.exitCode = code;
    }
  });
  return child;
}

const backendCwd = new URL("../backend/", import.meta.url);

const isWindows = process.platform === "win32";
const backendCmd = isWindows
  ? { cmd: "python", args: ["server3.py"] }
  : { cmd: "python3", args: ["-m", "gunicorn", "-w", "2", "-b", "0.0.0.0:5001", "server3:app"] };

const backend = run("backend", backendCmd.cmd, backendCmd.args, {
  cwd: backendCwd,
  env: { ...process.env, PYTHONUNBUFFERED: "1" },
});

const frontend = run("frontend", "npm", ["run", "start"], {
  cwd: process.cwd(),
  env: { ...process.env },
});

function shutdown() {
  backend.kill("SIGINT");
  frontend.kill("SIGINT");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);


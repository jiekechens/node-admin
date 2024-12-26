import { env, argv } from "node:process";
import pty from "node-pty";

const { SERVER_USERNAME, SERVER_DEST, SERVER_PASSWORD } = env;

if (argv.includes("--scp")) {
  const process = pty.spawn("scp", ["-r", "dist/", `${SERVER_USERNAME}:${SERVER_DEST}`], { env });

  process.onExit((e) => {
    console.log(`child process exited with code ${e.exitCode} and signal ${e.signal}`);
  });

  process.onData((data) => {
    console.log(data);

    if (data.toLowerCase().includes("password:")) {
      process.write(`${SERVER_PASSWORD}\n`);
    }
  });
} else {
  const process = pty.spawn("rsync", ["-av", "--delete", "dist/", `${SERVER_USERNAME}:${SERVER_DEST}`], { env });

  process.onExit((e) => {
    console.log(`child process exited with code ${e.exitCode} and signal ${e.signal}`);
  });

  process.onData((data) => {
    console.log(data);
    if (data.includes("password:")) {
      process.write(`${SERVER_PASSWORD}\n`);
    }
  });
}

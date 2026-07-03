import { MongoMemoryServer } from "mongodb-memory-server";
import { spawn } from "child_process";

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri();

console.log(`[mongo-memory] started at ${uri}`);

const proc = spawn(
  "npx",
  ["tsx", "server/index.ts"],
  {
    env: { ...process.env, MONGODB_URI: uri },
    stdio: "inherit",
  }
);

proc.on("exit", async (code) => {
  await mongod.stop();
  process.exit(code ?? 0);
});

process.on("SIGTERM", async () => {
  proc.kill("SIGTERM");
  await mongod.stop();
  process.exit(0);
});

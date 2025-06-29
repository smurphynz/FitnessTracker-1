#!/usr/bin/env node

// Production entry point for Replit deployment
import { spawn, execSync } from "child_process";
import { existsSync } from "fs";

process.env.NODE_ENV = "production";
process.env.PORT = process.env.PORT || "5000";

console.log("Starting Calisthenics Fitness Tracker - Production Mode");

if (!existsSync("./dist/index.js")) {
  console.log("Building for production...");
  execSync("node production-build.js", { stdio: "inherit" });
}

const server = spawn("node", ["dist/index.js"], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" }
});

server.on("error", (error) => {
  console.error("Server error:", error);
  process.exit(1);
});

process.on("SIGTERM", () => server.kill("SIGTERM"));
process.on("SIGINT", () => server.kill("SIGINT"));

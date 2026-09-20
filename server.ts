import { createServer } from "node:http";
import { parse } from "node:url";
import fs from "node:fs";
import path from "node:path";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

const standalonePath = path.resolve(process.cwd(), ".next/standalone/server.js");

if (!dev && fs.existsSync(standalonePath)) {
  await import(standalonePath);
} else {
  const app = next({ dev, hostname: "0.0.0.0", port });
  const handle = app.getRequestHandler();

  await app.prepare();
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || "/", true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, () => {
    console.log(`> Horn Torus Server ready on port ${port}`);
  });
}

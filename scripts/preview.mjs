import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
const directory = resolve("dist");
const config = JSON.parse(await readFile("vercel.json"));
const headers = Object.fromEntries(
  config.headers[0].headers.map((h) => [h.key, h.value]),
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (pathname.split("/").some((p) => p.startsWith("."))) {
      res.writeHead(403, headers).end("Acesso negado");
      return;
    }
    let file = resolve(directory, "." + pathname);
    if (file !== directory && !file.startsWith(directory + sep)) {
      res.writeHead(403, headers).end("Acesso negado");
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const data = await readFile(file);
    res.writeHead(200, {
      ...headers,
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
      ...(pathname.startsWith("/demos/") ? { "X-Robots-Tag": "noindex" } : {}),
    });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res.writeHead(404, {
      ...headers,
      "Content-Type": "text/html; charset=utf-8",
    });
    res.end(await readFile(resolve(directory, "404.html")));
  }
});
server.listen(Number(process.env.PORT) || 8765, "127.0.0.1", () =>
  console.log(`Prévia local: http://127.0.0.1:${server.address().port}`),
);

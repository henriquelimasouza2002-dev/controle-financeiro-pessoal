import { mkdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "outputs");
const profileDir = path.join(root, "work", "edge-profile");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9222;
const baseUrl = "http://127.0.0.1:3000";

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      }
    };
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDebugger() {
  for (let index = 0; index < 60; index += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) return response.json();
    } catch {}
    await wait(500);
  }
  throw new Error("Edge DevTools nao iniciou a tempo.");
}

async function waitForReady(cdp) {
  for (let index = 0; index < 80; index += 1) {
    const result = await cdp.send("Runtime.evaluate", {
      expression: "document.readyState",
      returnByValue: true,
    });
    if (result.result.value === "complete") return;
    await wait(250);
  }
}

async function goto(cdp, url) {
  await cdp.send("Page.navigate", { url });
  await waitForReady(cdp);
  await wait(800);
}

async function screenshot(cdp, name) {
  const result = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  await writeFile(path.join(outputDir, name), Buffer.from(result.data, "base64"));
}

await mkdir(outputDir, { recursive: true });
await rm(profileDir, { recursive: true, force: true });
await mkdir(profileDir, { recursive: true });

const browser = spawn(edgePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "--window-size=1440,1000",
  "about:blank",
], { stdio: "ignore" });

try {
  const targets = await waitForDebugger();
  const page = targets.find((target) => target.type === "page") ?? targets[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const cdp = new Cdp(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await goto(cdp, baseUrl);
  await screenshot(cdp, "tela-login.png");

  await cdp.send("Runtime.evaluate", {
    expression: `
      document.querySelector('input[name="email"]').value = 'demo@financas.com';
      document.querySelector('input[name="password"]').value = '123456';
      document.querySelector('form').requestSubmit();
    `,
  });
  await wait(1800);

  await goto(cdp, `${baseUrl}/dashboard`);
  await screenshot(cdp, "tela-dashboard.png");

  await goto(cdp, `${baseUrl}/categories`);
  await screenshot(cdp, "tela-categorias.png");

  await goto(cdp, `${baseUrl}/transactions`);
  await screenshot(cdp, "tela-transacoes.png");

  await goto(cdp, `${baseUrl}/user`);
  await screenshot(cdp, "tela-usuario.png");

  ws.close();
} finally {
  browser.kill();
}

console.log("Screenshots salvos em outputs.");

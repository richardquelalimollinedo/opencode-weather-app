import { createInterface } from "readline";

let rl: ReturnType<typeof createInterface> | null = null;
const inputQueue: string[] = [];
let notifyInput: (() => void) | null = null;
let inputClosed = false;

function ensureRl(): void {
  if (rl) return;
  rl = createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    inputQueue.push(line);
    notifyInput?.();
    notifyInput = null;
  });
  rl.on("close", () => {
    inputClosed = true;
    notifyInput?.();
    notifyInput = null;
  });
}

export async function ask(prompt: string): Promise<string> {
  ensureRl();
  process.stdout.write(prompt);
  const queued = inputQueue.shift();
  if (queued !== undefined) return queued.trimEnd();
  if (inputClosed) {
    console.log("\n  Entrada finalizada. Saliendo...");
    process.exit(0);
  }
  await new Promise<void>((resolve) => {
    notifyInput = resolve;
  });
  const line = inputQueue.shift();
  return line?.trimEnd() ?? "";
}

export function closeInput(): void {
  rl?.close();
}

import { RESET } from "./constants.ts";

const CYAN = "\x1b[36m";
export const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

export const colorEnabled = process.stdout.isTTY === true;

export function paint(color: string, text: string): string {
  return colorEnabled ? `${color}${text}${RESET}` : text;
}

export const ok = (text: string): string => paint(GREEN, text);
export const warn = (text: string): string => paint(RED, text);
export const highlight = (text: string): string => paint(YELLOW, text);
export const title = (text: string): string => paint(CYAN, text);

export const LINE = "════════════════════════════════════════";

import type { MatchResult } from "./types";

const API_BASE = "http://localhost:8080/api";

let activeController: AbortController | null = null;

export async function apiLogin(steamId: number, token: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steamId, token }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка авторизации");
  return data as { playerName: string };
}

export interface AnalyzeParams {
  steamId: number;
  token: string;
  playerMatches: number;
  participantMatches: number;
}

export interface StreamMeta {
  playerName: string;
  playerMatches: number;
  participantMatches: number;
  total: number;
}

export interface AnalyzeCallbacks {
  onMeta: (meta: StreamMeta) => void;
  onMatch: (match: MatchResult, index: number) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}

export async function apiAnalyzeStream(
  params: AnalyzeParams,
  callbacks: AnalyzeCallbacks
): Promise<void> {
  // Убиваем предыдущий запрос если ещё висит
  if (activeController) {
    activeController.abort();
    activeController = null;
  }

  const controller = new AbortController();
  activeController = controller;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: controller.signal,
    });
  } catch (e: any) {
    if (e?.name === "AbortError") return;
    throw e;
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Ошибка анализа");
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const close = () => {
    reader.cancel().catch(() => {});
    if (activeController === controller) {
      activeController = null;
    }
  };

  try {
    while (true) {
      let done: boolean;
      let value: Uint8Array | undefined;

      try {
        ({ done, value } = await reader.read());
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        throw e;
      }

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        // Пропускаем SSE-комментарии (heartbeat пинги от бека)
        if (line.startsWith(":")) continue;

        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (!json) continue;

        let event: any;
        try {
          event = JSON.parse(json);
        } catch {
          continue;
        }

        if (event.type === "meta") {
          callbacks.onMeta(event as StreamMeta);
        } else if (event.type === "match") {
          callbacks.onMatch(event.match as MatchResult, event.index);
        } else if (event.type === "done") {
          callbacks.onDone();
          close();
          return;
        } else if (event.type === "error") {
          callbacks.onError(event.error);
          close();
          return;
        }
      }
    }
  } finally {
    close();
  }
}
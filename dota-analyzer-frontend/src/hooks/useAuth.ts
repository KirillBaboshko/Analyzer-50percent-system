import { useState } from "react";

export function useAuth() {
  const [steamId, setSteamId] = useState<number | null>(null);
  const [token, setToken] = useState("");
  const [playerName, setPlayerName] = useState("");

  const login = (id: number, tok: string, name: string) => {
    setSteamId(id);
    setToken(tok);
    setPlayerName(name);
  };

  const logout = () => {
    setSteamId(null);
    setToken("");
    setPlayerName("");
  };

  const isAuthenticated = Boolean(steamId);

  return {
    steamId,
    token,
    playerName,
    isAuthenticated,
    login,
    logout,
  };
}

import React, { useState } from "react";
import { apiLogin } from "../api";
import { Gamepad2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  onAuthorized: (steamId: number, token: string, playerName: string) => void;
  error: string | null;
}

export const LoginForm: React.FC<Props> = ({ onAuthorized, error }) => {
  const [steamId, setSteamId] = useState("");
  const [token, setToken] = useState("");
  const [showCustomToken, setShowCustomToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const id = Number(steamId);
    if (!id) {
      setLocalError("Укажи Steam ID");
      return;
    }
    
    // Если пользователь не ввел свой токен, используем пустую строку
    // Backend будет использовать токен из переменной окружения
    const finalToken = showCustomToken && token ? token : "";
    
    setLoading(true);
    try {
      const { playerName } = await apiLogin(id, finalToken);
      onAuthorized(id, finalToken, playerName);
    } catch (err: any) {
      setLocalError(err.message ?? "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-dota-card/95 border-2 border-dota-border rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Gamepad2 className="w-16 h-16 text-dota-dire" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Dota 2 Analyzer</h1>
          <p className="text-sm text-dota-muted">Анализ винрейта участников матчей</p>
        </div>

        {/* Error */}
        {(error || localError) && (
          <div className="mb-4 p-3 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dota-muted mb-2">
              Steam ID (Dota ID 32-bit)
            </label>
            <input
              type="number"
              value={steamId}
              onChange={(e) => setSteamId(e.target.value)}
              placeholder="Например: 924787624"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#060d15] border-2 border-dota-border text-dota-text placeholder-dota-muted focus:outline-none focus:ring-2 focus:ring-dota-dire focus:border-dota-dire transition"
            />
          </div>

          {/* Custom Token Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowCustomToken(!showCustomToken)}
              className="flex items-center gap-2 text-sm text-dota-muted hover:text-dota-text transition"
            >
              {showCustomToken ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>Использовать свой STRATZ токен</span>
            </button>
          </div>

          {/* Custom Token Field */}
          {showCustomToken && (
            <div>
              <label className="block text-sm font-medium text-dota-muted mb-2">
                STRATZ API Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Токен с stratz.com"
                className="w-full px-4 py-3 rounded-lg bg-[#060d15] border-2 border-dota-border text-dota-text placeholder-dota-muted focus:outline-none focus:ring-2 focus:ring-dota-dire focus:border-dota-dire transition"
              />
              <p className="mt-2 text-xs text-dota-muted">
                Получи токен на{" "}
                <a
                  href="https://stratz.com/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dota-dire hover:underline"
                >
                  stratz.com/api
                </a>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-dota-dire hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-white shadow-lg"
          >
            {loading ? "Проверяем..." : "Войти →"}
          </button>
        </form>
      </div>
    </div>
  );
};

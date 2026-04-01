import { Gamepad2, RefreshCw, LogOut } from "lucide-react";
import { LoginForm } from "./components/LoginForm";
import { SettingsForm } from "./components/SettingsForm";
import { ResultsView } from "./components/ResultsView";
import { useAuth } from "./hooks/useAuth";
import { useAnalysis } from "./hooks/useAnalysis";
import { Button } from "./components/ui/Button";

function App() {
  const { steamId, token, playerName, isAuthenticated, login, logout } = useAuth();
  const { meta, matches, loading, done, error, startAnalysis, reset } = useAnalysis();

  const handleAnalyze = async (playerMatches: number, participantMatches: number) => {
    if (!steamId || !token) return;
    await startAnalysis(steamId, token, playerMatches, participantMatches);
  };

  const handleLogout = () => {
    logout();
    reset();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dota-dark via-[#0a1218] to-dota-dark flex items-center justify-center p-6">
        <LoginForm onAuthorized={login} error={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-dota-dark via-[#0a1218] to-dota-dark">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-dota-card/80 border-b border-dota-border/50 backdrop-blur-md shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-dota-dire" />
            <div>
              <h1 className="text-lg font-bold text-white">Dota 2 Analyzer</h1>
              <p className="text-xs text-dota-muted">Игрок: {playerName}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="md" icon={RefreshCw} onClick={reset} disabled={loading}>
              Новый анализ
            </Button>
            <Button variant="danger" size="md" icon={LogOut} onClick={handleLogout} disabled={loading}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400">
            ⚠️ {error}
          </div>
        )}

        <SettingsForm onSubmit={handleAnalyze} loading={loading} />

        {(loading || matches.length > 0) && (
          <ResultsView meta={meta} matches={matches} loading={loading} done={done} />
        )}
      </main>
    </div>
  );
}

export default App;

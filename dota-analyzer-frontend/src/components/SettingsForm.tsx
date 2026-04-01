import React, { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";

interface Props {
  onSubmit: (playerMatches: number, participantMatches: number) => void;
  loading: boolean;
}

export const SettingsForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [playerMatches, setPlayerMatches] = useState(25);
  const [participantMatches, setParticipantMatches] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(playerMatches, participantMatches);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="mb-6">Настройки анализа</CardTitle>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-6 items-end">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-base font-medium text-dota-muted mb-2">
              Матчей основного игрока
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={playerMatches}
              onChange={(e) => setPlayerMatches(Number(e.target.value))}
              className="w-full px-4 py-3 text-base rounded-lg bg-[#060d15] border-2 border-dota-border text-dota-text focus:outline-none focus:ring-2 focus:ring-dota-dire focus:border-dota-dire transition"
            />
            <p className="mt-2 text-sm text-dota-muted">Максимум: 50</p>
          </div>

          <div className="flex-1 min-w-[220px]">
            <label className="block text-base font-medium text-dota-muted mb-2">
              Матчей каждого участника
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={participantMatches}
              onChange={(e) => setParticipantMatches(Number(e.target.value))}
              className="w-full px-4 py-3 text-base rounded-lg bg-[#060d15] border-2 border-dota-border text-dota-text focus:outline-none focus:ring-2 focus:ring-dota-dire focus:border-dota-dire transition"
            />
            <p className="mt-2 text-sm text-dota-muted">Максимум: 100</p>
          </div>

          <Button type="submit" variant="primary" size="lg" icon={Search} loading={loading}>
            Запустить анализ
          </Button>
        </form>
      </CardHeader>
    </Card>
  );
};

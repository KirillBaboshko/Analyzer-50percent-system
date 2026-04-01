import React from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardHeader } from "../ui/Card";
import type { StreamMeta } from "../../api";

interface Props {
  meta: StreamMeta | null;
  loaded: number;
  loading: boolean;
  done: boolean;
}

export const ProgressBar: React.FC<Props> = ({ meta, loaded, loading, done }) => {
  const total = meta?.total ?? 0;
  const progress = total > 0 ? (loaded / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {loading && !done && <Loader2 className="w-6 h-6 text-dota-dire animate-spin" />}
            {done && <CheckCircle2 className="w-6 h-6 text-green-400" />}
            <span className="font-semibold text-white text-lg">
              {done
                ? `Готово — загружено ${loaded} матчей`
                : loading
                ? total > 0
                  ? `Загружаем матчи... ${loaded} / ${total}`
                  : "Загружаем матчи..."
                : `Загружено ${loaded} матчей`}
            </span>
          </div>
          {meta && (
            <span className="text-sm text-dota-muted">
              Участников: {meta.participantMatches} матчей для WR
            </span>
          )}
        </div>
        {loading && total > 0 && (
          <div className="h-3 bg-dota-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-dota-dire to-dota-radiant transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

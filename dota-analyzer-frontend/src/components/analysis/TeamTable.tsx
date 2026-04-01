import React from "react";
import { CheckCircle2, XCircle, Star, UserX, Lock } from "lucide-react";
import type { PlayerStats } from "../../types";
import { getHeroName } from "../../heroes";
import { calculateWinRate, getWinRateColor, getWinRateBg, isPrivateProfile } from "../../utils/winrate";

interface Props {
  title: string;
  players: PlayerStats[];
  mainPlayerName?: string;
}

export const TeamTable: React.FC<Props> = ({ title, players, mainPlayerName }) => {
  return (
    <div className="p-5">
      <h4 className="font-bold text-white mb-4 text-base">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-1">
          <thead>
            <tr className="text-left text-dota-text border-b-2 border-dota-border/50">
              <th className="pb-3 pr-3 font-bold">Итог</th>
              <th className="pb-3 pr-3 font-bold">Игрок</th>
              <th className="pb-3 pr-3 font-bold">Герой</th>
              <th className="pb-3 pr-3 font-bold">K/D/A</th>
              <th className="pb-3 pr-3 font-bold">Матчей</th>
              <th className="pb-3 pr-3 font-bold">Побед</th>
              <th className="pb-3 font-bold">WR%</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => {
              const isAnonymous = p.id === 0;
              const isPrivate = isPrivateProfile(p);
              const isMainPlayer = p.name === mainPlayerName;
              const wr = !isAnonymous && !isPrivate ? calculateWinRate(p) : null;

              return (
                <tr
                  key={p.id + "-" + p.heroID}
                  className={`transition-all ${
                    isMainPlayer
                      ? "bg-blue-500/35 hover:bg-blue-500/45 font-semibold shadow-md"
                      : isAnonymous
                      ? "bg-purple-500/20 hover:bg-purple-500/30"
                      : isPrivate
                      ? "bg-orange-500/20 hover:bg-orange-500/30"
                      : wr !== null
                      ? getWinRateBg(wr)
                      : "hover:bg-dota-border/20"
                  }`}
                >
                  <td className="py-3 pr-3 rounded-l-lg">
                    {p.wonThisMatch ? (
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-300" />
                    )}
                  </td>
                  <td className="py-3 pr-3 max-w-[140px] truncate text-white">
                    {isMainPlayer && <Star className="w-4 h-4 text-blue-300 inline mr-1" />}
                    {p.name}
                  </td>
                  <td className="py-3 pr-3 text-dota-text font-medium">{getHeroName(p.heroID)}</td>
                  <td className="py-3 pr-3 font-mono text-dota-text font-semibold">
                    <span className="text-green-300">{p.kills}</span>/
                    <span className="text-red-300">{p.deaths}</span>/
                    <span className="text-yellow-300">{p.assists}</span>
                  </td>
                  {isAnonymous ? (
                    <td colSpan={3} className="py-3 text-purple-300 italic font-medium rounded-r-lg">
                      <div className="flex items-center gap-2">
                        <UserX className="w-4 h-4" />
                        Аноним
                      </div>
                    </td>
                  ) : isPrivate ? (
                    <td colSpan={3} className="py-3 text-orange-300 italic font-medium rounded-r-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        0 матчей (профиль закрыт)
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-3 pr-3 text-white font-semibold">{p.wins + p.losses}</td>
                      <td className="py-3 pr-3 text-white font-semibold">{p.wins}</td>
                      <td className={`py-3 text-lg rounded-r-lg ${getWinRateColor(wr!)}`}>
                        {wr!.toFixed(1)}%
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

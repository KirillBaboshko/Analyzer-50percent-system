import React from "react";
import { Trophy, Lock, UserX } from "lucide-react";

export const Legend: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      <span className="px-4 py-2 rounded-full bg-green-500/30 text-green-300 border-2 border-green-500/60 font-semibold shadow-lg flex items-center gap-2">
        <Trophy className="w-4 h-4" />
        WR ≥ 60%
      </span>
      <span className="px-4 py-2 rounded-full bg-yellow-500/30 text-yellow-300 border-2 border-yellow-500/60 font-semibold shadow-lg">
        WR ≥ 50%
      </span>
      <span className="px-4 py-2 rounded-full bg-red-500/30 text-red-300 border-2 border-red-500/60 font-semibold shadow-lg">
        WR &lt; 50%
      </span>
      <span className="px-4 py-2 rounded-full bg-orange-500/30 text-orange-300 border-2 border-orange-500/60 font-semibold shadow-lg flex items-center gap-2">
        <Lock className="w-4 h-4" />
        0 матчей (закрыто)
      </span>
      <span className="px-4 py-2 rounded-full bg-purple-500/30 text-purple-300 border-2 border-purple-500/60 font-semibold shadow-lg flex items-center gap-2">
        <UserX className="w-4 h-4" />
        Аноним
      </span>
    </div>
  );
};

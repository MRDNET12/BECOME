"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flame, TrendingUp, Award, Zap } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
  bestStreak: number;
  totalDays: number;
  identityName?: string;
}

export function StreakDisplay({ streak, bestStreak, totalDays, identityName }: StreakDisplayProps) {
  const getStreakColor = (current: number) => {
    if (current >= 30) return "text-neon-gold border-neon-gold";
    if (current >= 14) return "text-neon-orange border-neon-orange";
    if (current >= 7) return "text-neon-cyan border-neon-cyan";
    return "text-muted-foreground border-border";
  };

  const getFlameIntensity = (current: number) => {
    if (current >= 30) return "animate-pulse";
    if (current >= 14) return "animate-pulse";
    return "";
  };

  const streakPercentage = bestStreak > 0 ? Math.round((streak / bestStreak) * 100) : 0;

  // Générer les jours de la semaine courante
  const currentWeekDays = useMemo(() => {
    const today = new Date();
    const days: Array<{ day: number; completed: boolean; label: string }> = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayOfWeek = date.getDay();
      const dayOfMonth = date.getDate();
      
      // Simuler des jours complétés (à remplacer par vraies données)
      const completed = i < streak && Math.random() > 0.3;
      
      const labels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      
      days.unshift({
        day: dayOfMonth,
        completed,
        label: labels[dayOfWeek],
      });
    }
    
    return days;
  }, [streak]);

  return (
    <div className="space-y-6">
      {/* Streak principal */}
      <Card className={`bg-gradient-to-br ${streak >= 7 ? 'from-neon-orange/10 to-transparent' : 'from-card/50 to-transparent'} border-2 ${streak >= 7 ? 'border-neon-orange/50' : 'border-border/40'} p-6`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <motion.div
                animate={getFlameIntensity(streak) ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: getFlameIntensity(streak) ? Infinity : 0 }}
              >
                <Flame className={`w-8 h-8 ${getStreakColor(streak).split(' ')[0]}`} />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {identityName ? `Série ${identityName}` : "Série Actuelle"}
                </p>
                <p className="text-4xl font-bold text-foreground">
                  {streak} {streak === 1 ? "jour" : "jours"}
                </p>
              </div>
            </div>

            {/* Badge de niveau */}
            {streak >= 7 && (
              <Badge className={`ml-4 px-3 py-1 ${streak >= 30 ? 'bg-neon-gold text-black' : streak >= 14 ? 'bg-neon-orange text-black' : 'bg-neon-cyan text-black'}`}>
                {streak >= 30 ? "🔥 Incroyable !" : streak >= 14 ? "⚡ Excellent" : "✨ En forme"}
              </Badge>
            )}
          </div>

          {/* Statistiques secondaires */}
          <div className="space-y-2 text-right">
            <div>
              <p className="text-xs text-muted-foreground">Meilleure série</p>
              <p className={`text-2xl font-bold ${getStreakColor(bestStreak).split(' ')[0]}`}>
                {bestStreak} jours
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total jours</p>
              <p className="text-2xl font-bold text-neon-gold">
                {totalDays}
              </p>
            </div>
          </div>
        </div>

        {/* Progression vers le record */}
        {bestStreak > 0 && (
          <div className="mt-4 pt-4 border-t border-border/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression vers ton record</span>
              <span className={`font-bold ${streakPercentage >= 100 ? 'text-neon-gold' : 'text-foreground'}`}>
                {streakPercentage >= 100 ? '🎉 Nouveau record !' : `${streakPercentage}%`}
              </span>
            </div>
            <div className="h-2 mt-2 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(streakPercentage, 100)}%` }}
                transition={{ duration: 1 }}
                className={`h-full ${streakPercentage >= 100 ? 'bg-gradient-to-r from-neon-gold to-yellow-600' : 'bg-gradient-to-r from-neon-orange to-orange-600'}`}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Vue hebdomadaire */}
      <Card className="bg-card/50 border-2 border-neon-cyan/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-neon-cyan" />
            <p className="text-lg font-bold">Cette Semaine</p>
          </div>
          <Badge variant="outline" className="text-neon-cyan border-neon-cyan">
            {currentWeekDays.filter(d => d.completed).length} / 7 jours
          </Badge>
        </div>

        {/* Calendrier de la semaine */}
        <div className="grid grid-cols-7 gap-2">
          {currentWeekDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all
                ${day.completed
                  ? 'bg-neon-green/20 border-neon-green shadow-neon-green/30'
                  : 'bg-card/30 border-border/30'
                }
              `}
            >
              <span className="text-xs text-muted-foreground mb-1">
                {day.label}
              </span>
              <span className={`text-lg font-bold ${day.completed ? 'text-neon-green' : 'text-muted-foreground'}`}>
                {day.day}
              </span>
              {day.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-1"
                >
                  <Award className="w-4 h-4 text-neon-gold" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Statistiques de la semaine */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/20">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Jours complétés</p>
            <p className="text-xl font-bold text-neon-green">
              {currentWeekDays.filter(d => d.completed).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Taux de réussite</p>
            <p className="text-xl font-bold text-neon-cyan">
              {Math.round((currentWeekDays.filter(d => d.completed).length / 7) * 100)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">XP cette semaine</p>
            <p className="text-xl font-bold text-neon-gold">
              +{currentWeekDays.filter(d => d.completed).length * 50}
            </p>
          </div>
        </div>
      </Card>

      {/* Messages d'encouragement */}
      {streak >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-neon-gold/20 via-neon-orange/20 to-neon-violet/20 border-2 border-neon-gold/30 rounded-2xl p-6 text-center"
        >
          <TrendingUp className="w-8 h-8 mx-auto mb-3 text-neon-gold" />
          <p className="text-lg font-semibold text-foreground mb-2">
            {streak >= 30 ? "🏆 Tu es une légende ! Une série exceptionnelle !" :
             streak >= 14 ? "⚡ Impressionnant ! Tu es sur une lancée incroyable !" :
             streak >= 7 ? "✨ Excellent ! Tu maintiens le cap !" :
             "🎯 Bien parti ! Continue comme ça !"}
          </p>
          <p className="text-sm text-muted-foreground">
            Chaque jour qui passe renforce ton identité. Reste concentré !
          </p>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Flame, BookOpen, Target, Zap, Crown, Award, TrendingUp, Clock } from "lucide-react";

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: any;
  tier: "bronze" | "silver" | "gold" | "platinum";
  category: string;
  requirement: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface BadgeSystemProps {
  badges: BadgeData[];
  streaks: Record<string, number>;
  totalXP: number;
}

const TIER_COLORS = {
  bronze: "from-amber-700 to-amber-900 text-amber-200",
  silver: "from-slate-400 to-slate-600 text-slate-100",
  gold: "from-yellow-500 to-yellow-700 text-yellow-900",
  platinum: "from-indigo-500 to-indigo-700 text-indigo-100",
};

const TIER_GLOW = {
  bronze: "shadow-amber-500/50",
  silver: "shadow-slate-400/50",
  gold: "shadow-yellow-500/50",
  platinum: "shadow-indigo-500/50",
};

export function BadgeSystem({ badges, streaks, totalXP }: BadgeSystemProps) {
  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalBadges = badges.length;
  const completionPercentage = Math.round((unlockedCount / totalBadges) * 100);

  return (
    <div className="space-y-6">
      {/* Header avec statistiques globales */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-neon-gold">
            Collection de Badges
          </p>
          <p className="text-sm text-muted-foreground">
            {unlockedCount} / {totalBadges} débloqués ({completionPercentage}%)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-8 h-8 text-neon-gold" />
          <div className="text-right">
            <p className="text-lg font-bold text-neon-gold">{totalXP}</p>
            <p className="text-xs text-muted-foreground">XP Total</p>
          </div>
        </div>
      </div>

      {/* Barre de progression globale */}
      <Card className="bg-gradient-to-r from-neon-gold/10 to-transparent border-neon-gold/50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Progression Badges</span>
            <span className="text-sm font-bold text-neon-gold">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-background/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-neon-gold to-yellow-600"
            />
          </div>
        </div>
      </Card>

      {/* Catégories de badges */}
      {["Discipline", "Vitalité", "Sagesse", "Progression"].map((category) => {
        const categoryBadges = badges.filter(b => b.category === category);
        
        return (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {category === "Discipline" && <Shield className="w-5 h-5 text-neon-orange" />}
              {category === "Vitalité" && <Flame className="w-5 h-5 text-neon-green" />}
              {category === "Sagesse" && <BookOpen className="w-5 h-5 text-neon-cyan" />}
              {category === "Progression" && <TrendingUp className="w-5 h-5 text-neon-gold" />}
              {category}
            </h3>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {categoryBadges.map((badge) => {
                const Icon = badge.icon;
                
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: parseFloat(badge.id) * 0.1 }}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all
                      ${badge.unlocked
                        ? `bg-gradient-to-br ${TIER_COLORS[badge.tier]} ${TIER_GLOW[badge.tier]}`
                        : 'bg-card/40 border-border/40 grayscale opacity-50'
                      }
                    `}
                  >
                    {/* Badge de déblocage */}
                    {badge.unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: parseFloat(badge.id) * 0.15, type: "spring" }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-neon-gold rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Crown className="w-5 h-5 text-background" />
                      </motion.div>
                    )}

                    {/* Icône du badge */}
                    <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Icon className={`w-10 h-10 ${badge.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>

                    {/* Nom et description */}
                    <div className="space-y-1 text-center">
                      <h4 className={`font-bold text-sm ${badge.unlocked ? 'text-white' : 'text-muted-foreground'}`}>
                        {badge.name}
                      </h4>
                      <p className={`text-xs ${badge.unlocked ? 'text-white/90' : 'text-muted-foreground'}`}>
                        {badge.description}
                      </p>
                    </div>

                    {/* Progression si pas débloqué */}
                    {!badge.unlocked && badge.progress > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-xs text-white/80">
                          <span>Progression</span>
                          <span>{badge.progress}/{badge.maxProgress}</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                            className="h-full bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Badge de tier */}
                    {badge.unlocked && (
                      <Badge
                        className={`
                          mt-3 w-full justify-center bg-background/20 text-white text-xs
                        `}
                      >
                        {badge.tier === "bronze" && "🥉 Bronze"}
                        {badge.tier === "silver" && "🥈 Argent"}
                        {badge.tier === "gold" && "🥇 Or"}
                        {badge.tier === "platinum" && "💎 Platine"}
                      </Badge>
                    )}

                    {/* Exigence */}
                    {!badge.unlocked && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <p className="text-xs text-white/80 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {badge.requirement}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Message si aucun badge dans la catégorie */}
            {categoryBadges.length === 0 && (
              <Card className="bg-card/30 border-dashed border-border/40 p-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Aucun badge dans cette catégorie
                </p>
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Factory pour créer les badges par défaut
export function createDefaultBadges(
  streaks: Record<string, number>,
  totalXP: number,
  completedQuests: number
): BadgeData[] {
  return [
    // Badges de Discipline
    {
      id: "1",
      name: "Discipline de Bronze",
      description: "10 jours consécutifs",
      icon: Shield,
      tier: "bronze",
      category: "Discipline",
      requirement: "10 jours sans rater une preuve d'identité",
      unlocked: streaks.discipline >= 10,
      progress: Math.min(streaks.discipline, 10),
      maxProgress: 10,
    },
    {
      id: "2",
      name: "Discipline d'Argent",
      description: "30 jours consécutifs",
      icon: Shield,
      tier: "silver",
      category: "Discipline",
      requirement: "30 jours sans rater une preuve d'identité",
      unlocked: streaks.discipline >= 30,
      progress: Math.min(streaks.discipline, 30),
      maxProgress: 30,
    },
    {
      id: "3",
      name: "Discipline d'Or",
      description: "100 jours consécutifs",
      icon: Shield,
      tier: "gold",
      category: "Discipline",
      requirement: "100 jours sans rater une preuve d'identité",
      unlocked: streaks.discipline >= 100,
      progress: Math.min(streaks.discipline, 100),
      maxProgress: 100,
    },
    // Badges de Vitalité
    {
      id: "4",
      name: "Athlète Débutant",
      description: "5 preuves de vitalité",
      icon: Flame,
      tier: "bronze",
      category: "Vitalité",
      requirement: "Compléter 5 preuves liées à la vitalité",
      unlocked: completedQuests >= 5,
      progress: Math.min(completedQuests, 5),
      maxProgress: 5,
    },
    {
      id: "5",
      name: "Athlète Confirmé",
      description: "20 preuves de vitalité",
      icon: Flame,
      tier: "silver",
      category: "Vitalité",
      requirement: "Compléter 20 preuves liées à la vitalité",
      unlocked: completedQuests >= 20,
      progress: Math.min(completedQuests, 20),
      maxProgress: 20,
    },
    // Badges de Sagesse
    {
      id: "6",
      name: "Apprenti Sincère",
      description: "3 leçons apprises",
      icon: BookOpen,
      tier: "bronze",
      category: "Sagesse",
      requirement: "Transformer 3 échecs en leçons",
      unlocked: streaks.wisdom >= 3,
      progress: Math.min(streaks.wisdom, 3),
      maxProgress: 3,
    },
    {
      id: "7",
      name: "Maître de la Forge",
      description: "10 leçons apprises",
      icon: BookOpen,
      tier: "gold",
      category: "Sagesse",
      requirement: "Transformer 10 échecs en leçons",
      unlocked: streaks.wisdom >= 10,
      progress: Math.min(streaks.wisdom, 10),
      maxProgress: 10,
    },
    // Badges de Progression
    {
      id: "8",
      name: "Débutant Acharné",
      description: "500 XP accumulés",
      icon: Zap,
      tier: "bronze",
      category: "Progression",
      requirement: "Atteindre 500 XP total",
      unlocked: totalXP >= 500,
      progress: Math.min(totalXP, 500),
      maxProgress: 500,
    },
    {
      id: "9",
      name: "Bâtisseur Accompli",
      description: "2000 XP accumulés",
      icon: Zap,
      tier: "silver",
      category: "Progression",
      requirement: "Atteindre 2000 XP total",
      unlocked: totalXP >= 2000,
      progress: Math.min(totalXP, 2000),
      maxProgress: 2000,
    },
    {
      id: "10",
      name: "Maître Constructeur",
      description: "10000 XP accumulés",
      icon: Crown,
      tier: "platinum",
      category: "Progression",
      requirement: "Atteindre 10000 XP total",
      unlocked: totalXP >= 10000,
      progress: Math.min(totalXP, 10000),
      maxProgress: 10000,
    },
    {
      id: "11",
      name: "Première Semaine",
      description: "7 jours d'utilisation",
      icon: Clock,
      tier: "bronze",
      category: "Progression",
      requirement: "Utiliser l'app pendant 7 jours consécutifs",
      unlocked: streaks.usage >= 7,
      progress: Math.min(streaks.usage, 7),
      maxProgress: 7,
    },
    {
      id: "12",
      name: "Voyageur Déterminé",
      description: "30 jours d'utilisation",
      icon: TrendingUp,
      tier: "gold",
      category: "Progression",
      requirement: "Utiliser l'app pendant 30 jours consécutifs",
      unlocked: streaks.usage >= 30,
      progress: Math.min(streaks.usage, 30),
      maxProgress: 30,
    },
  ];
}

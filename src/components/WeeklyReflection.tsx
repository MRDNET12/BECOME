"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, TrendingUp, Award, Flame, BookOpen, CheckCircle, XCircle, Target, Sparkles, ChevronRight, Download, Share2 } from "lucide-react";

interface QuestSummary {
  identity: string;
  total: number;
  completed: number;
  failed: number;
  forged: number;
  xpGained: number;
}

interface WeeklyReflectionProps {
  weekData: {
    quests: QuestSummary[];
    lessons: number;
    logs: number;
    totalXP: number;
    startDate: Date;
    endDate: Date;
  };
  onGenerate?: () => void;
}

export function WeeklyReflection({ weekData, onGenerate }: WeeklyReflectionProps) {
  const [showReflection, setShowReflection] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isSunday = new Date().getDay() === 0; // 0 = Dimanche
  const daysUntilSunday = (7 - new Date().getDay()) % 7;

  const totalQuests = weekData.quests.reduce((sum, q) => sum + q.total, 0);
  const totalCompleted = weekData.quests.reduce((sum, q) => sum + q.completed, 0);
  const totalFailed = weekData.quests.reduce((sum, q) => sum + q.failed, 0);
  const totalForged = weekData.quests.reduce((sum, q) => sum + q.forged, 0);
  const successRate = totalQuests > 0 ? Math.round((totalCompleted / totalQuests) * 100) : 0;
  const transformationRate = totalFailed > 0 ? Math.round((totalForged / totalFailed) * 100) : 100;

  const handleGenerate = () => {
    if (onGenerate) {
      setIsGenerating(true);
      // Simuler un temps de génération
      setTimeout(() => {
        setIsGenerating(false);
        setShowReflection(true);
        onGenerate();
      }, 2000);
    }
  };

  const formatDateRange = (start: Date, end: Date) => {
    const options = { day: "numeric", month: "long" };
    const startStr = start.toLocaleDateString("fr-FR", options);
    const endStr = end.toLocaleDateString("fr-FR", options);
    return `${startStr} - ${endStr}`;
  };

  const getSuccessRating = () => {
    if (successRate >= 90) return { emoji: "🏆", text: "Exceptionnelle", color: "text-neon-gold" };
    if (successRate >= 75) return { emoji: "⭐", text: "Très bonne", color: "text-neon-green" };
    if (successRate >= 60) return { emoji: "✅", text: "Bonne", color: "text-neon-cyan" };
    if (successRate >= 40) return { emoji: "⚠️", text: "Moyenne", color: "text-neon-orange" };
    return { emoji: "📉", text: "À améliorer", color: "text-red-500" };
  };

  const getTransformationRating = () => {
    if (transformationRate >= 80) return { emoji: "🔥", text: "Maître de la Forge", color: "text-neon-gold" };
    if (transformationRate >= 60) return { emoji: "⚡", text: "Apprenti Sincère", color: "text-neon-violet" };
    if (transformationRate >= 40) return { emoji: "✨", text: "En progression", color: "text-neon-cyan" };
    return { emoji: "📚", text: "À développer", color: "text-neon-orange" };
  };

  const rating = getSuccessRating();
  const transformationRating = getTransformationRating();

  return (
    <div className="space-y-6">
      {/* Carte principale avec décompte */}
      <Card className="bg-gradient-to-br from-neon-orange/10 to-transparent border-2 border-neon-orange/50 p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-neon-orange" />
              <div>
                <p className="text-lg font-bold">Réflexion Hebdomadaire</p>
                <p className="text-sm text-muted-foreground">
                  {isSunday ? "Aujourd'hui, c'est dimanche !" : `Encore ${daysUntilSunday} jour(s)`}
                </p>
              </div>
            </div>
            {isSunday && (
              <Badge className="bg-neon-gold text-black animate-pulse">
                ✨ Prête à générer
              </Badge>
            )}
          </div>

          {/* Période */}
          <div className="bg-background/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Période</p>
            <p className="text-lg font-semibold text-foreground">
              {formatDateRange(weekData.startDate, weekData.endDate)}
            </p>
          </div>

          {/* Statistiques clés */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Preuves</p>
              <p className="text-2xl font-bold text-foreground">{totalQuests}</p>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Validées</p>
              <p className={`text-2xl font-bold ${rating.color}`}>{totalCompleted}</p>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Transformées</p>
              <p className={`text-2xl font-bold ${transformationRating.color}`}>
                {totalForged}
              </p>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">XP Gagné</p>
              <p className="text-2xl font-bold text-neon-gold">+{weekData.totalXP}</p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            {!isSunday && (
              <p className="text-sm text-muted-foreground flex-1 flex items-center">
                Reviens dimanche pour générer ta résumé hebdomadaire
              </p>
            )}
            {isSunday && (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !onGenerate}
                className="flex-1 h-14 bg-gradient-to-r from-neon-orange to-orange-600 hover:from-neon-orange/90 hover:to-orange-600/90"
                size="lg"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Génération...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Générer la Réflexion
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Réflexion générée */}
      <AnimatePresence>
        {showReflection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            {/* Taux de réussite */}
            <Card className="bg-gradient-to-r from-neon-green/10 to-transparent border-2 border-neon-green/50 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-neon-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-neon-green" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Taux de Réussite
                  </h3>
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className={`text-lg px-4 py-2 ${rating.color}`}>
                      {rating.emoji} {rating.text}
                    </Badge>
                    <span className="text-3xl font-bold text-foreground">
                      {successRate}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-neon-green" />
                      <span>{totalCompleted} preuves validées</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-neon-orange" />
                      <span>{totalFailed} échecs</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Transformation des échecs */}
            {totalFailed > 0 && (
              <Card className="bg-gradient-to-r from-neon-violet/10 to-transparent border-2 border-neon-violet/50 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-neon-violet/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Flame className="w-8 h-8 text-neon-violet" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      La Forge en Action
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <Badge className={`text-lg px-4 py-2 ${transformationRating.color}`}>
                        {transformationRating.emoji} {transformationRating.text}
                      </Badge>
                      <span className="text-3xl font-bold text-foreground">
                        {transformationRate}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {totalForged} / {totalFailed} échecs ont été transformés en leçons
                    </p>
                    <div className="bg-background/50 rounded-xl p-4">
                      <p className="text-sm leading-relaxed">
                        {transformationRate >= 80 ?
                          "🏆 Exceptionnel ! Tu es un véritable maître de La Forge. Tu transformes chaque obstacle en opportunité. Continue ainsi !" :
                          transformationRate >= 60 ?
                          "⚡ Très bien ! Tu sais tirer des leçons de tes échecs. C'est la clé de la progression." :
                          transformationRate >= 40 ?
                          "✨ Bien parti ! Commence à appliquer ces leçons. Chaque échec analysé est une victoire." :
                          "📚 À développer ! N'oublie pas d'utiliser La Forge quand tu échoues. C'est ton outil de croissance."}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Résumé par identité */}
            <Card className="bg-card/50 border-2 border-neon-gold/30 p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-neon-gold" />
                Performance par Identité
              </h3>
              <ScrollArea className="h-64">
                <div className="space-y-3 pb-2">
                  {weekData.quests.map((quest, index) => (
                    <motion.div
                      key={quest.identity}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-background/50 rounded-xl p-4 space-y-3"
                    >
                      {/* Header de l'identité */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-neon-gold" />
                          <span className="font-semibold text-lg">{quest.identity}</span>
                        </div>
                        <Badge variant="outline" className="text-neon-gold border-neon-gold">
                          +{quest.xpGained} XP
                        </Badge>
                      </div>

                      {/* Statistiques */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="text-lg font-bold">{quest.total}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">✓</p>
                          <p className="text-lg font-bold text-neon-green">{quest.completed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">✗</p>
                          <p className="text-lg font-bold text-neon-orange">{quest.failed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">🔨</p>
                          <p className="text-lg font-bold text-neon-violet">{quest.forged}</p>
                        </div>
                      </div>

                      {/* Barre de réussite */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Taux de réussite</span>
                          <span className="font-semibold">{quest.total > 0 ? Math.round((quest.completed / quest.total) * 100) : 0}%</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${quest.total > 0 ? (quest.completed / quest.total) * 100 : 0}%` }}
                            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Statistiques globales */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-neon-gold/10 border-2 border-neon-gold/30 p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-neon-gold" />
                <p className="text-2xl font-bold text-neon-gold">{weekData.lessons}</p>
                <p className="text-sm text-muted-foreground">Leçons apprises</p>
              </Card>
              <Card className="bg-neon-cyan/10 border-2 border-neon-cyan/30 p-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-neon-cyan" />
                <p className="text-2xl font-bold text-neon-cyan">{weekData.logs}</p>
                <p className="text-sm text-muted-foreground">Logs rapides</p>
              </Card>
              <Card className="bg-neon-orange/10 border-2 border-neon-orange/30 p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-neon-orange" />
                <p className="text-2xl font-bold text-neon-orange">+{weekData.totalXP}</p>
                <p className="text-sm text-muted-foreground">XP Total</p>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-14 border-neon-gold text-neon-gold hover:bg-neon-gold/10"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-14 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                size="lg"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Partager
              </Button>
              <Button
                onClick={() => setShowReflection(false)}
                className="flex-1 h-14 bg-neon-gold hover:bg-neon-gold/90 text-black"
                size="lg"
              >
                Fermer
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

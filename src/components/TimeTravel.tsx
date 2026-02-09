"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Calendar, TrendingUp, TrendingDown, Zap, Crown, Shield, Flame, BookOpen, Target } from "lucide-react";

interface AttributeComparison {
  name: string;
  pastValue: number;
  currentValue: number;
  change: number;
  changePercentage: number;
}

interface TimeTravelProps {
  pastAttributes: Record<string, number>;
  currentAttributes: Record<string, number>;
  onCompare?: (past: boolean) => void;
}

export function TimeTravel({ pastAttributes, currentAttributes, onCompare }: TimeTravelProps) {
  const [value, setValue] = useState(50); // 0 = passé, 50 = aujourd'hui, 100 = futur théorique
  const [mode, setMode] = useState<"today" | "past">("today");

  const comparisons = useMemo(() => {
    const attributes = Object.keys(currentAttributes);
    
    return attributes.map(attrName => {
      const past = pastAttributes[attrName] || 0;
      const current = currentAttributes[attrName] || 0;
      const change = current - past;
      const changePercentage = past > 0 ? Math.round((change / past) * 100) : 100;

      return {
        name: attrName,
        pastValue: past,
        currentValue: current,
        change,
        changePercentage,
      };
    });
  }, [pastAttributes, currentAttributes]);

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    if (newValue < 25) {
      setMode("past");
      onCompare?.(true);
    } else if (newValue >= 75) {
      setMode("today");
      onCompare?.(false);
    } else {
      setMode("today");
      onCompare?.(false);
    }
  };

  const getAttributeIcon = (name: string) => {
    if (name === "Discipline") return Shield;
    if (name === "Vitalité") return Flame;
    if (name === "Sagesse") return BookOpen;
    if (name === "Focus") return Target;
    return Zap;
  };

  const totalPastXP = Object.values(pastAttributes).reduce((sum, val) => sum + val, 0);
  const totalCurrentXP = Object.values(currentAttributes).reduce((sum, val) => sum + val, 0);
  const totalChange = totalCurrentXP - totalPastXP;
  const totalChangePercentage = totalPastXP > 0 ? Math.round((totalChange / totalPastXP) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header avec comparaison globale */}
      <Card className="bg-gradient-to-br from-neon-violet/10 to-transparent border-2 border-neon-violet/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-neon-violet" />
            <div>
              <p className="text-lg font-bold">Time Travel</p>
              <p className="text-sm text-muted-foreground">Compare ton évolution</p>
            </div>
          </div>
          <Badge variant="outline" className="text-neon-violet border-neon-violet">
            {mode === "past" ? "🔙 Passé" : "📍 Aujourd'hui"}
          </Badge>
        </div>

        {/* Slider de voyage temporel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Mois dernier</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Aujourd'hui</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
            className="w-full h-2 bg-background/50 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) ${value}%, rgba(255, 255, 255, 0.2) ${value}%, rgba(255, 255, 255, 0.2) 100%)`
            }}
          />

          <div className="flex justify-between">
            <Button
              variant={mode === "past" ? "default" : "outline"}
              size="sm"
              onClick={() => { setValue(0); setMode("past"); onCompare?.(true); }}
              className={`w-32 ${mode === "past" ? 'bg-neon-violet hover:bg-neon-violet/90' : ''}`}
            >
              🔙 Passé
            </Button>
            <Button
              variant={mode === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => { setValue(100); setMode("today"); onCompare?.(false); }}
              className={`w-32 ${mode === "today" ? 'bg-neon-violet hover:bg-neon-violet/90' : ''}`}
            >
              📍 Aujourd'hui
            </Button>
          </div>
        </div>

        {/* Carte de résumé global */}
        <AnimatePresence mode="wait">
          {mode === "past" && (
            <motion.div
              key="past"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-background/50 rounded-xl p-4 space-y-3"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">XP Total</p>
                  <p className="text-2xl font-bold">{totalPastXP}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Niveau moyen</p>
                  <p className="text-2xl font-bold">
                    {Math.round(totalPastXP / Object.keys(pastAttributes).length / 10)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-lg font-semibold">Mois dernier</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center pt-3 border-t border-border/20">
                C'est là où tu étais. Regarde comment tu as grandi depuis.
              </p>
            </motion.div>
          )}

          {mode === "today" && (
            <motion.div
              key="today"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gradient-to-br from-neon-gold/20 to-neon-orange/20 rounded-xl p-4 space-y-3"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">XP Total</p>
                  <p className={`text-2xl font-bold ${totalChange > 0 ? 'text-neon-green' : totalChange < 0 ? 'text-red-500' : 'text-foreground'}`}>
                    {totalCurrentXP}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Évolution</p>
                  <div className="flex items-center gap-2">
                    {totalChange > 0 && <TrendingUp className="w-5 h-5 text-neon-green" />}
                    {totalChange < 0 && <TrendingDown className="w-5 h-5 text-red-500" />}
                    <p className={`text-2xl font-bold ${totalChange > 0 ? 'text-neon-green' : totalChange < 0 ? 'text-red-500' : 'text-foreground'}`}>
                      {totalChange > 0 ? '+' : ''}{totalChange} XP
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Progression</p>
                  <p className={`text-2xl font-bold ${totalChangePercentage > 0 ? 'text-neon-gold' : 'text-foreground'}`}>
                    +{totalChangePercentage}%
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center pt-3 border-t border-border/20">
                {totalChangePercentage > 0 ? "🎉 Tu as fait des progrès ! Continue comme ça !" :
                 totalChangePercentage === 0 ? "⚖️ Tu maintiens ton niveau. Continue !"
                 : "📉 Tu as perdu un peu de progression. Reviens à tes habitudes !"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Comparaison détaillée par attribut */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-gold" />
          Évolution par Attribut
        </h3>

        {comparisons.map((comparison) => {
          const Icon = getAttributeIcon(comparison.name);
          const isPositive = comparison.change > 0;
          const isNeutral = comparison.change === 0;

          return (
            <motion.div
              key={comparison.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                bg-card rounded-xl p-4 border-2
                ${isPositive ? 'border-neon-green shadow-neon-green/20' :
                  isNeutral ? 'border-border/40' : 'border-red-500/50'}
              `}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Nom et icône */}
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isPositive ? 'bg-neon-green/20' : isNeutral ? 'bg-background/50' : 'bg-red-500/20'}`}>
                    <Icon className={`w-6 h-6 ${isPositive ? 'text-neon-green' : isNeutral ? 'text-muted-foreground' : 'text-red-500'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{comparison.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Attribut de personnage
                    </p>
                  </div>
                </div>

                {/* Valeurs passées et actuelles */}
                <div className="text-right space-y-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Passé</p>
                    <p className="text-lg font-semibold">{comparison.pastValue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                    <p className={`text-lg font-bold ${isPositive ? 'text-neon-green' : isNeutral ? 'text-foreground' : 'text-red-500'}`}>
                      {comparison.currentValue}
                    </p>
                  </div>
                </div>

                {/* Badge de progression */}
                <div className="flex flex-col items-center gap-2">
                  {isPositive && (
                    <Badge className="bg-neon-green text-black px-3 py-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">+{comparison.changePercentage}%</span>
                      </div>
                    </Badge>
                  )}
                  {isNeutral && (
                    <Badge variant="outline" className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">0%</span>
                      </div>
                    </Badge>
                  )}
                  {!isPositive && !isNeutral && (
                    <Badge className="bg-red-500 text-white px-3 py-2">
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-4 h-4" />
                        <span className="font-semibold">{comparison.changePercentage}%</span>
                      </div>
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Message d'analyse */}
      <Card className="bg-gradient-to-r from-neon-cyan/10 via-neon-violet/10 to-neon-gold/10 border-2 border-neon-gold/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-neon-gold/20 flex items-center justify-center flex-shrink-0">
            <Crown className="w-6 h-6 text-neon-gold" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-foreground mb-2">
              Analyse de ton évolution
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {totalChangePercentage > 20 ? "🌟 Exceptionnel ! Tu progresses à un rythme remarquable. Tes avatars grandissent vite !" :
               totalChangePercentage > 10 ? "✨ Très bien ! Tu es sur la bonne voie. Continue d'alimenter la boucle !" :
               totalChangePercentage > 0 ? "👍 Bien ! Tu avances progressivement. Chaque petit pas compte !" :
               totalChangePercentage === 0 ? "⚖️ Stable ! Tu maintiens ton niveau. Continue tes efforts !" :
               "📉 Attention ! Tu perds du terrain. Reviens aux fondamentaux et reconnecte-toi à ta vision."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

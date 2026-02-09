"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const PHRASES_DU_JOUR = [
  "L'excellence est une habitude, pas un acte.",
  "Tu ne poursuis pas seulement des objectifs, tu construis la personne capable de les atteindre.",
  "Le succès est la somme de petits efforts répétés chaque jour.",
  "Ne cherche pas à devenir un homme de succès, mais un homme de valeur.",
  "Chaque petit progrès est une victoire.",
  "La discipline est le pont entre les objectifs et les accomplissements.",
  "Le personnage que tu deviens est plus important que ce que tu accomplis.",
];

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showPhrase, setShowPhrase] = useState(false);
  const [phrase] = useState(() => {
    return PHRASES_DU_JOUR[Math.floor(Math.random() * PHRASES_DU_JOUR.length)];
  });

  useEffect(() => {
    // Afficher la phrase après 500ms
    const phraseTimer = setTimeout(() => {
      setShowPhrase(true);
    }, 500);

    // Compléter le splash screen après 3 secondes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(phraseTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      {/* Logo animé - Triangle qui se construit */}
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="relative">
          {/* Forme triangulaire minimaliste */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="text-neon-gold"
          >
            <motion.path
              d="M60 10 L110 100 L10 100 Z"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </svg>
          {/* Crown au centre */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Crown className="w-8 h-8 text-neon-gold" />
          </motion.div>
        </div>
      </motion.div>

      {/* Titre BECOME */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-5xl font-bold text-neon-gold mb-4"
      >
        BECOME
      </motion.h1>

      {/* Phrase du jour */}
      {showPhrase && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center text-lg text-muted-foreground max-w-md px-6 leading-relaxed"
        >
          {phrase}
        </motion.p>
      )}

      {/* Indicateur de chargement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="mt-8"
      >
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-neon-gold rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

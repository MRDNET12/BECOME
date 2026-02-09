"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap } from "lucide-react";
import { triggerHapticFeedback } from "@/hooks/useSwipeGestures";

interface Quest {
    id: string;
    title: string;
    description: string;
    linkedIdentity: string;
    xpReward: number;
    status: "pending" | "completed" | "failed" | "forged";
}

interface Identity {
    id: string;
    name: string;
    color: string;
    attributes: string[];
}

interface SwipeableQuestCardProps {
    quest: Quest;
    identity: Identity;
    onComplete: (questId: string) => void;
    onFail: (questId: string) => void;
}

const NEON_COLORS = {
    orange: "text-neon-orange border-neon-orange",
    violet: "text-neon-violet border-neon-violet",
    cyan: "text-neon-cyan border-neon-cyan",
    gold: "text-neon-gold border-neon-gold",
};

export function SwipeableQuestCard({
    quest,
    identity,
    onComplete,
    onFail,
}: SwipeableQuestCardProps) {
    const [isDragging, setIsDragging] = useState(false);
    const x = useMotionValue(0);

    // Transform x position to background color and opacity
    const background = useTransform(
        x,
        [-150, 0, 150],
        [
            "rgba(255, 120, 50, 0.3)", // Orange for fail
            "rgba(0, 0, 0, 0)",
            "rgba(255, 215, 0, 0.3)", // Gold for success
        ]
    );

    const borderColor = useTransform(
        x,
        [-150, -50, 0, 50, 150],
        [
            "rgba(255, 120, 50, 0.8)",
            "rgba(255, 120, 50, 0.4)",
            "rgba(255, 255, 255, 0.1)",
            "rgba(255, 215, 0, 0.4)",
            "rgba(255, 215, 0, 0.8)",
        ]
    );

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        const threshold = 100;

        if (info.offset.x > threshold) {
            // Swipe right -> Complete
            triggerHapticFeedback("medium");
            onComplete(quest.id);
        } else if (info.offset.x < -threshold) {
            // Swipe left -> Fail
            triggerHapticFeedback("light");
            onFail(quest.id);
        }
    };

    const getColorClass = () => {
        if (identity.color === "orange") return NEON_COLORS.orange;
        if (identity.color === "violet") return NEON_COLORS.violet;
        return NEON_COLORS.cyan;
    };

    return (
        <motion.div
            style={{ x, background }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: x.get() > 0 ? 200 : -200 }}
            className="bg-card rounded-2xl p-5 border-2 transition-all cursor-grab active:cursor-grabbing touch-pan-y"
            whileTap={{ scale: 0.98 }}
        >
            {/* Indicateurs de swipe */}
            <motion.div
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none"
                style={{
                    opacity: useTransform(x, [-150, -50, 0], [1, 0.5, 0]),
                }}
            >
                <div className="w-12 h-12 rounded-full bg-neon-orange/30 flex items-center justify-center">
                    <X className="w-6 h-6 text-neon-orange" />
                </div>
            </motion.div>

            <motion.div
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none"
                style={{
                    opacity: useTransform(x, [0, 50, 150], [0, 0.5, 1]),
                }}
            >
                <div className="w-12 h-12 rounded-full bg-neon-gold/30 flex items-center justify-center">
                    <Check className="w-6 h-6 text-neon-gold" />
                </div>
            </motion.div>

            {/* Tag identité */}
            <div className="flex items-center gap-2 mb-3">
                <Badge className={getColorClass()}>
                    Identité : {identity.name}
                </Badge>
            </div>

            {/* Titre et description */}
            <div className="mb-4">
                <h3 className="text-xl font-semibold mb-1">{quest.title}</h3>
                {quest.description && (
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                )}
            </div>

            {/* Gain potentiel */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neon-gold">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">+{quest.xpReward} XP</span>
                    <span className="text-muted-foreground text-sm">
                        {identity.attributes[0]}
                    </span>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFail(quest.id);
                        }}
                        className="w-12 h-12 rounded-xl border-2 border-neon-orange bg-neon-orange/20 hover:bg-neon-orange/40 transition-colors"
                    >
                        <X className="w-6 h-6 text-neon-orange" />
                    </Button>
                    <Button
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onComplete(quest.id);
                        }}
                        className="w-12 h-12 rounded-xl border-2 border-neon-gold bg-neon-gold/20 hover:bg-neon-gold/40 transition-colors"
                    >
                        <Check className="w-6 h-6 text-neon-gold" />
                    </Button>
                </div>
            </div>

            {/* Instruction swipe */}
            <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-neon-gold rounded" />
                    <span>Swipe Droit</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>Swipe Gauche</span>
                    <div className="w-8 h-1 bg-neon-orange rounded" />
                </div>
            </div>
        </motion.div>
    );
}

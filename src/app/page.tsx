"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { triggerHapticFeedback } from "@/hooks/useSwipeGestures";
import { SplashScreen } from "@/components/SplashScreen";
import { BottomNav } from "@/components/BottomNav";
import { BuildModal } from "@/components/BuildModal";
import { RadarChart } from "@/components/RadarChart";
import { Onboarding } from "@/components/Onboarding";
import { IdentityCreationModal } from "@/components/IdentityCreationModal";
import { Sparkles, Shield, Target, BookOpen, Flame, Zap, TrendingUp, Check, X, Calendar, ChevronRight, Plus } from "lucide-react";

// Types
interface Identity {
  id: string;
  name: string;
  description: string;
  level: number;
  xp: number;
  color: string;
  attributes: string[];
}

interface Quest {
  id: string;
  title: string;
  description: string;
  linkedIdentity: string;
  xpReward: number;
  status: "pending" | "completed" | "failed" | "forged";
  completedAt?: Date;
  createdAt: Date;
}

interface Log {
  id: string;
  content: string;
  createdAt: Date;
  type: "victory" | "thought" | "reflection";
}

interface Lesson {
  id: string;
  questTitle: string;
  date: Date;
  resistance: string;
  lesson: string;
}

// Données de démonstration
const mockIdentities: Identity[] = [
  {
    id: "1",
    name: "Athlète",
    description: "Force et endurance mentale",
    level: 12,
    xp: 1150,
    color: "orange",
    attributes: ["Vitalité", "Discipline"],
  },
  {
    id: "2",
    name: "Écrivain",
    description: "Transforme mes idées en mots",
    level: 8,
    xp: 750,
    color: "violet",
    attributes: ["Créativité", "Discipline"],
  },
  {
    id: "3",
    name: "Entrepreneur",
    description: "Vision et action stratégique",
    level: 5,
    xp: 450,
    color: "cyan",
    attributes: ["Focus", "Sagesse"],
  },
];

const mockQuests: Quest[] = [
  {
    id: "1",
    title: "Courir 5km",
    description: "Séance de cardio du matin",
    linkedIdentity: "1",
    xpReward: 50,
    status: "pending",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Écrire 500 mots",
    description: "Continuer le chapitre 3",
    linkedIdentity: "2",
    xpReward: 40,
    status: "pending",
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Planifier la semaine",
    description: "Objectifs et priorités",
    linkedIdentity: "3",
    xpReward: 30,
    status: "pending",
    createdAt: new Date(),
  },
];

const mockLogs: Log[] = [
  {
    id: "1",
    content: "Victoire : J'ai réussi à méditer 10 minutes malgré le stress du travail !",
    createdAt: new Date(),
    type: "victory",
  },
  {
    id: "2",
    content: "Idée : Le prochain article pourrait parler de la gestion du temps créatif.",
    createdAt: new Date(),
    type: "thought",
  },
];

const mockLessons: Lesson[] = [
  {
    id: "1",
    questTitle: "Écriture quotidienne",
    date: new Date("2024-02-12"),
    resistance: "Fatigue",
    lesson: "Ne pas écrire après 22h, mon cerveau est éteint.",
  },
  {
    id: "2",
    questTitle: "Séance de sport",
    date: new Date("2024-02-10"),
    resistance: "Distraction",
    lesson: "Laisser le téléphone dans une autre pièce.",
  },
];

// Constantes
const ATTRIBUTE_COLORS = {
  Vitalité: "#22c55e",
  Discipline: "#06b6d4",
  Créativité: "#8b5cf6",
  Focus: "#f97316",
  Sagesse: "#eab308",
  Résilience: "#ef4444",
  Social: "#ec4899",
  Santé: "#14b8a6",
};

const NEON_COLORS = {
  orange: "text-neon-orange border-neon-orange",
  violet: "text-neon-violet border-neon-violet",
  cyan: "text-neon-cyan border-neon-cyan",
  gold: "text-neon-gold border-neon-gold",
};

export default function BecomePage() {
  const { toast } = useToast();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [logs, setLogs] = useState<Log[]>(mockLogs);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [showForgeDialog, setShowForgeDialog] = useState<Quest | null>(null);
  const [timeTravelValue, setTimeTravelValue] = useState(50); // 50 = aujourd'hui
  const [identities, setIdentities] = useState<Identity[]>([]);

  // Sauvegarder toutes les données dans localStorage à chaque changement
  useEffect(() => {
    if (identities.length > 0) {
      localStorage.setItem('become-identities', JSON.stringify(identities));
    }
  }, [identities]);

  useEffect(() => {
    localStorage.setItem('become-quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('become-logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('become-lessons', JSON.stringify(lessons));
  }, [lessons]);

  // Calcul de la progression de la journée
  const completedToday = quests.filter(q => q.status === "completed").length;
  const totalQuests = quests.length;
  const dayProgress = totalQuests > 0 ? (completedToday / totalQuests) * 100 : 0;

  // Calcul des attributs pour le radar chart
  const getAttributeData = () => {
    return Object.entries(ATTRIBUTE_COLORS).map(([name, color]) => {
      const value = identities.reduce((sum, id) => {
        if (id.attributes.includes(name)) {
          return sum + id.level * 10 + Math.floor(id.xp / 100);
        }
        return sum;
      }, 0);

      return {
        name,
        value,
        max: 200,
        color,
      };
    });
  };

  // Check if onboarding was already completed in localStorage and load ALL data
  useEffect(() => {
    // Load all data from localStorage
    const savedIdentities = localStorage.getItem('become-identities');
    const savedQuests = localStorage.getItem('become-quests');
    const savedLogs = localStorage.getItem('become-logs');
    const savedLessons = localStorage.getItem('become-lessons');
    const onboardingCompleted = localStorage.getItem('become-onboarding-completed');
    
    // Parse dates for quests
    const parseQuests = (data: string) => {
      const parsed = JSON.parse(data);
      return parsed.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt),
        completedAt: q.completedAt ? new Date(q.completedAt) : undefined,
      }));
    };

    // Parse dates for logs
    const parseLogs = (data: string) => {
      const parsed = JSON.parse(data);
      return parsed.map((l: any) => ({
        ...l,
        createdAt: new Date(l.createdAt),
      }));
    };

    // Parse dates for lessons
    const parseLessons = (data: string) => {
      const parsed = JSON.parse(data);
      return parsed.map((l: any) => ({
        ...l,
        date: new Date(l.date),
      }));
    };
    
    if (savedIdentities) {
      try {
        setIdentities(JSON.parse(savedIdentities));
      } catch (e) {
        console.error('Error parsing identities from localStorage:', e);
      }
    }
    
    if (savedQuests) {
      try {
        setQuests(parseQuests(savedQuests));
      } catch (e) {
        console.error('Error parsing quests from localStorage:', e);
      }
    }
    
    if (savedLogs) {
      try {
        setLogs(parseLogs(savedLogs));
      } catch (e) {
        console.error('Error parsing logs from localStorage:', e);
      }
    } else {
      // If no logs in storage, clear mock data
      setLogs([]);
    }
    
    if (savedLessons) {
      try {
        setLessons(parseLessons(savedLessons));
      } catch (e) {
        console.error('Error parsing lessons from localStorage:', e);
      }
    } else {
      // If no lessons in storage, clear mock data
      setLessons([]);
    }
    
    // Don't show onboarding if already completed
    if (onboardingCompleted === 'true' && savedIdentities && savedQuests) {
      setIsLoading(false);
      return;
    }
    
    // Otherwise, fetch from API
    const fetchData = async () => {
      try {
        // Fetch identities
        const idRes = await fetch('/api/onboarding/identities');
        const idData = await idRes.json();
        
        // Fetch quests
        const qRes = await fetch('/api/onboarding/quests');
        const qData = await qRes.json();
        
        if (idData.identities && idData.identities.length > 0) {
          // Map database identities to app format
          const mappedIdentities = idData.identities.map((id: any) => ({
            id: id.id,
            name: id.name,
            description: id.category,
            level: id.currentLevel,
            xp: id.totalXP,
            color: ['orange', 'violet', 'cyan', 'pink'][Math.floor(Math.random() * 4)],
            attributes: id.attributeProgress?.map((ap: any) => ap.attribute?.name) || [],
          }));
          setIdentities(mappedIdentities);
          // Save to localStorage
          localStorage.setItem('become-identities', JSON.stringify(mappedIdentities));
        }
        
        if (qData.quests && qData.quests.length > 0) {
          const mappedQuests = qData.quests.map((q: any) => ({
            id: q.id,
            title: q.title,
            description: q.description || '',
            linkedIdentity: q.identityId || '',
            xpReward: q.xpReward,
            status: q.completed ? 'completed' as const : 'pending' as const,
            createdAt: q.date,
          }));
          setQuests(mappedQuests);
          // Save to localStorage
          localStorage.setItem('become-quests', JSON.stringify(mappedQuests));
        }
        
        // Show onboarding if no identities exist
        if (!idData.identities || idData.identities.length === 0) {
          setShowOnboarding(true);
        } else {
          // Mark onboarding as completed
          localStorage.setItem('become-onboarding-completed', 'true');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // If API fails but we have localStorage data, use it
        if (!onboardingCompleted) {
          setShowOnboarding(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = async (data: { identities: any[], tasks: any[] }) => {
    try {
      // Transform data to app format
      const newIdentities = data.identities.map((id: any, index: number) => ({
        id: id.id,
        name: id.name,
        description: id.category,
        level: 1,
        xp: 0,
        color: ['orange', 'violet', 'cyan'][index % 3],
        attributes: id.attributes,
      }));
      
      const newQuests = data.tasks.map((task: any) => ({
        id: task.id,
        title: task.description,
        description: '',
        linkedIdentity: '',
        xpReward: task.xp,
        status: 'pending' as const,
        createdAt: new Date(),
      }));
      
      // Save to localStorage first
      localStorage.setItem('become-onboarding-completed', 'true');
      localStorage.setItem('become-identities', JSON.stringify(newIdentities));
      localStorage.setItem('become-quests', JSON.stringify(newQuests));
      
      // Update state
      setIdentities(newIdentities);
      setQuests(newQuests);
      setShowOnboarding(false);
      
      // Try to save to database (optional - don't block if it fails)
      try {
        const idRes = await fetch('/api/onboarding/identities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identities: data.identities }),
        });
        
        const qRes = await fetch('/api/onboarding/quests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tasks: data.tasks }),
        });
        
        if (idRes.ok && qRes.ok) {
          toast({
            title: 'Initialisation terminée !',
            description: 'Tes identités sont prêtes.',
          });
        }
      } catch (apiError) {
        console.error('API save failed, but data is saved locally:', apiError);
        toast({
          title: 'Mode hors-ligne',
          description: 'Tes identités sont créées localement.',
        });
      }
    } catch (error) {
      console.error('Error in onboarding complete:', error);
      
      // Fallback: save locally even if something goes wrong
      const newIdentities = data.identities.map((id: any, index: number) => ({
        id: id.id,
        name: id.name,
        description: id.category,
        level: 1,
        xp: 0,
        color: ['orange', 'violet', 'cyan'][index % 3],
        attributes: id.attributes,
      }));
      
      const newQuests = data.tasks.map((task: any) => ({
        id: task.id,
        title: task.description,
        description: '',
        linkedIdentity: '',
        xpReward: task.xp,
        status: 'pending' as const,
        createdAt: new Date(),
      }));
      
      localStorage.setItem('become-onboarding-completed', 'true');
      localStorage.setItem('become-identities', JSON.stringify(newIdentities));
      localStorage.setItem('become-quests', JSON.stringify(newQuests));
      
      setIdentities(newIdentities);
      setQuests(newQuests);
      setShowOnboarding(false);
      
      toast({
        title: 'Mode hors-ligne',
        description: 'Tes identités sont créées localement.',
      });
    }
  };

  const handleCompleteQuest = (questId: string) => {
    triggerHapticFeedback("medium");

    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    // Mettre à jour le statut de la quête
    setQuests(
      quests.map((q) =>
        q.id === questId ? { ...q, status: "completed", completedAt: new Date() } : q
      )
    );

    // Ajouter l'XP à l'identité liée
    setIdentities(
      identities.map((identity) => {
        if (identity.id === quest.linkedIdentity) {
          const newXP = identity.xp + quest.xpReward;
          const newLevel = Math.floor(newXP / 100) + 1;
          return {
            ...identity,
            xp: newXP,
            level: newLevel,
          };
        }
        return identity;
      })
    );

    const identity = identities.find((i) => i.id === quest?.linkedIdentity) || identities[0];

    toast({
      title: "Preuve Validée !",
      description: `+${quest?.xpReward} XP - ${identity?.name}`,
      className: "bg-card border-neon-gold neon-glow-gold",
    });
  };

  const handleFailQuest = (questId: string) => {
    triggerHapticFeedback("light");
    setShowForgeDialog(quests.find((q) => q.id === questId) || null);
  };

  const handleForgeSubmit = (resistance: string, lesson: string) => {
    if (!showForgeDialog) return;

    triggerHapticFeedback("medium");

    const newLesson: Lesson = {
      id: Date.now().toString(),
      questTitle: showForgeDialog.title,
      date: new Date(),
      resistance,
      lesson,
    };

    setLessons([newLesson, ...lessons]);
    setQuests(
      quests.map((q) =>
        q.id === showForgeDialog.id ? { ...q, status: "forged" } : q
      )
    );

    setShowForgeDialog(null);

    toast({
      title: "🔨 La Forge - Échec Transfiguré",
      description: "+20 XP de Sagesse - Tu as appris !",
      className: "bg-card border-neon-orange neon-glow-orange",
    });
  };

  const handleAddProof = (title: string, identityId: string, description?: string) => {
    const newQuest: Quest = {
      id: Date.now().toString(),
      title,
      description: description || "",
      linkedIdentity: identityId,
      xpReward: 50,
      status: "pending",
      createdAt: new Date(),
    };

    setQuests([...quests, newQuest]);
    setShowBuildModal(false); // Fermer le modal
    toast({
      title: "Nouvelle Preuve Créée",
      description: "Prêt à construire ton identité ?",
    });
  };

  const handleAddLog = (content: string) => {
    const newLog: Log = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      type: content.includes("victoire") ? "victory" : content.includes("idée") ? "thought" : "reflection",
    };

    setLogs([newLog, ...logs]);
    setShowBuildModal(false); // Fermer le modal
    setActiveTab("forge"); // Rediriger vers l'onglet La Forge (où sont les logs)
    toast({
      title: "Log Enregistré",
      description: "Ta pensée a été sauvegardée",
    });
  };

  const handleIdentityCreated = async (newIdentity: any) => {
    // Add new identity to local state
    const identityToAdd: Identity = {
      id: newIdentity.id || Date.now().toString(),
      name: newIdentity.name,
      description: newIdentity.category || newIdentity.description || '',
      level: 1,
      xp: 0,
      color: ['orange', 'violet', 'cyan', 'pink'][Math.floor(Math.random() * 4)],
      attributes: newIdentity.attributes || [],
    };
    
    const updatedIdentities = [...identities, identityToAdd];
    setIdentities(updatedIdentities);
    
    // Save to localStorage
    localStorage.setItem('become-identities', JSON.stringify(updatedIdentities));
    
    toast({
      title: 'Identité créée !',
      description: `${newIdentity.name} a été ajoutée à ta collection.`,
    });
    
    // Also try to save to API (optional)
    try {
      await fetch('/api/onboarding/identities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identities: [newIdentity] }),
      });
    } catch (error) {
      console.error('API save failed, but identity is saved locally:', error);
    }
  };

  // Splash Screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Onboarding Screen
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-20">
      {/* Contenu principal selon l'onglet actif */}
      <div className="flex-1">
        {/* Écran AUJOURD'HUI */}
        <AnimatePresence mode="wait">
          {activeTab === "today" && (
            <motion.div
              key="today"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-6"
            >
              {/* Header */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-neon-gold">
                    Bonjour, Voyageur
                  </h1>
                  <p className="text-muted-foreground">
                    Qui incarnes-tu aujourd'hui ?
                  </p>
                </div>

                {/* Progression globale de la journée */}
                <Card className="bg-gradient-to-r from-neon-gold/10 to-transparent border-neon-gold/50">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-neon-gold" />
                        <span className="font-semibold">Progression du jour</span>
                      </div>
                      <Badge className="bg-neon-gold text-black font-bold">
                        {Math.round(dayProgress)}%
                      </Badge>
                    </div>
                    <Progress value={dayProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      Tu as incarné tes identités à {Math.round(dayProgress)}% aujourd'hui
                    </p>
                  </div>
                </Card>
              </div>

              {/* Flux de Preuves */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="text-neon-orange" />
                  Tes Preuves du Jour
                </h2>

                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="space-y-4 pb-4">
                    {quests
                      .filter(q => q.status === "pending")
                      .map((quest) => {
                        const identity = identities.find(i => i.id === quest.linkedIdentity) || identities[0];
                        if (!identity) return null;

                        return (
                          <motion.div
                            key={quest.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card rounded-2xl p-5 border-2 border-border/20 hover:border-neon-orange/50 transition-all"
                          >
                            {/* Tag identité */}
                            <div className="flex items-center gap-2 mb-3">
                              <Badge
                                className={`${
                                  identity.color === "orange" ? NEON_COLORS.orange :
                                  identity.color === "violet" ? NEON_COLORS.violet :
                                  NEON_COLORS.cyan
                                }`}
                              >
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
                                  onClick={() => handleFailQuest(quest.id)}
                                  className="w-12 h-12 rounded-xl border-2 border-neon-orange bg-neon-orange/20 hover:bg-neon-orange/40 transition-colors"
                                >
                                  <X className="w-6 h-6 text-neon-orange" />
                                </Button>
                                <Button
                                  size="icon"
                                  onClick={() => handleCompleteQuest(quest.id)}
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
                      })}

                    {/* Aucune preuve */}
                    {quests.filter(q => q.status === "pending").length === 0 && (
                      <Card className="bg-card/50 border-dashed border-border/40 p-8 text-center">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-lg font-semibold mb-2">
                          Aucune preuve en attente
                        </p>
                        <p className="text-muted-foreground">
                          Utilise le bouton + pour ajouter une nouvelle preuve
                        </p>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Écran IDENTITÉS */}
        <AnimatePresence mode="wait">
          {activeTab === "identities" && (
            <motion.div
              key="identities"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold text-neon-violet mb-2">
                  Tes Identités
                </h1>
                <p className="text-muted-foreground">
                  Qui tu es en train de devenir
                </p>
              </div>

              {/* Radar Chart */}
              <Card className="bg-card/50 border-neon-violet/50">
                <div className="p-6 flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-6 text-center">
                    Répartition de tes Attributs
                  </h3>
                  <div className="relative">
                    <RadarChart attributes={getAttributeData()} size={280} />
                  </div>
                </div>
              </Card>

              {/* Time Travel */}
              <Card className="bg-gradient-to-r from-neon-violet/10 to-transparent border-neon-violet/50">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-neon-violet" />
                    <div>
                      <h3 className="font-semibold">Time Travel</h3>
                      <p className="text-sm text-muted-foreground">
                        Compare ton évolution
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Mois dernier</span>
                      <span>Aujourd'hui</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={timeTravelValue}
                      onChange={(e) => setTimeTravelValue(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-center text-sm text-neon-violet">
                      {timeTravelValue < 33 ? "Vue du mois dernier" :
                       timeTravelValue < 66 ? "Vue intermédiaire" :
                       "Vue actuelle"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Liste des Avatars */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="text-neon-gold" />
                    Tes Personnages
                  </h2>
                  <Button
                    size="sm"
                    onClick={() => setShowIdentityModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                {identities.length === 0 ? (
                  <Card className="bg-card/50 border-dashed border-border/40 p-8 text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-semibold mb-2">
                      Aucune identité créée
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Commence par créer ta première identité
                    </p>
                    <Button
                      onClick={() => setShowIdentityModal(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une identité
                    </Button>
                  </Card>
                ) : (
                  identities.map((identity) => (
                    <motion.div
                      key={identity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: parseInt(identity.id) * 0.1 }}
                      className="bg-card rounded-2xl p-5 border-2 border-border/20 hover:border-neon-gold/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{identity.name}</h3>
                          <p className="text-sm text-muted-foreground">{identity.description}</p>
                        </div>
                        <Badge className="bg-neon-gold text-black font-bold text-lg px-4 py-2">
                          Niveau {identity.level}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-neon-gold" />
                          <span className="text-sm text-muted-foreground">
                            XP Total : {identity.xp}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-neon-orange" />
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progression</span>
                              <span>{identity.xp % 100}/100</span>
                            </div>
                            <Progress value={identity.xp % 100} className="h-2" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                        {identity.attributes.map((attr) => (
                          <Badge
                            key={attr}
                            variant="outline"
                            className="text-xs border-neon-violet text-neon-violet"
                          >
                            {attr}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full mt-4 hover:bg-neon-violet/10"
                    >
                      Voir l'historique
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                  )))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Écran LA FORGE */}
        <AnimatePresence mode="wait">
          {activeTab === "forge" && (
            <motion.div
              key="forge"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold text-neon-orange mb-2">
                  La Forge
                </h1>
                <p className="text-muted-foreground">
                  Transforme le plomb (échec) en or (leçon)
                </p>
              </div>

              {/* Fil d'actualité des leçons */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="text-neon-orange" />
                  Tes Leçons
                </h2>

                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-4 pb-4">
                    {lessons.map((lesson) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-2xl p-5 border-2 border-neon-orange/50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-neon-gold mb-1">
                              {lesson.questTitle}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {new Date(lesson.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <Badge className="bg-neon-orange text-black">
                            +20 XP Sagesse
                          </Badge>
                        </div>

                        <div className="space-y-2 bg-background/50 rounded-lg p-4">
                          <div>
                            <p className="text-sm font-semibold text-neon-orange mb-1">
                              Résistance
                            </p>
                            <p className="text-sm">{lesson.resistance}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-neon-cyan mb-1">
                              Leçon apprise
                            </p>
                            <p className="text-sm">{lesson.lesson}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Aucune leçon */}
                    {lessons.length === 0 && (
                      <Card className="bg-card/50 border-dashed border-border/40 p-8 text-center">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-lg font-semibold mb-2">
                          Aucune leçon enregistrée
                        </p>
                        <p className="text-muted-foreground">
                          Transforme tes échecs en leçons via le bouton X sur tes preuves
                        </p>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Logs rapides */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-neon-violet" />
                  Logs Rapides
                </h2>

                <div className="space-y-3">
                  {logs.map((log) => {
                    const Icon = log.type === "victory" ? Sparkles :
                                log.type === "thought" ? BookOpen :
                                Flame;

                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card rounded-xl p-4 border border-border/20"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-neon-violet/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-neon-violet" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{log.content}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(log.createdAt).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Réflexion Hebdomadaire */}
              <Card className="bg-gradient-to-r from-neon-orange/10 to-transparent border-neon-orange/50">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-neon-orange" />
                    <div>
                      <h3 className="font-semibold">Réflexion Hebdomadaire</h3>
                      <p className="text-sm text-muted-foreground">
                        Résumé généré chaque dimanche soir
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-neon-orange text-neon-orange hover:bg-neon-orange/10"
                  >
                    Voir
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Écran RÉGLAGES */}
        <AnimatePresence mode="wait">
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold mb-2">Réglages</h1>
                <p className="text-muted-foreground">
                  Configure ton expérience BECOME
                </p>
              </div>

              {/* Profil */}
              <Card className="bg-card/50">
                <div className="p-5 space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-neon-gold" />
                    Profil
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Prénom
                      </label>
                      <input
                        type="text"
                        defaultValue="Voyageur"
                        className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Citation préférée
                      </label>
                      <input
                        type="text"
                        defaultValue="L'excellence est une habitude, pas un acte."
                        className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Apparence */}
              <Card className="bg-card/50">
                <div className="p-5 space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-neon-violet" />
                    Apparence
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mode Sombre</p>
                      <p className="text-sm text-muted-foreground">
                        Interface immersive gamer
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-neon-gold text-neon-gold"
                    >
                      Activé
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="bg-card/50">
                <div className="p-5 space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-neon-orange" />
                    Notifications
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rappel Matinal</p>
                        <p className="text-sm text-muted-foreground">
                          "Qui incarnes-tu aujourd'hui ?"
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-neon-orange text-neon-orange"
                      >
                        07:00
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rappel du Soir</p>
                        <p className="text-sm text-muted-foreground">
                          "Valide tes preuves du jour"
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-neon-orange text-neon-orange"
                      >
                        21:00
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Basse */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBuildClick={() => setShowBuildModal(true)}
      />

      {/* Modal BUILD */}
      <BuildModal
        isOpen={showBuildModal}
        onClose={() => setShowBuildModal(false)}
        identities={identities}
        onAddProof={handleAddProof}
        onAddLog={handleAddLog}
      />

      {/* Modal La Forge pour réflexion sur l'échec */}
      <AnimatePresence>
        {showForgeDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForgeDialog(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border-2 border-neon-orange w-full max-w-lg rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-neon-orange/20 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-neon-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">La Forge</h3>
                  <p className="text-sm text-muted-foreground">
                    {showForgeDialog.title}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neon-orange mb-2 block font-semibold">
                    Quelle a été la résistance ?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Fatigue", "Peur", "Distraction", "Manque de temps", "Motivation", "Autre"].map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        className="border-border/20 hover:border-neon-orange hover:bg-neon-orange/10"
                        onClick={() => {
                          // Pour l'instant, on sélectionne et on continue
                          // Dans une vraie implémentation, on aurait un état pour stocker la résistance
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-neon-cyan mb-2 block font-semibold">
                    Quelle est la leçon pour demain ?
                  </label>
                  <textarea
                    placeholder="Que feras-tu différemment ?"
                    className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 min-h-24"
                    id="forge-lesson"
                  />
                </div>

                <Button
                  onClick={() => {
                    const resistanceEl = document.querySelector('button[class*="neon-orange/10"]') as HTMLButtonElement;
                    const lessonEl = document.getElementById('forge-lesson') as HTMLTextAreaElement;
                    if (lessonEl?.value) {
                      handleForgeSubmit(
                        resistanceEl?.textContent || "Autre",
                        lessonEl.value
                      );
                    }
                  }}
                  className="w-full h-14 text-lg bg-neon-orange hover:bg-neon-orange/90"
                >
                  <Flame className="w-5 h-5 mr-2" />
                  Transfigurer en XP (+20 Sagesse)
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal création d'identité */}
      <IdentityCreationModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        onIdentityCreated={handleIdentityCreated}
      />
    </div>
  );
}

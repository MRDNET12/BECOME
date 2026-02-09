"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Plus, BookOpen, Target } from "lucide-react";

interface Identity {
  id: string;
  name: string;
  color: string;
}

interface BuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  identities: Identity[];
  onAddProof: (title: string, identityId: string, description?: string) => void;
  onAddLog: (content: string) => void;
}

export function BuildModal({ isOpen, onClose, identities, onAddProof, onAddLog }: BuildModalProps) {
  const [mode, setMode] = useState<"proof" | "log" | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [identityId, setIdentityId] = useState("");
  const [logContent, setLogContent] = useState("");

  // Reset form when modal closes
  const handleClose = () => {
    setMode(null);
    setTitle("");
    setDescription("");
    setIdentityId("");
    setLogContent("");
    onClose();
  };

  const handleAddProof = () => {
    if (!title || !identityId) return;
    onAddProof(title, identityId, description);
    handleClose();
  };

  const handleAddLog = () => {
    if (!logContent.trim()) return;
    onAddLog(logContent);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && !mode && (
        <motion.div
          key="menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-t border-border/20 w-full max-w-lg rounded-t-3xl p-6"
          >
            <div className="w-12 h-1 bg-border/40 rounded-full mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neon-gold mb-6 text-center">
              Que veux-tu construire ?
            </h2>
            <div className="space-y-4">
              <Button
                onClick={() => setMode("proof")}
                className="w-full h-20 text-lg bg-gradient-to-r from-neon-orange to-orange-600 hover:from-neon-orange/90 hover:to-orange-600/90"
                size="lg"
              >
                <Target className="w-6 h-6 mr-3" />
                Ajouter une Preuve
              </Button>
              <Button
                onClick={() => setMode("log")}
                className="w-full h-20 text-lg bg-gradient-to-r from-neon-violet to-purple-600 hover:from-neon-violet/90 hover:to-purple-600/90"
                size="lg"
              >
                <BookOpen className="w-6 h-6 mr-3" />
                Log Rapide (Micro-Journaling)
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mode Ajouter Preuve */}
      <AnimatePresence>
        {isOpen && mode === "proof" && (
          <motion.div
            key="proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neon-orange/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-neon-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ajouter une Preuve</h3>
                    <p className="text-sm text-muted-foreground">Crée une nouvelle quête</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="hover:bg-destructive/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="proof-title">Quelle action vas-tu accomplir ?</Label>
                  <Input
                    id="proof-title"
                    placeholder="Ex: Courir 5km, Écrire 500 mots..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 bg-background/50 text-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="proof-identity">Pour quelle identité ?</Label>
                  <Select value={identityId} onValueChange={setIdentityId}>
                    <SelectTrigger className="mt-2 bg-background/50">
                      <SelectValue placeholder="Choisir une identité" />
                    </SelectTrigger>
                    <SelectContent>
                      {identities.map((identity) => (
                        <SelectItem key={identity.id} value={identity.id}>
                          {identity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="proof-description">Description (optionnel)</Label>
                  <Textarea
                    id="proof-description"
                    placeholder="Détails supplémentaires..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 bg-background/50"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleAddProof}
                  disabled={!title || !identityId}
                  className="w-full h-14 text-lg bg-neon-orange hover:bg-neon-orange/90"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer la Preuve
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Log Rapide */}
      <AnimatePresence>
        {isOpen && mode === "log" && (
          <motion.div
            key="log"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border-2 border-neon-violet w-full max-w-lg rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neon-violet/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-neon-violet" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Log Rapide</h3>
                    <p className="text-sm text-muted-foreground">Micro-journaling</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="hover:bg-destructive/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="log-content">Victoire inattendue ou pensée fugitive</Label>
                  <Textarea
                    id="log-content"
                    placeholder="Note une victoire, une idée ou un moment de gratitude..."
                    value={logContent}
                    onChange={(e) => setLogContent(e.target.value)}
                    className="mt-2 bg-background/50 min-h-32 text-lg"
                    rows={5}
                  />
                </div>

                <Button
                  onClick={handleAddLog}
                  disabled={!logContent.trim()}
                  className="w-full h-14 text-lg bg-neon-violet hover:bg-neon-violet/90"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Enregistrer le Log
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

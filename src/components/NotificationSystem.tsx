"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, Clock, Sun, Moon, Plus, Trash2, Check, Sparkles } from "lucide-react";

interface ScheduledNotification {
  id: string;
  type: "morning" | "evening" | "custom";
  time: string;
  message: string;
  enabled: boolean;
  frequency: "daily" | "weekly";
}

interface NotificationSystemProps {
  notifications: ScheduledNotification[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, notification: Partial<ScheduledNotification>) => void;
  onDelete: (id: string) => void;
  onAdd: (notification: ScheduledNotification) => void;
}

export function NotificationSystem({ notifications, onToggle, onUpdate, onDelete, onAdd }: NotificationSystemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: "morning" as const,
    time: "07:00",
    message: "",
    frequency: "daily" as const,
  });

  const defaultNotifications: ScheduledNotification[] = [
    {
      id: "morning-default",
      type: "morning",
      time: "07:00",
      message: "Qui incarnes-tu aujourd'hui ?",
      enabled: true,
      frequency: "daily",
    },
    {
      id: "evening-default",
      type: "evening",
      time: "21:00",
      message: "Valide tes preuves du jour",
      enabled: true,
      frequency: "daily",
    },
  ];

  const allNotifications = [...defaultNotifications, ...notifications];

  const handleAdd = () => {
    if (newNotification.message) {
      onAdd({
        id: `custom-${Date.now()}`,
        type: newNotification.type,
        time: newNotification.time,
        message: newNotification.message,
        enabled: true,
        frequency: newNotification.frequency,
      });
      setShowAddForm(false);
      setNewNotification({
        type: "morning",
        time: "07:00",
        message: "",
        frequency: "daily",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    if (type === "morning") return Sun;
    if (type === "evening") return Moon;
    return Bell;
  };

  const getNotificationTypeLabel = (type: string) => {
    if (type === "morning") return "Rappel Matinal";
    if (type === "evening") return "Rappel du Soir";
    return "Personnalisée";
  };

  const getNotificationColor = (type: string) => {
    if (type === "morning") return "text-neon-orange border-neon-orange";
    if (type === "evening") return "text-neon-violet border-neon-violet";
    return "text-neon-cyan border-neon-cyan";
  };

  const enabledCount = allNotifications.filter(n => n.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header avec statut */}
      <Card className="bg-gradient-to-r from-neon-cyan/10 to-transparent border-2 border-neon-cyan/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <BellRing className="w-8 h-8 text-neon-cyan" />
            </motion.div>
            <div>
              <p className="text-lg font-bold">Notifications</p>
              <p className="text-sm text-muted-foreground">
                {enabledCount} notification(s) active(s)
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="h-12 w-12 bg-neon-gold hover:bg-neon-gold/90 text-black rounded-full"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </Card>

      {/* Formulaire d'ajout */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-br from-neon-gold/10 to-transparent border-2 border-neon-gold/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-neon-gold" />
                Nouvelle Notification
              </h3>
              <div className="space-y-4">
                {/* Type de notification */}
                <div>
                  <label className="text-sm text-neon-gold mb-2 block font-semibold">
                    Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["morning", "evening", "custom"].map((type) => (
                      <Button
                        key={type}
                        variant={newNotification.type === type ? "default" : "outline"}
                        onClick={() => setNewNotification({ ...newNotification, type: type as any })}
                        className={`
                          ${newNotification.type === type
                            ? 'bg-neon-gold text-black'
                            : 'bg-card/50 hover:bg-neon-gold/10'
                          }
                        `}
                      >
                        {type === "morning" && "☀️ Matinal"}
                        {type === "evening" && "🌙 Soir"}
                        {type === "custom" && "🎯 Personnalisé"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Heure */}
                <div>
                  <label className="text-sm text-neon-gold mb-2 block font-semibold">
                    Heure
                  </label>
                  <Input
                    type="time"
                    value={newNotification.time}
                    onChange={(e) => setNewNotification({ ...newNotification, time: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm text-neon-gold mb-2 block font-semibold">
                    Message
                  </label>
                  <Input
                    placeholder="Ex: Tes avatars attendent..."
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                {/* Fréquence */}
                <div>
                  <label className="text-sm text-neon-gold mb-2 block font-semibold">
                    Fréquence
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={newNotification.frequency === "daily" ? "default" : "outline"}
                      onClick={() => setNewNotification({ ...newNotification, frequency: "daily" })}
                      className={`
                        ${newNotification.frequency === "daily"
                          ? 'bg-neon-gold text-black'
                          : 'bg-card/50 hover:bg-neon-gold/10'
                        }
                      `}
                    >
                      Quotidienne
                    </Button>
                    <Button
                      variant={newNotification.frequency === "weekly" ? "default" : "outline"}
                      onClick={() => setNewNotification({ ...newNotification, frequency: "weekly" })}
                      className={`
                        ${newNotification.frequency === "weekly"
                          ? 'bg-neon-gold text-black'
                          : 'bg-card/50 hover:bg-neon-gold/10'
                        }
                      `}
                    >
                      Hebdomadaire
                    </Button>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleAdd}
                    disabled={!newNotification.message}
                    className="flex-1 bg-neon-gold hover:bg-neon-gold/90 text-black"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {allNotifications.map((notification, index) => {
          const Icon = getNotificationIcon(notification.type);
          const typeLabel = getNotificationTypeLabel(notification.type);
          const typeColor = getNotificationColor(notification.type);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`
                bg-card rounded-xl border-2 p-4 transition-all
                ${notification.enabled ? typeColor : 'border-border/40 opacity-60'}
              `}>
                <div className="flex items-start gap-4">
                  {/* Icône et informations */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.enabled ? typeColor.split(' ')[0] : 'bg-background/30'}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`
                          text-xs ${notification.enabled ? typeColor : 'text-muted-foreground border-border/30'}
                        `}>
                          {typeLabel}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground border-border/30">
                          {notification.frequency === "daily" ? "Quotidienne" : "Hebdomadaire"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notification.enabled}
                          onChange={() => onToggle(notification.id)}
                        />
                        {!notification.id.startsWith("default-") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(notification.id)}
                            className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Heure */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">
                        {notification.time}
                      </span>
                      <Badge className="ml-auto" variant="outline">
                        {notification.frequency === "daily" ? "📅 Tous les jours" : "📆 Chaque semaine"}
                      </Badge>
                    </div>

                    {/* Message */}
                    {notification.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-background/50 rounded-lg p-3"
                      >
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-neon-gold flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground">
                            {notification.message}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Message info */}
      <Card className="bg-gradient-to-r from-neon-violet/10 via-neon-cyan/10 to-neon-orange/10 border-2 border-neon-gold/30 p-4">
        <div className="flex items-start gap-3">
          <BellRing className="w-5 h-5 text-neon-gold flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Les notifications apparaîtront aux heures programmées pour te rappeler tes engagements et célébrer tes progrès.
          </p>
        </div>
      </Card>
    </div>
  );
}

// Toggle switch simple
function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`
        relative w-12 h-7 rounded-full transition-colors duration-200
        ${checked ? 'bg-neon-green' : 'bg-border/40'}
      `}
    >
      <motion.div
        initial={false}
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
      />
    </button>
  );
}

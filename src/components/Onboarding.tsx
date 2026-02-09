'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ArrowRight, Plus, Minus, Check, Sparkles, Target, Shield, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Identity {
  id: string;
  name: string;
  category: string;
  attributes: string[];
}

interface Task {
  id: string;
  identityName: string;
  description: string;
  time: string;
  xp: number;
}

type Step = 'welcome' | 'create-identity' | 'select-attributes' | 'create-tasks' | 'complete';

const CATEGORIES = [
  'Professionnel',
  'Sport & Santé',
  'Créatif',
  'Leadership',
  'Spirituel',
  'Social',
  'Intellectuel',
];

const ATTRIBUTES_BY_CATEGORY: Record<string, string[]> = {
  'Professionnel': ['Discipline', 'Productivité', 'Organisation', 'Focus', 'Communication'],
  'Sport & Santé': ['Vitalité', 'Endurance', 'Force', 'Régularité', 'Récupération'],
  'Créatif': ['Créativité', 'Inspiration', 'Expression', 'Courage', 'Originalité'],
  'Leadership': ['Charisme', 'Confiance', 'Empathie', 'Stratégie', 'Influence'],
  'Spirituel': ['Sagesse', 'Paix', 'Méditation', 'Gratitude', 'Connexion'],
  'Social': ['Charité', 'Écoute', 'Soutien', 'Présence', 'Générosité'],
  'Intellectuel': ['Curiosité', 'Analyse', 'Apprentissage', 'Mémoire', 'Logique'],
};

const DEFAULT_ATTRIBUTES = ['Discipline', 'Créativité', 'Focus', 'Vitalité', 'Sagesse'];

const QUOTES = [
  '"Tu n\'es pas qui tu es. Tu es ce que tu fais."',
  '"Chaque jour est une opportunité de devenir une meilleure version de toi-même."',
  '"Les actions d\'aujourd\'hui définissent qui tu seras demain."',
];

export function Onboarding({ onComplete }: { onComplete: (data: { identities: Identity[], tasks: Task[] }) => void }) {
  const [step, setStep] = useState<Step>('welcome');
  const [currentIdentity, setCurrentIdentity] = useState<Partial<Identity>>({
    id: '',
    name: '',
    category: '',
    attributes: [],
  });
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({
    id: '',
    identityName: '',
    description: '',
    time: '07:00',
    xp: 50,
  });
  const [customAttribute, setCustomAttribute] = useState('');
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('onboarding-progress');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.identities?.length > 0) setIdentities(data.identities);
      if (data.tasks?.length > 0) setTasks(data.tasks);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const data = { identities, tasks };
    localStorage.setItem('onboarding-progress', JSON.stringify(data));
  }, [identities, tasks]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addCustomAttribute = () => {
    if (!customAttribute.trim()) return;
    if (currentIdentity.attributes?.includes(customAttribute.trim())) return;
    if ((currentIdentity.attributes?.length || 0) >= 5) {
      alert('Maximum 5 attributs par identité');
      return;
    }
    setCurrentIdentity({
      ...currentIdentity,
      attributes: [...(currentIdentity.attributes || []), customAttribute.trim()],
    });
    setCustomAttribute('');
  };

  const removeAttribute = (attr: string) => {
    setCurrentIdentity({
      ...currentIdentity,
      attributes: (currentIdentity.attributes || []).filter((a) => a !== attr),
    });
  };

  const toggleAttribute = (attr: string) => {
    const attrs = currentIdentity.attributes || [];
    if (attrs.includes(attr)) {
      setCurrentIdentity({
        ...currentIdentity,
        attributes: attrs.filter((a) => a !== attr),
      });
    } else if (attrs.length < 5) {
      setCurrentIdentity({
        ...currentIdentity,
        attributes: [...attrs, attr],
      });
    }
  };

  const addIdentity = () => {
    if (!currentIdentity.name || !currentIdentity.category) {
      alert('Veuillez remplir le nom et la catégorie de l\'identité');
      return;
    }

    // Only allow one identity during onboarding
    if (identities.length >= 1) {
      return;
    }

    const newIdentity: Identity = {
      id: currentIdentity.id || generateId(),
      name: currentIdentity.name,
      category: currentIdentity.category,
      attributes: currentIdentity.attributes || [],
    };

    setIdentities([newIdentity]); // Only one identity
    setCurrentIdentity({
      id: '',
      name: '',
      category: '',
      attributes: [],
    });
  };

  const addTask = () => {
    if (!currentTask.identityName || !currentTask.description) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newTask: Task = {
      id: currentTask.id || generateId(),
      identityName: currentTask.identityName,
      description: currentTask.description,
      time: currentTask.time || '07:00',
      xp: currentTask.xp || 50,
    };

    setTasks([...tasks, newTask]);
    setCurrentTask({
      id: '',
      identityName: currentTask.identityName,
      description: '',
      time: '07:00',
      xp: 50,
    });
  };

  const handleComplete = () => {
    console.log('handleComplete appelé - identities:', identities.length, 'tasks:', tasks.length);
    
    if (identities.length === 0) {
      console.log('Erreur : aucune identité');
      alert('Veuillez créer au moins une identité');
      return;
    }
    
    console.log('Appel de onComplete avec', { identities, tasks });
    onComplete({ identities, tasks });
  };

  const renderWelcome = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center space-y-8 p-6"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative mb-4"
      >
        <div className="absolute inset-0 bg-neon-gold/20 blur-2xl rounded-full" />
        <Crown className="w-24 h-24 text-neon-gold relative z-10 drop-shadow-2xl" />
      </motion.div>
      
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-gold to-orange-500 bg-clip-text text-transparent">
          Bienvenue sur BECOME
        </h1>
        <p className="text-2xl text-gray-600 font-light">"{quote}"</p>
      </div>

      <Button
        onClick={() => setStep('create-identity')}
        className="bg-gradient-to-r from-neon-gold to-orange-500 hover:from-neon-gold/80 hover:to-orange-500/80 text-white font-bold px-12 py-6 text-xl border-2 border-neon-gold shadow-lg shadow-neon-gold/50"
      >
        Commencer mon voyage
        <ArrowRight className="ml-2 w-6 h-6" />
      </Button>
    </motion.div>
  );

  const renderCreateIdentity = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 p-4"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-neon-violet">Qui veux-tu devenir ?</h2>
      </div>

      {identities.length === 0 ? (
        /* Identity Form - only show if no identity created */
        <Card className="p-6 space-y-6 bg-gradient-to-br from-card to-card/50 border-2 border-neon-violet/50">
          <div className="space-y-3">
            <label className="text-base font-bold text-gray-700 uppercase tracking-wide">Nom de l'identité</label>
            <Input
              placeholder="Ex: Professionnel Productif..."
              value={currentIdentity.name}
              onChange={(e) => setCurrentIdentity({ ...currentIdentity, name: e.target.value })}
              className="h-14 text-lg border-2 border-neon-violet/30 focus:border-neon-violet"
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-bold text-gray-700 uppercase tracking-wide">Catégorie</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant={currentIdentity.category === cat ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all text-base px-4 py-2 ${
                    currentIdentity.category === cat 
                      ? 'bg-neon-violet text-white border-neon-violet shadow-lg shadow-neon-violet/50' 
                      : 'border-neon-violet/30 hover:border-neon-violet hover:bg-neon-violet/10'
                  }`}
                  onClick={() => setCurrentIdentity({ ...currentIdentity, category: cat })}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={addIdentity}
            className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/50"
          >
            <Plus className="mr-2 w-5 h-5" />
            Créer mon identité
          </Button>
        </Card>
      ) : (
        /* Show the created identity */
        <Card className="p-5 bg-gradient-to-br from-card to-card/30 border-2 border-neon-gold/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-gold/20 to-orange-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-neon-gold" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">{identities[0].name}</p>
              <Badge variant="secondary" className="text-sm">{identities[0].category}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIdentities([])}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              <Minus className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}

      <div className="flex gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => setStep('welcome')}
          className="flex-1 h-14 border-2 text-lg"
        >
          Retour
        </Button>
        {identities.length > 0 && (
          <Button
            onClick={() => setStep('select-attributes')}
            className="flex-1 h-14 bg-gradient-to-r from-neon-gold to-orange-500 hover:from-neon-gold/80 hover:to-orange-500/80 text-white font-bold text-lg border-2 border-neon-gold shadow-lg shadow-neon-gold/50"
          >
            Continuer
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>
    </motion.div>
  );

  const renderSelectAttributes = () => {
    const identity = identities[0];
    const suggestedAttributes = ATTRIBUTES_BY_CATEGORY[identity.category] || DEFAULT_ATTRIBUTES;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6 p-4"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-neon-violet mb-2">Définis tes Attributs</h2>
          <p className="text-sm text-gray-500">Choisis ceux qui définissent ton identité</p>
        </div>

        <Card className="p-6 space-y-4 bg-gradient-to-br from-card to-card/50 border-2 border-neon-violet/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-violet to-pink-500 flex items-center justify-center shadow-lg shadow-neon-violet/50">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-neon-violet">{identity.name}</h3>
              <Badge variant="secondary" className="text-sm">{identity.category}</Badge>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Attributs suggérés <span className="text-neon-violet">({identity.attributes.length}/5)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedAttributes.map((attr) => (
                  <Badge
                    key={attr}
                    variant={identity.attributes.includes(attr) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all text-base px-4 py-2 ${
                      identity.attributes.includes(attr)
                        ? 'bg-neon-violet text-white border-neon-violet shadow-lg shadow-neon-violet/50'
                        : 'border-neon-violet/30 hover:border-neon-violet hover:bg-neon-violet/10'
                    }`}
                    onClick={() => {
                      if (identity.attributes.includes(attr)) {
                        // Remove attribute
                        setIdentities([{
                          ...identity,
                          attributes: identity.attributes.filter((a) => a !== attr),
                        }]);
                      } else if (identity.attributes.length < 5) {
                        // Add attribute
                        setIdentities([{
                          ...identity,
                          attributes: [...identity.attributes, attr],
                        }]);
                      }
                    }}
                  >
                    {identity.attributes.includes(attr) && <Check className="mr-1 w-4 h-4 inline" />}
                    {attr}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Attribute Input */}
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Attribut personnalisé</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter ton propre attribut..."
                  value={customAttribute}
                  onChange={(e) => setCustomAttribute(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (customAttribute.trim() && identity.attributes.length < 5) {
                        setIdentities([{
                          ...identity,
                          attributes: [...identity.attributes, customAttribute.trim()],
                        }]);
                        setCustomAttribute('');
                      }
                    }
                  }}
                  className="flex-1 h-12 border-2 border-neon-violet/30 focus:border-neon-violet"
                  disabled={identity.attributes.length >= 5}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (customAttribute.trim() && identity.attributes.length < 5) {
                      setIdentities([{
                        ...identity,
                        attributes: [...identity.attributes, customAttribute.trim()],
                      }]);
                      setCustomAttribute('');
                    }
                  }}
                  disabled={!customAttribute.trim() || identity.attributes.length >= 5}
                  className="bg-neon-violet hover:bg-neon-violet/80 text-white px-4"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selected Attributes */}
            {identity.attributes.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-neon-violet/20">
                {identity.attributes.map((attr) => (
                  <Badge
                    key={attr}
                    className="bg-neon-violet text-white text-base px-4 py-2 shadow-lg shadow-neon-violet/50 flex items-center gap-2"
                  >
                    {attr}
                    <button
                      onClick={() => {
                        setIdentities([{
                          ...identity,
                          attributes: identity.attributes.filter((a) => a !== attr),
                        }]);
                      }}
                      className="hover:text-neon-gold transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setStep('create-identity')}
            className="flex-1 h-14 border-2 text-lg"
          >
            Retour
          </Button>
          <Button
            onClick={() => setStep('create-tasks')}
            disabled={identity.attributes.length === 0}
            className="flex-1 h-14 bg-gradient-to-r from-neon-gold to-orange-500 hover:from-neon-gold/80 hover:to-orange-500/80 text-white font-bold text-lg border-2 border-neon-gold shadow-lg shadow-neon-gold/50"
          >
            Suivant
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    );
  };

  const renderCreateTasks = () => {
    const identity = identities[0];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6 p-4"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-neon-violet mb-2">Tes Preuves Quotidiennes</h2>
          <p className="text-sm text-gray-500">Quelles preuves vas-tu te donner aujourd'hui ?</p>
        </div>

        <Card className="p-6 space-y-4 bg-gradient-to-br from-card to-card/50 border-2 border-neon-gold/30 hover:border-neon-gold/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-gold to-orange-500 flex items-center justify-center shadow-lg shadow-neon-gold/50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-xl text-neon-gold">{identity.name}</p>
              <p className="text-sm text-gray-600">
                Quelles sont tes preuves aujourd'hui ?
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Ex: Méditer 15 minutes, Courir 5km..."
              value={currentTask.description}
              onChange={(e) => setCurrentTask({
                ...currentTask,
                identityName: identity.name,
                description: e.target.value,
              })}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="h-12 border-2 border-neon-gold/30 focus:border-neon-gold text-base"
            />
            <div className="flex gap-2">
              <Input
                type="time"
                value={currentTask.time}
                onChange={(e) => setCurrentTask({
                  ...currentTask,
                  identityName: identity.name,
                  time: e.target.value,
                })}
                className="w-36 h-12 border-2 border-neon-gold/30 focus:border-neon-gold"
              />
              <Button
                onClick={addTask}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-lg shadow-green-500/50"
              >
                <Plus className="mr-2 w-5 h-5" />
                Ajouter
              </Button>
            </div>
          </div>

          {/* Tasks list */}
          {tasks.length > 0 && (
            <div className="space-y-2 pt-2 border-t-2 border-neon-gold/20">
              {tasks.map(task => (
                <Card key={task.id} className="p-4 flex items-center justify-between bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                  <div>
                    <p className="font-semibold">{task.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs border-green-500 text-green-600">{task.time}</Badge>
                      <Badge variant="outline" className="text-xs border-neon-gold text-orange-500">+{task.xp} XP</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setStep('select-attributes')}
            className="flex-1 h-14 border-2 text-lg"
          >
            Retour
          </Button>
          <Button
            onClick={handleComplete}
            className="flex-1 h-14 bg-gradient-to-r from-neon-gold to-orange-500 hover:from-neon-gold/80 hover:to-orange-500/80 text-white font-bold text-lg border-2 border-neon-gold shadow-lg shadow-neon-gold/50"
          >
            Commencer
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 'welcome' && renderWelcome()}
            {step === 'create-identity' && renderCreateIdentity()}
            {step === 'select-attributes' && renderSelectAttributes()}
            {step === 'create-tasks' && renderCreateTasks()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

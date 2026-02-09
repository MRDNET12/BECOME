'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Target, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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

interface IdentityCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdentityCreated: (identity: any) => void;
}

export function IdentityCreationModal({ isOpen, onClose, onIdentityCreated }: IdentityCreationModalProps) {
  const [step, setStep] = useState<'info' | 'attributes'>('info');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [attributes, setAttributes] = useState<string[]>([]);
  const [customAttribute, setCustomAttribute] = useState('');

  const handleSubmit = async () => {
    if (!name || !category) {
      alert('Veuillez remplir le nom et la catégorie');
      return;
    }

    if (attributes.length === 0) {
      alert('Veuillez sélectionner au moins un attribut');
      return;
    }

    const identity = {
      name,
      category,
      attributes,
    };

    try {
      const res = await fetch('/api/identities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(identity),
      });

      if (res.ok) {
        const data = await res.json();
        onIdentityCreated(data.identity);
        handleClose();
      } else {
        alert('Erreur lors de la création de l\'identité');
      }
    } catch (error) {
      console.error('Error creating identity:', error);
      alert('Erreur lors de la création de l\'identité');
    }
  };

  const handleClose = () => {
    setStep('info');
    setName('');
    setCategory('');
    setAttributes([]);
    setCustomAttribute('');
    onClose();
  };

  const addCustomAttribute = () => {
    if (!customAttribute.trim()) return;
    if (attributes.includes(customAttribute.trim())) return;
    if (attributes.length >= 5) {
      alert('Maximum 5 attributs par identité');
      return;
    }
    setAttributes([...attributes, customAttribute.trim()]);
    setCustomAttribute('');
  };

  const removeAttribute = (attr: string) => {
    setAttributes(attributes.filter((a) => a !== attr));
  };

  const suggestedAttributes = ATTRIBUTES_BY_CATEGORY[category] || DEFAULT_ATTRIBUTES;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      >
        <motion.div
          initial={{ y: '100%', scale: 0.9 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: '100%', scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-card sm:rounded-2xl rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neon-violet">
              {step === 'info' ? 'Nouvelle Identité' : 'Définir les Attributs'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="hover:bg-red-500/10"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex-1 h-2 rounded-full ${step === 'info' ? 'bg-gradient-to-r from-neon-violet to-pink-500' : 'bg-neon-violet'}`} />
            <div className={`flex-1 h-2 rounded-full ${step === 'attributes' ? 'bg-gradient-to-r from-neon-violet to-pink-500' : 'bg-gray-300'}`} />
          </div>

          {/* Step 1: Info */}
          {step === 'info' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-neon-violet/10 to-pink-500/10 rounded-xl border-2 border-neon-violet/30">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-violet to-pink-500 flex items-center justify-center shadow-lg shadow-neon-violet/50">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Crée une nouvelle identité</p>
                  <p className="text-sm text-gray-600">Définis qui tu veux devenir</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-base font-bold text-gray-700 uppercase tracking-wide">Nom de l'identité</label>
                  <Input
                    placeholder="Ex: Artiste Créatif..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-lg border-2 border-neon-violet/30 focus:border-neon-violet"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-bold text-gray-700 uppercase tracking-wide">Catégorie</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <Badge
                        key={cat}
                        variant={category === cat ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all text-base px-4 py-2 ${
                          category === cat 
                            ? 'bg-neon-violet text-white border-neon-violet shadow-lg shadow-neon-violet/50' 
                            : 'border-neon-violet/30 hover:border-neon-violet hover:bg-neon-violet/10'
                        }`}
                        onClick={() => setCategory(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep('attributes')}
                disabled={!name || !category}
                className="w-full h-12 bg-gradient-to-r from-neon-violet to-pink-500 hover:from-neon-violet/80 hover:to-pink-500/80 text-white font-bold text-lg border-2 border-neon-violet shadow-lg shadow-neon-violet/50"
              >
                Continuer
              </Button>
            </motion.div>
          )}

          {/* Step 2: Attributes */}
          {step === 'attributes' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 space-y-4 bg-gradient-to-br from-card to-card/50 border-2 border-neon-violet/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-violet to-pink-500 flex items-center justify-center shadow-lg shadow-neon-violet/50">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-neon-violet">{name}</h3>
                    <Badge variant="secondary" className="text-sm">{category}</Badge>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Attributs suggérés <span className="text-neon-violet">({attributes.length}/5)</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedAttributes.map((attr) => (
                        <Badge
                          key={attr}
                          variant={attributes.includes(attr) ? 'default' : 'outline'}
                          className={`cursor-pointer transition-all text-base px-4 py-2 ${
                            attributes.includes(attr)
                              ? 'bg-neon-violet text-white border-neon-violet shadow-lg shadow-neon-violet/50'
                              : 'border-neon-violet/30 hover:border-neon-violet hover:bg-neon-violet/10'
                          }`}
                          onClick={() => {
                            if (attributes.includes(attr)) return;
                            if (attributes.length >= 5) return;
                            setAttributes([...attributes, attr]);
                          }}
                        >
                          {attributes.includes(attr) && <Check className="mr-1 w-4 h-4 inline" />}
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
                            addCustomAttribute();
                          }
                        }}
                        className="flex-1 h-12 border-2 border-neon-violet/30 focus:border-neon-violet"
                        disabled={attributes.length >= 5}
                      />
                      <Button
                        size="sm"
                        onClick={addCustomAttribute}
                        disabled={!customAttribute.trim() || attributes.length >= 5}
                        className="bg-neon-violet hover:bg-neon-violet/80 text-white px-4 h-12"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Selected Attributes */}
                  {attributes.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-neon-violet/20">
                      {attributes.map((attr) => (
                        <Badge
                          key={attr}
                          className="bg-neon-violet text-white text-base px-4 py-2 shadow-lg shadow-neon-violet/50 flex items-center gap-2"
                        >
                          {attr}
                          <button
                            onClick={() => removeAttribute(attr)}
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

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('info')}
                  className="flex-1 h-12 border-2 text-lg"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={attributes.length === 0}
                  className="flex-1 h-12 bg-gradient-to-r from-neon-violet to-pink-500 hover:from-neon-violet/80 hover:to-pink-500/80 text-white font-bold text-lg border-2 border-neon-violet shadow-lg shadow-neon-violet/50"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer l'identité
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

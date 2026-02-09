# BECOME - Projet de Productivité Gamifiée

## 🎯 Vision et Philosophie

**"Tu ne poursuis pas seulement des objectifs. Tu construis la personne capable de les atteindre."**

BECOME est une application de productivité inversée qui ne gère pas des tâches, mais l'évolution de votre "Personnage". C'est un mélange innovant de :
- Gestionnaire d'habitudes
- RPG (Jeu de rôle)
- Journaling Stoïcien

## ✨ Fonctionnalités Principales

### 1. **Onboarding - Qui veux-tu devenir ?**
- Création d'Avatars (Identités) avec des attributs personnalisés
- Sélection de 1 à 3 identités cibles (ex: "Écrivain Prolifique", "Athlète Hybride")
- Définition d'attributs : Discipline, Créativité, Focus, Vitalité, Sagesse, Résilience

### 2. **Système de Quêtes - Les Preuves**
- Les tâches sont des "Quêtes" liées à vos identités
- Chaque quête accomplie vous rapproche de votre identité cible
- Validation par boutons (succès/échec) ou swipe sur mobile
- Gain d'XP dans les attributs associés

### 3. **La Forge - Gestion de l'Échec**
- Fonctionnalité signature qui transforme l'échec en progression
- Processus de réflexion guidée :
  - Identifier la résistance (Fatigue, Peur, Distraction, etc.)
  - Extraire une leçon pour demain
- Récompense en XP de Sagesse/Résilience
- L'échec analysé devient une victoire

### 4. **Gamification RPG**
- **Système de niveaux** : Barre de progression visuelle pour chaque identité
- **Attributs** : 6 stats principales avec des couleurs néon distinctes
- **Système d'XP** : Calcul automatique du niveau basé sur l'XP accumulée
- **Feedback visuel** : Animations de level-up, particules dorées

### 5. **Dashboard "Miroir"**
- Visualisation de l'évolution du "Personnage Actuel" vs "Personnage Cible"
- Statistiques globales (Niveau, XP total, Quêtes complétées)
- Répartition des attributs avec barres de progression
- Résumé hebdomadaire des progrès

### 6. **Expérience PWA**
- **Progressive Web App** : Installable sur mobile
- **Offline-first** : Service worker pour fonctionnement hors ligne
- **Haptic Feedback** : Vibration lors des actions sur mobile
- **Dark Mode** : Thème gamer par défaut

## 🎨 Design & UI

### Thème Visuel
- **Dark Mode par défaut** : Fond noir profond / Gris ardoise
- **Accents Néon** :
  - Cyan pour la Sagesse
  - Orange pour la Force/Résilience
  - Violet pour la Créativité
  - Vert pour la Vitalité
  - Or pour la Progression/Level Up

### Typographie
- Police Mono pour les stats (style code/technique)
- Sans-Serif moderne pour le texte

### Animations
- Framer Motion pour des transitions fluides
- Animation de level-up avec effet scale et glow
- Particules dorées pour les célébrations
- Effets hover sur les éléments interactifs

## 🏗️ Architecture Technique

### Stack Technologique
- **Framework** : Next.js 16 avec App Router
- **Language** : TypeScript 5
- **Styling** : Tailwind CSS 4 + shadcn/ui
- **Animations** : Framer Motion
- **State Management** : Zustand + React Hooks
- **Database** : Prisma ORM + SQLite
- **PWA** : Service Worker + Manifest.json

### Structure des Données

#### Modèles Prisma
```prisma
User          # Utilisateurs
Identity      # Identités cibles (Avatars)
Attribute     # Attributs de personnage
IdentityLevel # Lien Identité-Attribut (XP de base)
UserAttributeProgress # Progression utilisateur par attribut
Quest         # Quêtes/Tâches
Reflection    # Réflexions de La Forge
```

#### API Routes
- `GET/POST /api/identities` - Gestion des identités
- `GET/POST/PATCH/DELETE /api/quests` - Gestion des quêtes

### PWA Configuration
- Manifest PWA pour installation
- Service Worker pour cache offline
- Viewport mobile-first
- Thème color adaptatif

## 📱 Parcours Utilisateur

### Matin - Engagement
1. Notification : "Qui incarnes-tu aujourd'hui ?"
2. Sélection des 3 quêtes du jour
3. Affichage des identités actives

### Journée - Action
- L'application reste silencieuse
- L'utilisateur accompli ses quêtes

### Soir - Récolte
1. **Validation des quêtes**
   - ✅ Swipe Droit / Bouton Vert = Succès (+XP attribut)
   - ❌ Swipe Gauche / Bouton Orange = Échec

2. **Si succès** :
   - Animation de level-up si applicable
   - Particules dorées

3. **Si échec** :
   - Ouverture de "La Forge"
   - Réflexion guidée (2 questions)
   - Gain d'XP de Sagesse/Résilience

### Hebdomadaire - Revue
- Dashboard montrant l'évolution
- Comparaison des stats
- Résumé des progrès

## 🎮 Personas Cibles

### L'Entrepreneur
- Objectif : Voir la progression en compétences quand les résultats financiers tardent
- Besoin : Visualisation de la croissance personnelle

### L'Étudiant / L'Apprenant
- Objectif : Gamifier les révisions
- Besoin : Système de récompenses immédiates

### Le Dépressif Fonctionnel / En quête de sens
- Objectif : Reconstruire l'estime de soi par petites victoires
- Besoin : Transformer l'échec en apprentissage

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- Bun (recommandé) ou npm

### Installation
```bash
# Installer les dépendances
bun install

# Pousser le schéma de base de données
bun run db:push

# Démarrer le serveur de développement
bun run dev
```

### L'application sera disponible sur :
- Local : http://localhost:3000
- Preview Panel (droite de l'interface)

### Commandes Utiles
```bash
# Linting
bun run lint

# Database operations
bun run db:push      # Pousser le schéma
bun run db:generate  # Générer le client Prisma
bun run db:reset     # Reset la base de données
```

## 📦 Fonctionnalités Implémentées

### ✅ Phase 1 - Le Squelette
- [x] Architecture de base Next.js 16
- [x] Configuration PWA (manifest, service worker)
- [x] Base de données Prisma avec tous les modèles
- [x] API routes pour Identities et Quests

### ✅ Phase 2 - Logique RPG
- [x] Système d'XP et de niveaux
- [x] Progression des attributs
- [x] Dashboard avec visualisation des stats
- [x] Thème dark gaming avec couleurs néon

### ✅ Phase 3 - La Forge & UX
- [x] Module de réflexion après échec
- [x] Animations de validation et level-up
- [x] Haptic feedback pour mobile
- [x] Service worker pour offline

### 🔲 Roadmap Future
- [ ] Swipe gestures avancés (drag & drop)
- [ ] Système de notifications push
- [ ] Sauvegarde cloud et synchronisation
- [ ] Graphiques radar des compétences
- [ ] Système d'achievements/badges
- [ ] Partage des progrès sur réseaux sociaux

## 🎨 Personnalisation

### Couleurs Néon (CSS Variables)
```css
--neon-cyan: oklch(0.7 0.15 190);     /* Cyan - Sagesse */
--neon-orange: oklch(0.75 0.18 35);   /* Orange - Force */
--neon-violet: oklch(0.7 0.18 280);   /* Violet - Créativité */
--neon-green: oklch(0.75 0.15 145);   /* Vert - Vitalité */
--neon-gold: oklch(0.8 0.12 85);      /* Or - Progression */
```

### Attributs Configurables
- Discipline (Cyan)
- Créativité (Violet)
- Focus (Orange)
- Vitalité (Vert)
- Sagesse (Cyan)
- Résilience (Orange)

## 📝 Notes de Développement

### Architecture Mobile-First
- Interface optimisée pour mobile
- Swipe gestures pour validation rapide
- Boutons tactiles (min 44px)
- Viewport adaptatif

### Performance
- Turbopack pour dev rapide
- Service worker pour cache
- Lazy loading des composants
- Optimisation des images

### Accessibilité
- Mode sombre par défaut
- Contraste WCAG AA
- Navigation clavier
- Screen reader support

## 🤝 Contribution

Le projet BECOME est conçu pour être évolutif. Les améliorations possibles incluent :

1. **Synchronisation multi-device** : Comptes utilisateurs avec auth
2. **Analytics avancés** : Graphiques d'évolution temporelle
3. **IA Coach** : Suggestions de quêtes personnalisées
4. **Social** : Système de guildes ou défis entre amis
5. **Intégrations** : Google Calendar, Notion, etc.

## 📄 Licence

Projet BECOME - Code de démonstration pour le cahier des charges.

---

**"Ne cherchez pas à devenir un homme de succès, mais un homme de valeur."** - Albert Einstein

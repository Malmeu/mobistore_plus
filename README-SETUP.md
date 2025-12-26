# Mobistore Plus - Guide d'Installation

## 🚀 Configuration du Projet

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de Supabase

#### A. Créer un compte Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **URL du projet** et votre **clé anon publique**

#### B. Créer la base de données
1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Copiez le contenu du fichier `supabase-schema.sql`
3. Collez-le dans l'éditeur SQL et exécutez-le
4. Vérifiez que les tables sont créées dans **Table Editor**

#### C. Configurer les variables d'environnement
1. Copiez le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Éditez le fichier `.env` et ajoutez vos identifiants Supabase :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_anon_publique
   ```

### 3. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure du Projet

```
mobistore-plus/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── pages/              # Pages de l'application
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   ├── lib/                # Configuration et utilitaires
│   │   └── supabase.ts
│   ├── types/              # Types TypeScript
│   │   └── index.ts
│   ├── App.tsx             # Composant principal
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── supabase-schema.sql     # Schéma de base de données
└── README-SETUP.md         # Ce fichier
```

## 🎨 Fonctionnalités

- ✅ Design moderne avec couleurs pastel et arrondis
- ✅ Navigation responsive avec menu mobile
- ✅ Catalogue de produits avec filtres et tri
- ✅ Système de panier avec localStorage
- ✅ Processus de commande complet
- ✅ Intégration Supabase pour la base de données
- ✅ Support des 58 wilayas d'Algérie

## 🛠️ Technologies Utilisées

- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Supabase** - Base de données et backend
- **React Router** - Navigation
- **Lucide React** - Icônes

## 📝 Prochaines Étapes

1. Personnaliser les images des produits
2. Ajouter une page de détail produit
3. Implémenter la recherche
4. Ajouter un système d'authentification admin
5. Créer un dashboard admin pour gérer les produits
6. Intégrer un système de paiement (CCP, Baridimob, etc.)
7. Ajouter un système de suivi de commande

## 🎯 Pour Déployer en Production

### Option 1: Vercel
```bash
npm run build
# Puis déployez le dossier dist/ sur Vercel
```

### Option 2: Netlify
```bash
npm run build
# Puis déployez le dossier dist/ sur Netlify
```

N'oubliez pas d'ajouter vos variables d'environnement dans les paramètres de déploiement !

## 📞 Support

Pour toute question ou problème, contactez-nous !

---

**Mobistore Plus** - Votre destination pour les accessoires mobiles en Algérie 🇩🇿

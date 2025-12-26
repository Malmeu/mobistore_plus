# Configuration de l'authentification Admin

## 📋 Étapes de configuration

### 1. Créer un compte admin dans Supabase

1. Allez dans votre projet Supabase
2. Cliquez sur **Authentication** dans le menu latéral
3. Cliquez sur **Users**
4. Cliquez sur **Add user** → **Create new user**
5. Remplissez les informations :
   - **Email** : votre email admin (ex: `admin@mobistore.com`)
   - **Password** : un mot de passe sécurisé
   - Cochez **Auto Confirm User** pour éviter la vérification par email
6. Cliquez sur **Create user**

### 2. Réexécuter le schéma SQL

Les politiques RLS ont été mises à jour pour exiger l'authentification :

```sql
-- Dans Supabase SQL Editor, exécutez :
-- supabase-schema.sql
```

Les nouvelles politiques vérifient que `auth.uid() IS NOT NULL`, ce qui signifie que seuls les utilisateurs authentifiés peuvent :
- Modifier les produits
- Gérer les prix de livraison
- Modifier les images de produits
- Mettre à jour le statut des commandes

### 3. Se connecter à l'admin

1. Allez sur `/login`
2. Entrez l'email et le mot de passe créés dans Supabase
3. Vous serez redirigé vers `/admin`

### 4. Déconnexion

Un bouton **Déconnexion** est disponible en haut à droite du dashboard admin.

## 🔒 Sécurité

### Protection des routes

La route `/admin` est protégée par le composant `ProtectedRoute` qui :
- Vérifie la session Supabase
- Redirige vers `/login` si non authentifié
- Affiche un loader pendant la vérification

### Politiques RLS

Les politiques RLS (Row Level Security) garantissent que :
- ✅ Tout le monde peut **lire** les produits, catégories, commandes
- ✅ Tout le monde peut **créer** des commandes (clients)
- ✅ Seuls les utilisateurs **authentifiés** peuvent modifier les produits, prix, images
- ✅ Seuls les utilisateurs **authentifiés** peuvent mettre à jour le statut des commandes

## 🚀 Amélioration future (optionnel)

Pour une sécurité renforcée, vous pouvez créer une table `admin_users` :

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Puis modifier les politiques pour vérifier :
-- auth.uid() IN (SELECT user_id FROM admin_users)
```

Cela permettrait de gérer plusieurs admins avec différents niveaux d'accès.

## ⚠️ Important

- Ne partagez jamais les identifiants admin
- Utilisez un mot de passe fort
- Activez l'authentification à deux facteurs (2FA) dans Supabase si possible
- Les sessions expirent automatiquement après un certain temps

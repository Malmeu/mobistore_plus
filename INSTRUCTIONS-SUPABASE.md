# Instructions de configuration Supabase

## 1. Configuration de la base de données

### Étape 1 : Exécuter le schéma principal
1. Allez dans votre projet Supabase
2. Cliquez sur "SQL Editor" dans le menu de gauche
3. Créez une nouvelle requête
4. Copiez le contenu du fichier `supabase-schema.sql`
5. Exécutez la requête

**Note :** Si vous avez déjà exécuté ce script et que vous obtenez des erreurs de duplication, c'est normal. Le script utilise maintenant `ON CONFLICT DO NOTHING` pour éviter les erreurs.

## 2. Configuration du Storage (Images)

### Étape 2 : Créer le bucket pour les images

**Option A : Via l'interface Supabase (Recommandé)**
1. Allez dans "Storage" dans le menu de gauche
2. Cliquez sur "New bucket"
3. Nom du bucket : `products`
4. Cochez "Public bucket"
5. Cliquez sur "Create bucket"

**Option B : Via SQL**
1. Dans "SQL Editor", créez une nouvelle requête
2. Copiez le contenu du fichier `supabase-storage-setup.sql`
3. Exécutez la requête

### Étape 3 : Configurer les politiques de sécurité (si Option A)

Si vous avez créé le bucket via l'interface, vous devez ajouter les politiques :

1. Allez dans "Storage" > "Policies"
2. Sélectionnez le bucket "products"
3. Ajoutez les politiques suivantes :

**Politique 1 : Lecture publique**
```sql
CREATE POLICY "Permettre la lecture publique des images produits"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');
```

**Politique 2 : Upload public**
```sql
CREATE POLICY "Permettre l'upload public des images produits"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');
```

**Politique 3 : Mise à jour**
```sql
CREATE POLICY "Permettre la mise à jour des images produits"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products');
```

**Politique 4 : Suppression**
```sql
CREATE POLICY "Permettre la suppression des images produits"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');
```

## 3. Configuration des variables d'environnement

### Étape 4 : Récupérer vos clés Supabase

1. Allez dans "Settings" > "API"
2. Copiez :
   - **Project URL** (commence par https://xxxxx.supabase.co)
   - **anon public** key (clé publique)

### Étape 5 : Configurer le fichier .env

Ouvrez le fichier `.env` à la racine du projet et ajoutez :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-publique-ici
```

## 4. Tester la configuration

### Étape 6 : Vérifier que tout fonctionne

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Accédez à `/admin`

3. Testez :
   - ✅ Ajout d'un produit avec upload d'image
   - ✅ Modification d'un produit
   - ✅ Suppression d'un produit
   - ✅ Configuration des prix de livraison

4. Testez la page produit :
   - Allez sur `/products`
   - Cliquez sur un produit
   - Remplissez le formulaire de commande
   - Vérifiez que le prix de livraison s'affiche correctement

## 5. Configuration des prix de livraison

### Étape 7 : Définir les prix par wilaya

1. Allez sur `/admin`
2. Cliquez sur "Prix de livraison"
3. Définissez les prix pour chaque wilaya
4. Laissez à 0 pour la livraison gratuite
5. Cliquez sur "Enregistrer"

## Résolution des problèmes courants

### Erreur : "duplicate key value violates unique constraint"
✅ **Solution :** Le script a été mis à jour avec `ON CONFLICT DO NOTHING`. Réexécutez-le.

### Erreur : "Failed to upload image"
✅ **Solution :** Vérifiez que :
- Le bucket "products" existe
- Le bucket est public
- Les politiques de sécurité sont configurées

### Erreur : "Failed to fetch products"
✅ **Solution :** Vérifiez que :
- Les variables d'environnement sont correctes dans `.env`
- Le schéma SQL a été exécuté
- Les politiques RLS sont activées

### Les prix de livraison ne s'affichent pas
✅ **Solution :** 
- Configurez les prix dans `/admin` > "Prix de livraison"
- Vérifiez que la table `delivery_settings` existe

## Support

Si vous rencontrez des problèmes, vérifiez :
1. Les logs de la console du navigateur (F12)
2. Les logs Supabase dans "Logs" > "API"
3. Que toutes les tables ont été créées correctement

# Discord Automation GUI

Cette documentation explique comment récupérer votre token Discord et présente en détail toutes les fonctionnalités de l’application.

## Récupération de votre token Discord

Pour utiliser l’application, vous devez fournir un token Discord valide. Ce token permet à l’application d’agir en votre nom et d’interagir avec l’API Discord.

Suivez ces étapes pour le récupérer :
1. Ouvrez l’application Discord (version desktop).
2. Appuyez sur `Ctrl + Maj + I` (Windows/Linux) ou `Cmd + Option + I` (macOS) pour ouvrir les outils de développement.
3. Dans l’onglet « Réseau », filtrez les requêtes par « /users/@me ».
4. Sélectionnez la première requête, puis consultez l’en-tête `Authorization`.
5. Copiez la valeur associée et collez-la dans le champ « Token Discord » de l’interface.

Autre méthode : 
1. Suivez les mêmes étapes pour ouvrir les outils de développement. 
2. Rendez-vous dans l'onglet `Application > Storage > LocalStorage.
3. Cliquez sur **https://discord.com/**, puis activez le mode responsive.
4. Alors, filtrez par le mot-clé `token` et sélectionnez le texte brut dans la section **Value**.

L’application validera automatiquement le token et affichera un message de confirmation.

## Fonctionnalités principales

### Validation du token

Dès la saisie du token, l’application le vérifie auprès de l’API Discord. Un indicateur de statut informe si le token est valide ou non. En cas d’échec, un message d’erreur détaillé s’affiche.

### Sélection du mode d’opération

Vous pouvez choisir entre deux modes de suppression :

* **Serveur** : suppression dans un serveur (guild).
* **Message privé** : suppression dans une conversation directe ou de groupe.

### Choix du serveur et du salon

En mode **Serveur**, vous pouvez :

1. Sélectionner un serveur parmi la liste récupérée.
2. Choisir un salon spécifique ou laisser le champ vide pour cibler tous les salons accessibles.

En mode **Message privé**, sélectionnez la conversation privée ou de groupe souhaitée.

### Configuration de la suppression

#### Plage de messages

* **Nombre maximal** : définissez le nombre de messages à parcourir (valeur entre 1 et 100000, par défaut 100).
* **Ordre** : choisissez l’ordre de traitement des messages (`Anciens → récents` ou `Récents → anciens`).

#### Filtrage par date et par ID

* **Date** : délimitez un intervalle (`De` / `À`) entre 2000 et 2100 pour ne supprimer que les messages datés dans cette plage.
* **ID** : définissez un ID minimum et/ou maximum (17 chiffres ou plus) pour cibler une plage d’identifiants.

#### Filtrage par mots-clés

Saisissez des mots-clés séparés par des virgules ou des espaces. Seuls les messages contenant au moins l’un de ces mots seront supprimés.

#### Filtrage par type de contenu

Cochez les cases pour supprimer :

* Tout type de contenu
* Fichiers (images, exécutables)
* Liens (GIFs, intégrations)
* Messages textuels
* Messages vocaux

Cocher « Tout supprimer » désactive automatiquement les autres filtres.

### Contrôle du processus

* **Lancer** : démarre l’automatisme de suppression selon la configuration.
* **Suspendre temporairement** : met en pause la suppression sans interrompre la connexion.
* **Reprendre** : relance le processus après une pause.
* **Stopper** : annule le processus en cours et libère les ressources.

### Suivi et journalisation

Les opérations sont journalisées en temps réel dans la zone dédiée.

* Chaque action est horodatée et affichée avec un code couleur selon le niveau (`info`, `avertissement`, `erreur`, `suppression`).
* Le bouton « Copier les logs » permet de copier l’intégralité du journal dans le presse-papier pour analyse ultérieure.

### Mode « Streamer »

Ce mode masque le contenu sensible des logs en temps réel.
Activez-le ou désactivez-le via l’icône en forme d’œil : le journal alterne entre affichage complet et affichage protégé.

## Fonctionnalités système (icône de la barre)

L’application s’intègre dans la barre système (Windows, macOS et Linux).
Le menu contextuel propose :

* **Afficher/Cacher la fenêtre** : bascule la visibilité de l’interface.
* **Redémarrer l’application** : relance l’exécutable.
* **À propos** : affiche la version et les informations du projet.
* **Contribuer au projet** : ouvre le dépôt GitHub.
* **Quitter l’application** : ferme l’application proprement.

## Mise à jour automatique

En version packagée, l’application vérifie et télécharge automatiquement les mises à jour disponibles via `electron-updater`. Aucune action supplémentaire n’est requise de votre part.

---

Ce document couvre l’intégralité des fonctionnalités accessibles via l’interface et le code présenté. Il est conçu pour être pédagogique et vous permettre d’exploiter l’application en toute autonomie.

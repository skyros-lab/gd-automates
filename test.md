# 🕵️ Discord Automation GUI
Ce programme open-source propose des automatismes sûrs pour le réseau social Discord à des fins éthiques et d'apprentissage uniquement.  
Cette documentation explique comment récupérer votre token Discord et présente en détail toutes les fonctionnalités de l’application.

---

<p align="center">
  <a href="https://github.com/skyros-lab/gd-automates/releases/latest">
    <img alt="Download" src="https://img.shields.io/badge/Télécharger-dernière%20release-blue?style=for-the-badge&logo=github">
  </a>
</p>

[![Made with Electron](https://img.shields.io/badge/Electron-%2320232a?logo=electron&logoColor=white)](https://www.electronjs.org/)  
[![JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow?logo=javascript)](https://developer.mozilla.org/fr/docs/Web/JavaScript)  
[![Platforms](https://img.shields.io/badge/OS-Windows%20%7C%20macOS%20%7C%20Linux-informational?logo=windows&logoColor=white)](#)  
[![Node](https://img.shields.io/badge/node-%3E=18.x-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Auto Update](https://img.shields.io/badge/Update-Automatique-success)](#mise-à-jour-automatique)  
[![Release](https://img.shields.io/github/v/release/skyros-lab/gd-automates)](https://github.com/skyros-lab/gd-automates/releases)  
[![Downloads](https://img.shields.io/github/downloads/skyros-lab/gd-automates/total?label=téléchargements%20total)](https://github.com/skyros-lab/gd-automates/releases)  
[![Last Commit](https://img.shields.io/github/last-commit/skyros-lab/gd-automates)](https://github.com/skyros-lab/gd-automates/commits)  
[![Code Size](https://img.shields.io/github/languages/code-size/skyros-lab/gd-automates)](https://github.com/skyros-lab/gd-automates)  
[![Stars](https://img.shields.io/github/stars/skyros-lab/gd-automates?style=social)](https://github.com/skyros-lab/gd-automates/stargazers)

> **Note** : Ce README utilise GitHub Flavored Markdown (GFM) pour offrir une navigation interactive et une présentation claire.

---

## 🧭 Sommaire

- [Téléchargement](#-téléchargement)  
- [Récupération du token Discord](#récupération-de-votre-token-discord)  
- [Fonctionnalités principales](#fonctionnalités-principales)  
- [Fonctionnalités système (icône de la barre)](#fonctionnalités-système-icône-de-la-barre)  
- [Mise à jour automatique](#mise-à-jour-automatique)  
- [À propos](#-à-propos)  

---

<details>
<summary>## 📦 Téléchargement</summary>

[![Dernière version](https://img.shields.io/github/v/release/skyros-lab/gd-automates?label=version)](https://github.com/skyros-lab/gd-automates/releases/latest)  
[![Téléchargement Windows](https://img.shields.io/badge/Windows-.exe-blue?logo=windows95&logoColor=white)](https://github.com/skyros-lab/gd-automates/releases/latest/download/GD-Automates-Setup.exe)  
[![Téléchargement macOS](https://img.shields.io/badge/macOS-.dmg-blue?logo=apple&logoColor=white)](https://github.com/skyros-lab/gd-automates/releases/latest/download/GD-Automates.dmg)  
[![Téléchargement Linux](https://img.shields.io/badge/Linux-.AppImage-blue?logo=linux&logoColor=white)](https://github.com/skyros-lab/gd-automates/releases/latest/download/GD-Automates.AppImage)

La dernière version stable de l’application est disponible ici :  
https://github.com/skyros-lab/gd-automates/releases/latest

**Formats disponibles** :

| Système  | Formats                                |
|----------|----------------------------------------|
| Windows  | `.exe` (exécutable autonome), `.zip`   |
| macOS    | `.dmg` (installateur), `.zip`          |
| Linux    | `.AppImage`, `.deb`, `.tar.gz`         |

Aucune installation n’est requise.  
Téléchargez le fichier adapté, puis lancez l’exécutable ou extrayez l’archive.

</details>

---

<details>
<summary>## Récupération de votre token Discord</summary>

Pour utiliser l’application, vous devez fournir un token Discord valide. Ce token permet à l’application d’agir en votre nom et d’interagir avec l’API Discord.

1. Ouvrez l’application Discord (version desktop).  
2. Appuyez sur <code>Ctrl + Maj + I</code> (Windows/Linux) ou <code>Cmd + Option + I</code> (macOS) pour ouvrir les outils de développement.  
3. Dans l’onglet « Réseau », filtrez les requêtes par « /users/@me ».  
4. Sélectionnez la première requête, puis consultez l’en-tête <code>Authorization</code>.  
5. Copiez la valeur et collez-la dans le champ « Token Discord » de l’interface.  

<details>
<summary>Autre méthode (LocalStorage)</summary>

1. Dans les DevTools, ouvrez l’onglet <code>Application</code> → <code>Storage</code> → <code>LocalStorage</code>.  
2. Cliquez sur <code>https://discord.com/</code> et activez le mode responsive.  
3. Filtrez par le mot-clé <code>token</code> et copiez la valeur dans <code>Value</code>.

</details>

L’application validera automatiquement le token et affichera un message de confirmation.

</details>

---

<details>
<summary>## Fonctionnalités principales</summary>

### Validation du token
Dès la saisie du token, l’application le vérifie auprès de l’API Discord. Un indicateur de statut informe si le token est valide ou non. En cas d’échec, un message d’erreur détaillé s’affiche.

### Sélection du mode d’opération
Vous pouvez choisir entre deux modes de suppression :  
- **Serveur** : suppression dans un serveur (guild).  
- **Message privé** : suppression dans une conversation directe ou de groupe.

### Choix du serveur et du salon
En mode **Serveur** :  
1. Sélectionnez un serveur parmi la liste récupérée.  
2. Choisissez un salon spécifique ou laissez vide pour cibler tous les salons.

En mode **Message privé**, sélectionnez la conversation souhaitée.

### Configuration de la suppression
#### Plage de messages
- **Nombre maximal** : 1–100 000 (par défaut 100)  
- **Ordre** : Anciens → récents ou Récents → anciens

#### Filtrage par date et par ID
- **Date** : intervalle `De` / `À` entre 2000 et 2100  
- **ID** : ID minimum et/ou maximum (17 chiffres ou plus)

#### Filtrage par mots-clés
Entrez des mots-clés séparés par des virgules ou espaces. Seuls les messages contenant au moins un mot seront supprimés.

#### Filtrage par type de contenu
Cochez pour supprimer :  
- Tout type de contenu  
- Fichiers (images, exécutables)  
- Liens (GIFs, intégrations)  
- Messages textuels  
- Messages vocaux  

Cochez « Tout supprimer » pour désactiver les autres filtres.

### Contrôle du processus
- **Lancer** : démarre l’automatisme  
- **Suspendre** : met en pause sans déconnecter  
- **Reprendre** : relance après pause  
- **Stopper** : annule et libère les ressources

### Suivi et journalisation
Les opérations sont journalisées en temps réel :  
- Horodatage et code couleur (`info`, `avertissement`, `erreur`, `suppression`)  
- **Copier les logs** pour analyse ultérieure

### Mode « Streamer »
Masque le contenu sensible des logs. Activez/désactivez via l’icône en forme d’œil.

</details>

---

<details>
<summary>## Fonctionnalités système (icône de la barre)</summary>

L’application s’intègre dans la barre système (Windows, macOS et Linux).  
Le menu contextuel propose :  
- **Afficher/Cacher la fenêtre**  
- **Redémarrer l’application**  
- **À propos** : version et infos  
- **Contribuer au projet** : ouvre le dépôt GitHub  
- **Quitter l’application** : ferme proprement

</details>

---

<details>
<summary>## Mise à jour automatique</summary>

En version packagée, l’application vérifie et télécharge automatiquement les mises à jour via `electron-updater`.  
Aucune action supplémentaire n’est requise.

</details>

---

## 👤 À propos

Développé par [@skyros-lab](https://github.com/skyros-lab), ce projet open-source vise à fournir une interface intuitive pour interagir avec l’API Discord.  
Il est conçu exclusivement pour un usage personnel, éducatif et conforme aux conditions d’utilisation de Discord.  

> Ce projet n’est ni affilié, ni soutenu par Discord Inc.

---

## ✋ Envie de contribuer ?

- [Issues](https://github.com/skyros-lab/gd-automates/issues)  
- [Pull Requests](https://github.com/skyros-lab/gd-automates/pulls)  
Forkez, étoilez et améliorez !  

# 🕵️ Discord Automation GUI
Ce programme open-source propose des automatismes sûrs pour le réseau social Discord à des fins éthiques et d’apprentissage uniquement.  
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

---

## 📦 Téléchargement

[![Dernière version](https://img.shields.io/github/v/release/skyros-lab/gd-automates?label=version)](https://github.com/skyros-lab/gd-automates/releases/latest)
[![Téléchargement Windows](https://img.shields.io/badge/Windows-.exe-blue?logo=windows95&logoColor=white)](https://github.com/skyros-lab/gd-automates/releases/latest)
[![Téléchargement macOS](https://img.shields.io/badge/macOS-.dmg-blue?logo=apple&logoColor=white)](https://github.com/skyros-lab/gd-automates/releases/latest)
[![Téléchargement Linux](https://img.shields.io/badge/Linux-.AppImage-blue?logo=linux&logoColor=white)](https://github.com/skyros-lab/gd-automates/releases/latest)

La dernière version stable de l’application est disponible à l’adresse suivante :  
<https://github.com/skyros-lab/gd-automates/releases/latest>

Des fichiers sont proposés pour chaque système d’exploitation :

- **Windows** : `.exe` (exécutable autonome) ou `.zip` (archive portable)  
- **macOS** : `.dmg` (installateur) ou `.zip` (version portable)  
- **Linux** : `.AppImage` (exécutable universel), `.deb` (Debian/Ubuntu) ou `.tar.gz` (version portable)

Aucune installation n’est requise.  
Il suffit de télécharger le fichier adapté à votre système, puis de lancer l’exécutable ou d’extraire l’archive si nécessaire.

<details>
<summary>Tableau récapitulatif des formats</summary>

| Système  | Formats fournis                          |
|----------|------------------------------------------|
| Windows  | `.exe`, `.zip`                           |
| macOS    | `.dmg`, `.zip`                           |
| Linux    | `.AppImage`, `.deb`, `.tar.gz`           |

</details>

---

## 🧭 Sommaire

- [Récupération du token Discord](#récupération-de-votre-token-discord)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Fonctionnalités système (icône de la barre)](#fonctionnalités-système-icône-de-la-barre)
- [Mise à jour automatique](#mise-à-jour-automatique)
- [À propos](#à-propos)

---

## Récupération de votre token Discord

> **Important :** votre token est confidentiel. Gardez-le privé.

<details>
<summary>Méthode 1 — via l’onglet Réseau</summary>

1. Ouvrez l’application Discord (version desktop).  
2. Appuyez sur <kbd>Ctrl</kbd> + <kbd>Maj</kbd> + <kbd>I</kbd> (Windows/Linux) ou <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>I</kbd> (macOS) pour ouvrir les outils de développement.  
3. Dans l’onglet **Réseau**, filtrez les requêtes par `/users/@me`.  
4. Sélectionnez la première requête, puis consultez l’en-tête `Authorization`.  
5. Copiez la valeur associée et collez-la dans le champ **Token Discord** de l’interface.
</details>

<details>
<summary>Méthode 2 — via le stockage local</summary>

1. Ouvrez les DevTools comme précédemment.  
2. Rendez-vous dans l’onglet **Application** → **Storage** → **LocalStorage**.  
3. Cliquez sur **https://discord.com/** puis activez le mode responsive.  
4. Filtrez par le mot-clé `token` et sélectionnez la valeur dans la colonne **Value**.  
</details>

L’application validera automatiquement le token et affichera un message de confirmation.

---

## Fonctionnalités principales

- **Validation du token** : vérification instantanée auprès de l’API Discord, message d’erreur détaillé en cas d’échec.  
- **Modes de suppression** :  
  - Serveur (guild)  
  - Message privé (DM ou groupe)  
- **Sélection des cibles** : choix précis du serveur et du salon (ou DM).  
- **Filtres avancés** : plage de messages, date, ID, mots-clés, type de contenu.  
- **Contrôle en temps réel** : lancer, suspendre, reprendre, stopper.  
- **Journal colorisé** : logs horodatés, bouton **Copier les logs**.  
- **Mode *Streamer*** : masque le contenu sensible des logs.  

---

## Fonctionnalités système (icône de la barre)

- Afficher / cacher la fenêtre  
- Redémarrer l’application  
- Accéder à **À propos**  
- Ouvrir le dépôt GitHub  
- Quitter proprement  

---

## Mise à jour automatique

En version packagée, l’application vérifie et télécharge automatiquement les mises à jour via **electron-updater**. Aucune action supplémentaire n’est requise.

---

## 🕵️ À propos

Développé par [@skyros-lab](https://github.com/skyros-lab), ce projet open-source vise à fournir une interface intuitive pour interagir avec l’API Discord.

Il est conçu exclusivement pour un usage personnel, éducatif et conforme aux conditions d’utilisation de Discord.

> Ce projet n’est ni affilié, ni soutenu par Discord Inc.

---

## ✋ Envie de contribuer ?

- [Ouvrir une issue](https://github.com/skyros-lab/gd-automates/issues)  
- [Créer une pull-request](https://github.com/skyros-lab/gd-automates/pulls)  

Merci de votre intérêt ! ⭐

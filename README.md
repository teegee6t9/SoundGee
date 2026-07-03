# SoundGee

Soundboard desktop perso et gratuit, par teegee6t9.
Free personal desktop soundboard, by teegee6t9.

**[Français](#français) | [English](#english)**

---

## Français

SoundGee permet de créer plusieurs soundboards (des "packs"), d'y importer des sons (fichier local ou URL directe), de leur assigner des raccourcis clavier **globaux** (utilisables même quand un jeu ou Discord a le focus), et de faire entendre les sons à la fois à toi-même et aux autres en vocal.

### Fonctionnalités

- Plusieurs packs de sons, chacun avec sa propre grille de sons
- Import de sons depuis un fichier local ou une URL directe
- Raccourcis clavier globaux par son, avec détection correcte du clavier (AZERTY, QWERTY, etc.)
- **Profils par application** : associe un pack à une ou plusieurs applications (ex: un jeu) pour que ses raccourcis ne soient actifs que quand cette application a le focus — évite les conflits de touches entre packs. Les packs sans application associée ("généraux") restent toujours actifs.
- Lecture simultanée sur plusieurs sorties audio (ex: tes haut-parleurs + un câble audio virtuel, pour que les autres t'entendent en vocal)
- Volume principal + volume par son
- Export / import de packs en `.zip` (pour partager avec des amis)
- Interface en français et en anglais
- Reste actif dans la zone de notification (tray) pendant que tu joues, au lieu de se fermer

### Installation (utilisateurs)

Télécharge la dernière version depuis l'onglet [Releases](../../releases) :
- `SoundGee Setup x.x.x.exe` — installeur classique (recommandé)
- `SoundGee x.x.x.exe` — version portable, aucune installation requise

Consulte le **[guide d'utilisation complet](GUIDE.md)** pour créer tes premiers sons et faire entendre tes sons aux autres (Discord, jeux...).

### Développement

Prérequis : [Node.js](https://nodejs.org/) 20+.

```bash
npm install
npm run dev
```

`npm run dev` lance l'appli Electron avec rechargement à chaud du renderer.

```bash
npm run typecheck   # vérification des types
npm run dist:win     # build de l'installeur + version portable (release/)
```

> Le build Windows nécessite le **mode développeur** activé (Paramètres → Confidentialité et sécurité → Pour les développeurs), sinon `electron-builder` échoue en téléchargeant ses outils.

### Où sont stockées mes données ?

Les packs, réglages et fichiers audio sont stockés localement dans `%APPDATA%\soundgee` — rien n'est envoyé sur un serveur. Chaque installation (la tienne, celle de tes amis) a son propre dossier, complètement séparé : le `.exe` ne contient jamais tes données personnelles.

### Commits

Ce repo est géré avec GitHub Desktop — les changements dans ce dossier peuvent être commités normalement depuis l'appli.

---

## English

SoundGee lets you create multiple soundboards ("packs"), import sounds into them (local file or direct URL), assign **global** keyboard shortcuts to them (usable even while a game or Discord has focus), and make sounds heard by both yourself and others in voice chat.

### Features

- Multiple sound packs, each with its own sound grid
- Import sounds from a local file or a direct URL
- Global per-sound keyboard shortcuts, with correct keyboard layout detection (AZERTY, QWERTY, etc.)
- **Per-application profiles**: link a pack to one or more applications (e.g. a game) so its hotkeys are only active while that application is focused — avoids hotkey conflicts between packs. Packs with no linked application ("general") always stay active.
- Simultaneous playback on multiple audio outputs (e.g. your speakers + a virtual audio cable, so others can hear you in voice chat)
- Master volume + per-sound volume
- Export / import packs as `.zip` (to share with friends)
- French and English interface
- Stays running in the system tray while you game, instead of closing

### Installation (users)

Download the latest version from the [Releases](../../releases) tab:
- `SoundGee Setup x.x.x.exe` — regular installer (recommended)
- `SoundGee x.x.x.exe` — portable version, no installation required

See the **[full user guide](GUIDE.md)** to create your first sounds and make others hear them (Discord, games...).

### Development

Requirements: [Node.js](https://nodejs.org/) 20+.

```bash
npm install
npm run dev
```

`npm run dev` launches the Electron app with renderer hot reload.

```bash
npm run typecheck   # type checking
npm run dist:win     # build the installer + portable version (release/)
```

> The Windows build requires **Developer Mode** enabled (Settings → Privacy & security → For developers), otherwise `electron-builder` fails while downloading its tools.

### Where is my data stored?

Packs, settings and audio files are stored locally in `%APPDATA%\soundgee` — nothing is sent to a server. Each install (yours, your friends') has its own, completely separate folder: the `.exe` never contains your personal data.

### Commits

This repo is managed with GitHub Desktop — changes in this folder can be committed normally from the app.

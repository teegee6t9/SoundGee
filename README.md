# SoundGee

Soundboard desktop perso, gratuit, par teegee6t9.

SoundGee permet de créer plusieurs soundboards, d'y importer des sons (fichier local ou URL directe), de leur assigner des raccourcis clavier **globaux** (utilisables même quand un jeu ou Discord a le focus), et de faire entendre les sons à la fois à toi-même et aux autres en vocal.

## Fonctionnalités

- Plusieurs soundboards, chacun avec sa propre grille de sons
- Import de sons depuis un fichier local ou une URL directe
- Raccourcis clavier globaux par son (fonctionnent même hors focus de l'appli)
- Lecture simultanée sur plusieurs sorties audio (ex: tes haut-parleurs + un câble audio virtuel, pour que les autres t'entendent en vocal)
- Volume principal + volume par son
- Export / import de soundboards en pack `.zip` (pour partager avec des amis)
- Interface en français et en anglais
- Reste actif dans la zone de notification (tray) pendant que tu joues, au lieu de se fermer

## Développement

Prérequis : [Node.js](https://nodejs.org/) 20+.

```bash
npm install
npm run dev
```

`npm run dev` lance l'appli Electron avec rechargement à chaud du renderer.

Vérification des types :

```bash
npm run typecheck
```

## Build Windows

```bash
npm run dist:win
```

Génère un installeur NSIS et une version portable dans `release/`.

## Où sont stockées mes données ?

Les soundboards, réglages et fichiers audio sont stockés localement dans le dossier de données utilisateur d'Electron (`%APPDATA%\SoundGee` sous Windows) — rien n'est envoyé sur un serveur.

## Faire entendre tes sons aux autres (Discord, vocal en jeu...)

Par défaut, un son ne joue que sur tes propres haut-parleurs. Pour que les autres t'entendent aussi :

1. Installe [VB-CABLE](https://vb-audio.com/Cable/) (gratuit), et redémarre si demandé.
2. Dans SoundGee → Réglages → Sorties audio, coche "CABLE Input (VB-Audio Virtual Cable)" en plus de tes haut-parleurs.
3. Dans Discord (ou ton jeu), règle ton micro sur "CABLE Output (VB-Audio Virtual Cable)".
4. Pour pouvoir parler ET jouer des sons en même temps, utilise un mixeur gratuit comme [Voicemeeter](https://vb-audio.com/Voicemeeter/) pour combiner ton vrai micro et VB-CABLE en une seule entrée.

Ce guide est aussi disponible directement dans l'appli (Réglages → "Comment faire entendre tes sons aux autres").

## Commits

Ce repo est géré avec GitHub Desktop — les changements dans ce dossier peuvent être commités normalement depuis l'appli.

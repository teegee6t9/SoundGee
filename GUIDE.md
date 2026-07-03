# Guide d'utilisation SoundGee | SoundGee User Guide

**[Français](#français) | [English](#english)**

---

## Français

### 1. Installation

1. Va dans l'onglet [Releases](../../releases) du repo GitHub.
2. Télécharge `SoundGee Setup x.x.x.exe` (installeur, recommandé) ou `SoundGee x.x.x.exe` (portable, aucune installation).
3. Lance le fichier. Windows peut afficher un avertissement SmartScreen ("Windows a protégé votre ordinateur") car l'appli n'est pas signée numériquement (coûte cher, projet gratuit perso) — clique sur **Informations complémentaires → Exécuter quand même**.

### 2. Créer ton premier pack

1. Dans la colonne de gauche, clique sur **"+ Nouveau pack"**, donne-lui un nom (ex: "Jeu", "Memes").
2. Le pack créé est automatiquement sélectionné, sa grille de sons apparaît à droite.

### 3. Ajouter des sons

1. Dans la grille, clique sur **"+ Ajouter un son"**.
2. Deux options :
   - **Fichier local** : clique sur "Choisir un fichier..." et sélectionne un `.mp3`/`.wav`/`.ogg`/`.m4a`/`.flac`.
   - **URL directe** : colle un lien pointant directement vers un fichier audio.
3. Donne un nom au son, valide. Il apparaît en tuile dans la grille — clique dessus pour le jouer.
4. Clique sur le ⋮ d'une tuile pour modifier son nom, sa couleur, son volume, lui assigner un raccourci, ou le supprimer.

### 4. Assigner un raccourci clavier

1. Ouvre l'édition d'un son (⋮), puis clique sur le bouton de raccourci ("Cliquer pour enregistrer").
2. Appuie sur la combinaison souhaitée (ex: `Ctrl+Shift+1`). Elle s'enregistre automatiquement.
3. Ce raccourci fonctionne **même quand SoundGee n'a pas le focus** (en jeu, sur Discord, etc.), sauf s'il est associé à une application précise (voir section suivante) et que cette application n'est pas au premier plan.
4. Si le raccourci est déjà utilisé par un autre son qui pourrait être actif en même temps, SoundGee te previent (conflit) — choisis-en un autre.

### 5. Profils par application (optionnel)

Utile si tu as beaucoup de sons/raccourcis et que tu veux éviter les collisions entre jeux différents.

1. Dans la sidebar, clique sur l'icône 🎮 à côté d'un pack.
2. Coche une ou plusieurs applications dans la liste des applications en cours d'exécution (clique sur "Rafraîchir" si l'appli que tu cherches n'apparaît pas encore — il faut qu'elle soit lancée). Tu peux aussi taper son nom manuellement si elle n'est pas encore lancée.
3. Valide. Ce pack ne sera actif (raccourcis utilisables) que quand une de ces applications est au premier plan.
4. Un pack **sans aucune application cochée** est "général" : il reste actif tout le temps, en plus des packs spécifiques.
5. Une pastille apparaît à côté du nom du pack dans la sidebar quand il est actif en ce moment.

### 6. Faire entendre tes sons aux autres (Discord, vocal en jeu...)

Par défaut, un son ne joue que sur tes propres haut-parleurs — toi seul l'entends. Pour que les autres t'entendent aussi en vocal :

1. **Installe VB-CABLE** (gratuit) : [vb-audio.com/Cable](https://vb-audio.com/Cable/). Lance l'installeur, redémarre si demandé.
2. **Dans SoundGee** : Réglages (icône ⚙ en haut à droite) → Sorties audio → coche **"CABLE Input (VB-Audio Virtual Cable)"** en plus de tes haut-parleurs habituels. Désormais, chaque son joue sur les deux en même temps.
3. **Dans Discord** (ou ton jeu) : Réglages → Voix et vidéo → Périphérique d'entrée → sélectionne **"CABLE Output (VB-Audio Virtual Cable)"**.
4. À ce stade, Discord entend SoundGee, mais plus ta voix (un seul périphérique d'entrée à la fois). Pour parler ET jouer des sons en même temps :
   - Installe **[Voicemeeter](https://vb-audio.com/Voicemeeter/)** (gratuit, du même éditeur que VB-CABLE).
   - Configure Voicemeeter pour mixer ton vrai micro + VB-CABLE en une seule sortie virtuelle (le logiciel fournit un guide de prise en main à l'installation).
   - Dans Discord, choisis la sortie de Voicemeeter comme périphérique d'entrée à la place de VB-CABLE directement.
5. Ce guide est aussi accessible directement dans l'appli : Réglages → "Comment faire entendre tes sons aux autres".

### 7. Astuces

- SoundGee continue de tourner dans la zone de notification (tray) quand tu fermes la fenêtre — clique sur l'icône dans le tray pour la rouvrir, ou "Quitter" dans le menu du tray pour fermer complètement.
- Exporte un pack (bouton ⬇ dans la sidebar) pour en faire un fichier `.zip` à partager avec des amis ; ils peuvent l'importer via "Importer un pack".
- Tes données (packs, sons, réglages) sont stockées localement dans `%APPDATA%\soundgee`, jamais partagées automatiquement.

---

## English

### 1. Installation

1. Go to the [Releases](../../releases) tab of the GitHub repo.
2. Download `SoundGee Setup x.x.x.exe` (installer, recommended) or `SoundGee x.x.x.exe` (portable, no installation).
3. Run the file. Windows may show a SmartScreen warning ("Windows protected your PC") because the app isn't digitally signed (costly, free personal project) — click **More info → Run anyway**.

### 2. Create your first pack

1. In the left column, click **"+ New pack"**, give it a name (e.g. "Game", "Memes").
2. The new pack is automatically selected and its sound grid appears on the right.

### 3. Add sounds

1. In the grid, click **"+ Add sound"**.
2. Two options:
   - **Local file**: click "Choose a file..." and pick a `.mp3`/`.wav`/`.ogg`/`.m4a`/`.flac`.
   - **Direct URL**: paste a link pointing directly to an audio file.
3. Name the sound and confirm. It appears as a tile in the grid — click it to play it.
4. Click the ⋮ on a tile to edit its name, color, volume, assign a hotkey, or delete it.

### 4. Assign a keyboard shortcut

1. Open a sound's editor (⋮), then click the hotkey button ("Click to record").
2. Press the desired combo (e.g. `Ctrl+Shift+1`). It saves automatically.
3. This hotkey works **even when SoundGee doesn't have focus** (in-game, on Discord, etc.), unless it's linked to a specific application (see next section) and that application isn't currently in the foreground.
4. If the hotkey is already used by another sound that could be active at the same time, SoundGee warns you (conflict) — pick another one.

### 5. Per-application profiles (optional)

Useful if you have lots of sounds/hotkeys and want to avoid collisions between different games.

1. In the sidebar, click the 🎮 icon next to a pack.
2. Check one or more applications from the list of currently running apps (click "Refresh" if the app you're looking for isn't listed yet — it needs to be running). You can also type its name manually if it isn't running yet.
3. Confirm. This pack will only be active (hotkeys usable) while one of these applications is in the foreground.
4. A pack with **no application checked** is "general": it stays active all the time, in addition to app-specific packs.
5. A dot appears next to the pack's name in the sidebar when it's currently active.

### 6. Making others hear your sounds (Discord, in-game voice...)

By default, a sound only plays on your own speakers — only you hear it. To have others hear it too in voice chat:

1. **Install VB-CABLE** (free): [vb-audio.com/Cable](https://vb-audio.com/Cable/). Run the installer, restart if prompted.
2. **In SoundGee**: Settings (⚙ icon top right) → Audio outputs → check **"CABLE Input (VB-Audio Virtual Cable)"** in addition to your usual speakers. From now on, every sound plays on both at once.
3. **In Discord** (or your game): Settings → Voice & Video → Input Device → select **"CABLE Output (VB-Audio Virtual Cable)"**.
4. At this point Discord hears SoundGee, but no longer your voice (only one input device at a time). To talk AND play sounds at the same time:
   - Install **[Voicemeeter](https://vb-audio.com/Voicemeeter/)** (free, same publisher as VB-CABLE).
   - Configure Voicemeeter to mix your real mic + VB-CABLE into a single virtual output (the app provides a setup guide on install).
   - In Discord, pick Voicemeeter's output as the input device instead of VB-CABLE directly.
5. This guide is also available directly in the app: Settings → "How to make others hear your sounds".

### 7. Tips

- SoundGee keeps running in the system tray when you close the window — click the tray icon to reopen it, or "Quit" in the tray menu to fully close it.
- Export a pack (⬇ button in the sidebar) to get a `.zip` file to share with friends; they can import it via "Import pack".
- Your data (packs, sounds, settings) is stored locally in `%APPDATA%\soundgee`, never shared automatically.

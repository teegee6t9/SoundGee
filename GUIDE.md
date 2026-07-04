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

Par défaut, un son ne joue que sur tes propres haut-parleurs — toi seul l'entends. SoundGee peut automatiser presque toute la configuration pour que les autres t'entendent aussi en vocal, avec un seul outil gratuit (Voicemeeter) :

1. Ouvre **Réglages** (icône ⚙) → **"Comment faire entendre tes sons aux autres"**.
2. Si Voicemeeter n'est pas détecté : clique **"Télécharger Voicemeeter Banana"**, installe-le (redémarre si demandé), puis reviens et clique **"J'ai terminé l'installation, vérifier à nouveau"**.
3. Une fois détecté, clique **"Configurer automatiquement"** — SoundGee lance Voicemeeter et configure le mixage micro + sons tout seul, plus besoin de toucher à l'interface de Voicemeeter.
4. Dernière étape, à faire toi-même (aucune appli ne peut le faire à ta place) : dans **Discord** (ou ton jeu) → Réglages → Voix et vidéo → Périphérique d'entrée → choisis **"Voicemeeter Output"**.

C'est tout : Discord entend maintenant ta voix ET les sons de SoundGee, mixés ensemble.

**Solution alternative (VB-CABLE)** : si tu préfères l'ancienne méthode manuelle (VB-CABLE seul, sans Voicemeeter), elle reste disponible dans la section "Solution alternative" du même écran — pratique si tu as déjà VB-CABLE installé et configuré.

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

By default, a sound only plays on your own speakers — only you hear it. SoundGee can automate almost the entire setup so others can hear you too, with a single free tool (Voicemeeter):

1. Open **Settings** (⚙ icon) → **"Make others hear your sounds"**.
2. If Voicemeeter isn't detected: click **"Download Voicemeeter Banana"**, install it (restart if prompted), then come back and click **"I've finished installing it, check again"**.
3. Once detected, click **"Configure automatically"** — SoundGee launches Voicemeeter and sets up the mic + sounds mixing on its own, no need to touch Voicemeeter's own interface.
4. Last step, done by hand (no app can do this for you): in **Discord** (or your game) → Settings → Voice & Video → Input Device → choose **"Voicemeeter Output"**.

That's it: Discord now hears both your voice AND SoundGee's sounds, mixed together.

**Alternative solution (VB-CABLE)**: if you prefer the older manual method (VB-CABLE alone, without Voicemeeter), it's still available under "Alternative solution" on the same screen — handy if you already have VB-CABLE installed and configured.

### 7. Tips

- SoundGee keeps running in the system tray when you close the window — click the tray icon to reopen it, or "Quit" in the tray menu to fully close it.
- Export a pack (⬇ button in the sidebar) to get a `.zip` file to share with friends; they can import it via "Import pack".
- Your data (packs, sounds, settings) is stored locally in `%APPDATA%\soundgee`, never shared automatically.

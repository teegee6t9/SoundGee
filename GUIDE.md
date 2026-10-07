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

### 3bis. Ne garder qu'un extrait d'un son (optionnel)

Pratique si tu as extrait l'audio d'une vidéo et que seul un petit passage t'intéresse.

1. Deux façons d'ouvrir l'éditeur de découpe :
   - **À l'import** : coche **"Couper un extrait après l'import"** dans la fenêtre d'ajout de son, l'éditeur s'ouvre dès que le fichier est ajouté.
   - **Sur un son déjà ajouté** : clique sur le ⋮ de sa tuile, puis sur **"Couper l'audio..."**.
2. Choisis l'extrait : fais glisser les deux repères sur la forme d'onde, ou tape les temps de début et de fin (en secondes). La zone gardée est en surbrillance, le reste est assombri.
3. Clique sur **"Écouter l'extrait"** pour entendre uniquement la sélection (tu peux ajuster les repères et réécouter autant de fois que tu veux).
4. Enregistre :
   - **"Remplacer le son"** : le son ne contient plus que l'extrait, l'audio d'origine est supprimé (irréversible).
   - **"Enregistrer comme nouveau son"** : l'original reste intact et l'extrait est ajouté à côté, sous le nom « nom (extrait) » — pratique pour tirer plusieurs extraits d'un même fichier.

L'extrait est enregistré au format WAV. Pour un fichier très long (plus d'une heure), la découpe peut être lente et gourmande en mémoire : mieux vaut le couper en deux fois.

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
2. Si Voicemeeter n'est pas détecté, clique **"Télécharger et installer Voicemeeter Banana"** : SoundGee télécharge le fichier et lance l'installeur tout seul. Ensuite :
   - Windows va demander une autorisation (droits administrateur) → accepte.
   - L'installeur de Voicemeeter s'ouvre dans sa propre fenêtre → clique "Suivant"/"Install" comme pour n'importe quel logiciel (ça, je ne peux pas l'automatiser).
   - Windows demandera probablement de redémarrer ton PC (installation d'un pilote audio) → redémarre.
   - Rouvre SoundGee, reviens sur cet écran, clique **"J'ai terminé l'installation, vérifier à nouveau"**.
3. Une fois détecté, clique **"Configurer automatiquement"** — SoundGee lance Voicemeeter et configure le mixage micro + sons tout seul, plus besoin de toucher à l'interface de Voicemeeter.
4. Dernière étape, à faire toi-même (aucune appli ne peut le faire à ta place) : dans **Discord** (ou ton jeu) → Réglages → Voix et vidéo → Périphérique d'entrée → choisis **"Voicemeeter Output"**.

C'est tout : Discord entend maintenant ta voix ET les sons de SoundGee, mixés ensemble.

**Solution alternative (VB-CABLE)** : si tu préfères l'ancienne méthode manuelle (VB-CABLE seul, sans Voicemeeter), elle reste disponible dans la section "Solution alternative" du même écran — pratique si tu as déjà VB-CABLE installé et configuré.

### 6bis. Diffuser aussi de la musique ou une vidéo (Spotify, YouTube, VLC...)

Une fois Voicemeeter configuré (étape précédente), tu peux faire entendre à tes potes **n'importe quel son de ton PC** — pas juste les sons de SoundGee — sans rien connecter ni installer en plus. Windows permet de choisir une sortie audio différente pour chaque application :

1. Ouvre les **Réglages Windows → Système → Son**.
2. Descends jusqu'à **"Options de volume avancées de l'application"** (ou clique droit sur l'icône du haut-parleur dans la barre des tâches → "Mixeur de volume").
3. Trouve l'appli qui joue le son (ton navigateur pour YouTube, Spotify, VLC...) et règle sa sortie sur **"Voicemeeter Input"** au lieu de tes haut-parleurs.
4. C'est tout : cette appli est maintenant mixée avec le reste, entendue par toi et par tes potes en vocal, exactement comme les sons de SoundGee.

Ce réglage est par application et reste actif tant que tu ne le changes pas (utile pour Spotify/le navigateur ; à remettre sur tes haut-parleurs quand tu ne veux plus partager cette appli).

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

### 3b. Keep only a clip of a sound (optional)

Handy if you extracted the audio from a video and only a short part interests you.

1. Two ways to open the trim editor:
   - **At import**: tick **"Trim a clip after importing"** in the add-sound window, the editor opens as soon as the file is added.
   - **On an existing sound**: click the ⋮ on its tile, then **"Trim audio..."**.
2. Pick the clip: drag the two markers on the waveform, or type the start and end times (in seconds). The kept part is highlighted, the rest is dimmed.
3. Click **"Preview clip"** to hear only the selection (adjust the markers and listen again as many times as you like).
4. Save:
   - **"Replace sound"**: the sound now only contains the clip, the original audio is deleted (irreversible).
   - **"Save as new sound"**: the original stays untouched and the clip is added next to it, named "name (clip)" — handy for pulling several clips from one file.

The clip is saved as WAV. For a very long file (over an hour), trimming can be slow and memory-hungry: better to cut it in two passes.

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
2. If Voicemeeter isn't detected, click **"Download and install Voicemeeter Banana"**: SoundGee downloads the file and launches the installer on its own. Then:
   - Windows will ask for permission (administrator rights) → accept.
   - Voicemeeter's installer opens in its own window → click "Next"/"Install" like any other software (that part can't be automated).
   - Windows will likely ask to restart your PC (it installs an audio driver) → restart.
   - Reopen SoundGee, come back to this screen, click **"I've finished installing it, check again"**.
3. Once detected, click **"Configure automatically"** — SoundGee launches Voicemeeter and sets up the mic + sounds mixing on its own, no need to touch Voicemeeter's own interface.
4. Last step, done by hand (no app can do this for you): in **Discord** (or your game) → Settings → Voice & Video → Input Device → choose **"Voicemeeter Output"**.

That's it: Discord now hears both your voice AND SoundGee's sounds, mixed together.

**Alternative solution (VB-CABLE)**: if you prefer the older manual method (VB-CABLE alone, without Voicemeeter), it's still available under "Alternative solution" on the same screen — handy if you already have VB-CABLE installed and configured.

### 6b. Sharing music or a video too (Spotify, YouTube, VLC...)

Once Voicemeeter is configured (previous step), you can let your friends hear **any sound from your PC** - not just SoundGee's sounds - without connecting or installing anything else. Windows lets you pick a different audio output per application:

1. Open **Windows Settings → System → Sound**.
2. Scroll down to **"Advanced app volume options"** (or right-click the speaker icon in the taskbar → "Volume mixer").
3. Find the app playing the sound (your browser for YouTube, Spotify, VLC...) and set its output to **"Voicemeeter Input"** instead of your speakers.
4. That's it: this app is now mixed with everything else, heard by you and your friends in voice chat, just like SoundGee's sounds.

This setting is per-app and stays active until you change it (handy for Spotify/your browser; switch it back to your speakers when you no longer want to share that app).

### 7. Tips

- SoundGee keeps running in the system tray when you close the window — click the tray icon to reopen it, or "Quit" in the tray menu to fully close it.
- Export a pack (⬇ button in the sidebar) to get a `.zip` file to share with friends; they can import it via "Import pack".
- Your data (packs, sounds, settings) is stored locally in `%APPDATA%\soundgee`, never shared automatically.

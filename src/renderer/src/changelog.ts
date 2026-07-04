interface ChangelogEntry {
  fr: string[]
  en: string[]
}

export const CHANGELOG: Record<string, ChangelogEntry> = {
  '1.0.0': {
    fr: [
      'Première version : packs de sons, raccourcis clavier globaux, sortie audio double (toi + les autres en vocal), export/import de packs.'
    ],
    en: [
      'First release: sound packs, global keyboard shortcuts, dual audio output (you + others in voice chat), pack export/import.'
    ]
  },
  '2.0.0': {
    fr: [
      'Correction des raccourcis clavier sur clavier AZERTY.',
      'Renommage "soundboard" en "pack" dans l\'interface.',
      'Profils par application : un pack peut n\'être actif que pour certains jeux/applis.',
      'Nouveau logo.'
    ],
    en: [
      'Fixed keyboard shortcuts on AZERTY layouts.',
      'Renamed "soundboard" to "pack" throughout the UI.',
      'Per-application profiles: a pack can stay active only for certain games/apps.',
      'New app logo.'
    ]
  },
  '2.1.0': {
    fr: [
      'Mise à jour automatique pour la version installeur.',
      'Fenêtre sans bordure Windows, maximisée au lancement.',
      'Lancement au démarrage de Windows et démarrage en arrière-plan.',
      'Raccourci global pour activer/désactiver tous les sons.'
    ],
    en: [
      'Auto-update for the installer version.',
      'Frameless window, maximized on launch.',
      'Launch at Windows startup and start in background.',
      'Global shortcut to enable/disable all sounds.'
    ]
  },
  '2.2.0': {
    fr: [
      'Configuration audio simplifiée : détection et configuration automatique de Voicemeeter pour que les autres t\'entendent, plus besoin de tout régler à la main.',
      'Popup "nouveautés" affichée après chaque mise à jour.'
    ],
    en: [
      'Simplified audio setup: automatic detection and configuration of Voicemeeter so others can hear you, no more manual routing.',
      'A "what\'s new" popup shown after each update.'
    ]
  },
  '2.2.1': {
    fr: [
      'Le téléchargement de Voicemeeter est maintenant automatique : un clic télécharge et lance l\'installeur directement, plus besoin de chercher le bon lien sur le site.'
    ],
    en: [
      'Voicemeeter download is now automatic: one click downloads and launches the installer directly, no more hunting for the right link on the website.'
    ]
  },
  '2.2.2': {
    fr: [
      'Correction de plusieurs bugs de la configuration automatique Voicemeeter : le lancement automatique et la vérification de disponibilité suivent maintenant la méthode officielle documentée par VB-Audio, le bon micro/entrée virtuelle est ciblé (au lieu d\'une piste voisine), et tes haut-parleurs restent actifs en plus de Voicemeeter au lieu d\'être remplacés.'
    ],
    en: [
      'Fixed several bugs in the automatic Voicemeeter setup: launching and readiness checks now follow VB-Audio\'s officially documented method, the correct mic/virtual input is targeted (instead of a neighboring one), and your speakers stay active alongside Voicemeeter instead of being replaced.'
    ]
  }
}

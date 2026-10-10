import type { Dictionary } from "./en";

/**
 * French. `satisfies Dictionary` is the safety net: a key that drifts from
 * English stops the build.
 *
 * Typography follows French convention — « guillemets », and a narrow
 * no-break space before : ; ! ? — since that is what the text actually needs.
 */
export const fr = {
  common: {
    appName: "Shared Room",
    tagline:
      "Une salle. Un espace de travail partagé. Tout le monde voit tout, en direct.",
    description:
      "Une salle de classe collaborative en temps réel où chacun peut écrire, dessiner, discuter et partager des fichiers.",
    cancel: "Annuler",
    close: "Fermer",
    back: "Retour",
    continue: "Continuer",
    tryAgain: "Réessayer",
    saveChanges: "Enregistrer",
    clear: "Effacer",
    seeAll: "Tout voir",
    people: "Personnes",
  },

  language: {
    label: "Langue",
    change: "Changer de langue",
  },

  theme: {
    label: "Thème",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
  },

  nav: {
    main: "Principal",
    navigation: "Navigation",
    openNavigation: "Ouvrir la navigation",
    closeNavigation: "Fermer la navigation",
    newRoom: "Nouvelle salle",
    dashboard: "Tableau de bord",
    allRooms: "Toutes les salles",
    profile: "Profil",
    recent: "Récentes",
    noRoomsYet: "Aucune salle pour l’instant.",
    signedOut: "Déconnecté",
    noSession: "Aucune session",
    signOut: "Se déconnecter",
  },

  landing: {
    sections: {
      features: "Fonctionnalités",
      classroom: "La classe",
      howItWorks: "Comment ça marche",
    },
    header: {
      signIn: "Se connecter",
      createRoom: "Créer une salle",
    },
    footer: {
      product: "Produit",
      getStarted: "Commencer",
      createRoom: "Créer une salle",
      joinRoom: "Rejoindre une salle",
      login: "Connexion",
      viewOnGithub: "Voir sur GitHub",
      copyright: "© {year} {name}. Un projet de l’école 42.",
    },
    hero: {
      badge: "Salle de classe collaborative en temps réel",
      titleLead: "Apprendre ensemble.",
      titleAccent: "Écrire ensemble.",
      subtitle:
        "Une salle de classe collaborative en temps réel où chacun peut écrire, dessiner, discuter et partager des fichiers.",
      createRoom: "Créer une salle",
      joinRoom: "Rejoindre une salle",
      note: "Aucune installation. Partagez un lien et tout le monde est sur le même tableau.",
    },
    features: {
      title: "Tout ce qu’il faut, dans une seule salle.",
      subtitle:
        "Fini de jongler entre un appel, un tableau blanc et une messagerie. Shared Room réunit le tableau, la conversation et les documents au même endroit.",
      whiteboard: {
        title: "Tableau blanc collaboratif",
        description:
          "Un canevas infini partagé, propulsé par tldraw. Dessinez, écrivez, ajoutez des formes et expliquez à plusieurs.",
      },
      realtime: {
        title: "Collaboration en temps réel",
        description:
          "Chaque trait, chaque note et chaque forme apparaît instantanément pour tout le monde, avec le curseur de chaque participant visible sur le tableau.",
        caption: "Vous dessinez",
        captionAccent: "→ tout le monde le voit.",
      },
      chat: {
        title: "Discussion en direct",
        description:
          "Posez vos questions et répondez sans quitter la salle. Noms, horodatage et présence, juste à côté du tableau.",
      },
      files: {
        title: "Partage de fichiers",
        description:
          "Déposez vos supports directement dans la salle — PDF, images et documents que chacun peut ouvrir.",
        shared: "Partagé",
        dropHint: "Déposez un PDF, une image ou un document",
      },
    },
    classroom: {
      title: "Une salle de classe sans les murs.",
      subtitle:
        "Tout le monde ouvre le même lien et se retrouve dans la même salle — dans un amphi, à la bibliothèque ou à la table de la cuisine.",
      audiences: {
        teachers: "Enseignants",
        students: "Étudiants",
        tutors: "Tuteurs",
        studyGroups: "Groupes de travail",
        remoteTeams: "Équipes à distance",
      },
      quote: "« Résolvons cette équation ensemble. »",
      writing: "{name} écrit au tableau…",
      whileOthers: "Pendant que {name} et les autres peuvent",
      actions: {
        watch: "Suivre l’explication pendant qu’elle s’écrit",
        tryIt: "Prendre la main sur le tableau et essayer",
        ask: "Poser une question sans interrompre",
        openSheet: "Ouvrir la feuille d’exercices en un clic",
      },
      roles: {
        teacher: "Enseignante",
        student: "Étudiant",
      },
    },
    showcase: {
      title: "Une seule salle. Tout sous les yeux.",
      subtitle:
        "Le tableau, les participants, la conversation et les fichiers — côte à côte, mis à jour en direct pour toute la salle.",
      live: "En direct",
      chatTitle: "Discussion",
      online: "{count} en ligne",
      files: "Fichiers",
      roomTitle: "Mathématiques — Algèbre",
      messages: {
        question: "On factorise comment, celui-là ?",
        answer:
          "Cherchez le carré parfait — le terme du milieu vous met sur la piste.",
        gotIt: "Ça y est, c’est (x + 1)²",
      },
      boardTopic: "Factoriser un trinôme",
      stickyTitle: "À retenir",
    },
    howItWorks: {
      title: "Opérationnel en trois étapes.",
      create: {
        title: "Créez ou rejoignez une salle",
        description:
          "Ouvrez une salle et invitez les autres avec un lien ou un code comme {code}. Aucune installation, aucun compte à gérer.",
      },
      collaborate: {
        title: "Collaborez",
        description:
          "Écrivez, dessinez et expliquez à plusieurs sur le tableau partagé. Tout le monde modifie le même canevas.",
      },
      communicate: {
        title: "Échangez",
        description:
          "Posez vos questions dans la discussion et partagez des fichiers sans jamais quitter la salle.",
      },
    },
    useCases: {
      title: "Pensé pour la façon dont on enseigne vraiment.",
      classes: {
        title: "Cours en ligne",
        description:
          "Les enseignants expliquent sur un tableau partagé interactif que toute la classe peut suivre — et compléter.",
      },
      studyGroups: {
        title: "Groupes de travail",
        description:
          "Les étudiants avancent ensemble sur une série d’exercices, chacun pouvant prendre le stylo.",
      },
      tutoring: {
        title: "Cours particuliers",
        description:
          "Un tuteur et un élève partagent un canevas : les corrections se font dans l’instant plutôt que par mail.",
      },
      workshops: {
        title: "Ateliers d’équipe",
        description:
          "Les équipes à distance réfléchissent sur un canevas infini et gardent notes, croquis et fichiers dans une même salle.",
      },
    },
    finalCta: {
      title: "Votre salle de classe est à une salle d’ici.",
      subtitle:
        "Créez une salle, invitez vos camarades et commencez à collaborer en temps réel.",
    },
  },

  auth: {
    login: {
      metaTitle: "Connexion",
      metaDescription: "Connectez-vous pour retrouver vos salles.",
      title: "Content de vous revoir",
      subtitle:
        "Connectez-vous pour retrouver vos salles et reprendre où vous en étiez.",
      email: "E-mail",
      emailPlaceholder: "vous@student.42.fr",
      password: "Mot de passe",
      passwordPlaceholder: "Votre mot de passe",
      submit: "Se connecter",
      submitting: "Connexion…",
      failed: "Connexion impossible",
      noAccount: "Nouveau sur Shared Room ?",
      createAccount: "Créer un compte",
    },
    register: {
      metaTitle: "Créer votre compte",
      metaDescription: "Inscrivez-vous pour commencer.",
      title: "Créer votre compte",
      subtitle: "Inscrivez-vous pour commencer.",
      username: "Nom d’utilisateur",
      usernamePlaceholder: "norminette",
      email: "E-mail",
      emailPlaceholder: "vous@student.42.fr",
      password: "Mot de passe",
      passwordPlaceholder: "Au moins 8 caractères",
      confirmPassword: "Confirmer le mot de passe",
      confirmPasswordPlaceholder: "Saisissez-le à nouveau",
      submit: "Créer le compte",
      submitting: "Création du compte…",
      failed: "Création du compte impossible",
      created: "Compte créé. Connectez-vous pour continuer.",
      haveAccount: "Vous avez déjà un compte ?",
      signIn: "Se connecter",
    },
    passwordStrength: {
      label: "Robustesse du mot de passe",
      levels: {
        "0": "Trop faible",
        "1": "Faible",
        "2": "Moyen",
        "3": "Bon",
        "4": "Robuste",
      },
      checks: {
        length: "8 caractères ou plus",
        letterCase: "Majuscule et minuscule",
        number: "Un chiffre",
        symbol: "Un symbole",
      },
      show: "Afficher le mot de passe",
      hide: "Masquer le mot de passe",
    },
  },

  rooms: {
    metaTitle: "Salles",
    metaDescription: "Parcourez, filtrez et ouvrez vos salles collaboratives.",
    title: "Salles",
    subtitle: "Parcourez toutes les salles accessibles, ou lancez la vôtre.",
    kpis: {
      total: "Salles au total",
      totalHint: "Toutes matières confondues",
      active: "Actives",
      activeHint: "{count} archivées",
      owned: "Les miennes",
      ownedHint: "Vous pouvez les archiver",
      participants: "Participants",
      participantsHint: "Places occupées en ce moment",
    },
    toolbar: {
      searchPlaceholder: "Rechercher une salle, un code, une matière…",
      searchLabel: "Rechercher une salle",
      view: "Affichage",
      cardView: "Vue en cartes",
      tableView: "Vue en tableau",
      subject: "Matière",
      allSubjects: "Toutes les matières",
      status: "Statut",
      anyStatus: "Tous les statuts",
      ownership: "Appartenance",
      everyonesRooms: "Les salles de tous",
      roomsIOwn: "Mes salles",
      roomsIJoined: "Salles rejointes",
      sortBy: "Trier par",
      mostRecent: "Plus récentes",
      nameAz: "Nom (A–Z)",
      mostPeople: "Plus de monde",
    },
    status: {
      active: "Active",
      archived: "Archivée",
    },
    table: {
      room: "Salle",
      subject: "Matière",
      owner: "Propriétaire",
      people: "Personnes",
      lastActive: "Dernière activité",
      status: "Statut",
    },
    addMenu: {
      addRoom: "Ajouter une salle",
      more: "Autres actions",
      joinWithCode: "Rejoindre avec un code",
      jumpTo: "Aller à",
      roomsIOwn: "Mes salles",
      roomsIJoined: "Salles rejointes",
      archivedRooms: "Salles archivées",
    },
    create: {
      title: "Créer une salle",
      description:
        "Donnez-lui un nom et une matière. Vous recevez aussitôt un code à partager.",
      name: "Nom de la salle",
      namePlaceholder: "Mathématiques — Algèbre",
      subject: "Matière",
      subjectPlaceholder: "Choisissez une matière",
      submit: "Créer la salle",
    },
    join: {
      title: "Rejoindre une salle",
      description: "Saisissez le code qu’on vous a partagé.",
      code: "Code de la salle",
      codePlaceholder: "ALG-4271",
      codeHint:
        "Un code se compose de trois lettres, d’un tiret et de quatre chiffres.",
      submit: "Rejoindre",
    },
    empty: {
      filteredTitle: "Aucune salle ne correspond à ces filtres",
      filteredBody: "Essayez une autre matière, ou effacez les filtres.",
      title: "Aucune salle pour l’instant",
      body: "Créez-en une et partagez le code, ou rejoignez une salle ouverte par quelqu’un d’autre.",
    },
    error: {
      title: "Impossible de charger vos salles",
      body: "Une erreur est survenue pendant le chargement de vos salles.",
    },
    subjects: {
      Mathematics: "Mathématiques",
      Physics: "Physique",
      "Computer Science": "Informatique",
      Biology: "Biologie",
      Chemistry: "Chimie",
      History: "Histoire",
      Languages: "Langues",
    },
  },

  pagination: {
    label: "Pagination",
    empty: "Aucune salle à afficher",
    showing: "{from}–{to} sur {total}",
    perPage: "{count} / page",
    perPageLabel: "Salles par page",
    previous: "Page précédente",
    next: "Page suivante",
    page: "Page {page}",
  },

  dashboard: {
    metaTitle: "Tableau de bord",
    metaDescription: "Vos salles récentes et votre activité collaborative.",
    welcome: "Content de vous revoir",
    welcomeNamed: "Content de vous revoir, {name}",
    subtitle: "Voici ce qui s’est passé dans vos salles.",
    browseAll: "Voir toutes les salles",
    stats: {
      roomsJoined: "Salles rejointes",
      roomsJoinedHint: "Depuis votre inscription",
      collaborated: "Temps collaboré",
      collaboratedHint: "Sur les 7 derniers jours",
      messagesSent: "Messages envoyés",
      messagesSentHint: "Toutes salles confondues",
      filesShared: "Fichiers partagés",
      filesSharedHint: "PDF, images, documents",
    },
    chart: {
      title: "Temps passé au tableau cette semaine",
      subtitle: "Minutes passées en salle, par jour.",
    },
    duration: {
      hoursMinutes: "{hours} h {minutes}",
      hours: "{hours} h",
      minutes: "{minutes} min",
    },
    recentRooms: "Salles récentes",
  },

  profile: {
    metaTitle: "Profil",
    metaDescription:
      "Gérez votre photo, vos informations et votre mot de passe.",
    header: {
      joined: "Inscrit le {date}",
    },
    error: {
      title: "Impossible de charger votre profil",
      body: "Votre session n’est pas disponible. Reconnectez-vous pour gérer votre compte.",
    },
    password: {
      title: "Mot de passe",
      description:
        "Le changer ne vous déconnecte pas des salles où vous êtes déjà.",
      current: "Mot de passe actuel",
      new: "Nouveau mot de passe",
      confirm: "Confirmer le nouveau mot de passe",
      submit: "Changer le mot de passe",
      changed: "Votre mot de passe a été changé.",
    },
    changePhoto: "Changer la photo de profil",
    removePhoto: "Supprimer la photo de profil",
    account: {
      title: "Informations du compte",
      description:
        "Votre nom d’utilisateur est ce qui permet aux autres de vous retrouver.",
      username: "Nom d’utilisateur",
      email: "E-mail",
      emailHint: "Sert à vous connecter et à récupérer votre compte.",
      saved: "Vos informations ont été enregistrées.",
    },
    picker: {
      label: "Photo",
      usingCurrent: "Photo actuelle utilisée",
      usingInitials: "Vos initiales sont utilisées",
      choose: "Choisir une photo",
      chooseAnother: "Choisir une autre photo",
      dropHint: "ou déposez une image ici",
      removeSelection: "Retirer la sélection",
      removePhoto: "Supprimer la photo",
      hint: "Facultatif. PNG, JPG ou WebP jusqu’à {size} — les grandes images sont réduites avant l’envoi.",
    },
    danger: {
      title: "Supprimer le compte",
      description:
        "Vos salles, tableaux et messages sont supprimés pour tout le monde. C’est irréversible.",
      confirmLabel: "Saisissez votre nom d’utilisateur pour confirmer",
      confirmHint: "Saisissez exactement « {username} » pour confirmer",
      submit: "Supprimer mon compte",
      cancel: "Annuler",
      confirmDescription:
        "Saisissez {username} pour débloquer le bouton ci-dessous.",
      permanentlyDelete: "Supprimer définitivement",
      start: "Supprimer le compte",
    },
  },

  onboarding: {
    metaTitle: "Commencer",
    metaDescription: "Configurez votre profil et ouvrez votre première salle.",
    progress: "Étape {current} sur {total} · {label}",
    progressLabel: "Progression",
    steps: {
      welcome: "Bienvenue",
      picture: "Photo",
      firstRoom: "Première salle",
    },
    welcome: {
      title: "Bienvenue 👋",
      titleNamed: "Bienvenue, {name} 👋",
      subtitle:
        "Shared Room, c’est une salle où tout le monde écrit, dessine et échange ensemble. Deux étapes rapides et vous y êtes.",
      board: {
        title: "Un tableau où chacun peut dessiner",
        description: "Un canevas infini, partagé par toute la salle.",
      },
      chat: {
        title: "Une discussion qui reste dans le contexte",
        description: "Posez une question sans interrompre l’explication.",
      },
      files: {
        title: "Les supports à portée de main",
        description: "Déposez un PDF ou une image, chacun peut l’ouvrir.",
      },
      submit: "Commencer",
    },
    avatar: {
      title: "Choisissez une photo",
      subtitle:
        "Elle s’affiche à côté de votre curseur sur le tableau : les autres savent qui dessine. Vous pouvez passer cette étape et en ajouter une plus tard.",
      saveAndContinue: "Enregistrer et continuer",
    },
    firstRoom: {
      title: "Ouvrez votre première salle",
      subtitle:
        "Lancez-en une et partagez le code, ou entrez dans une salle déjà ouverte.",
      create: {
        title: "Créer une salle",
        description: "Ouvrez un tableau et partagez le code avec votre groupe.",
      },
      join: {
        title: "Rejoindre avec un code",
        description: "Entrez dans une salle que quelqu’un a déjà ouverte.",
      },
      later: "Je ferai ça plus tard",
    },
  },

  room: {
    metaTitle: "Salle {code}",
    back: "Retour aux salles",
    copyCode: "Copier le code de la salle",
    copyCodeTitle: "Copier le code de la salle",
    copied: "Code copié",
    tabs: "Onglets des panneaux",
    panels: "Panneaux de la salle",
    chat: "Discussion",
    files: "Fichiers",
    people: "Participants",
    closePanels: "Fermer les panneaux",
    hidePanel: "Masquer le panneau latéral",
    showPanel: "Afficher le panneau latéral",
    chatPlaceholder: "Posez une question…",
    message: "Message",
    send: "Envoyer",
    onBoard: "Sur le tableau",
    away: "Absent",
    host: "Hôte",
    guest: "Invité",
    online: "En ligne",
    offline: "Hors ligne",
    chooseFiles: "Choisir des fichiers",
    filesDropHint: "ou déposez-les ici · jusqu’à {size}",
    fileTooBig: "{name} dépasse {size} et n’a pas été partagé.",
    unavailable: {
      title: "Cette salle n’est pas disponible",
      body: "La salle a peut-être été fermée, ou le code est erroné.",
      back: "Retour à vos salles",
    },
    sync: {
      connecting: {
        text: "Connexion",
        title: "Connexion au serveur du tableau",
      },
      live: {
        text: "En direct",
        title: "Tout le monde voit votre curseur et vos modifications",
      },
      local: {
        text: "Local",
        title:
          "Ce tableau n’est enregistré que dans votre navigateur. Les autres ne le voient pas encore.",
      },
      offline: {
        text: "Hors ligne",
        title:
          "Le serveur du tableau est injoignable ; vos modifications restent sur cet appareil.",
      },
    },
  },
  validation: {
    usernameMin: "Le nom d’utilisateur doit faire au moins 3 caractères",
    usernameMax: "Le nom d’utilisateur doit faire au plus 20 caractères",
    usernameMinShort: "Au moins 3 caractères",
    usernameMaxShort: "Au plus 32 caractères",
    email: "Saisissez une adresse e-mail valide",
    passwordMin: "Le mot de passe doit faire au moins 8 caractères",
    passwordMinShort: "Au moins 8 caractères",
    passwordConfirm: "Confirmez votre mot de passe",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    currentPassword: "Saisissez votre mot de passe actuel",
    newPasswordMin: "Le nouveau mot de passe doit faire au moins 8 caractères",
    newPasswordConfirm: "Confirmez votre nouveau mot de passe",
    newPasswordSame: "Choisissez un mot de passe différent de l’actuel",
    roomNameMin: "Le nom de la salle doit faire au moins 3 caractères",
    roomNameMax: "Le nom de la salle doit faire au plus 60 caractères",
    roomSubject: "Choisissez une matière",
    roomCodeMin: "Saisissez le code de la salle",
    roomCodeMax: "Ce code paraît trop long",
    roomCodeFormat:
      "Un code ne contient que des lettres, des chiffres et des tirets",
  },

  errors: {
    notFound: {
      title: "Page introuvable",
      back: "Retour à l’accueil",
    },
    crash: {
      title: "Quelque chose a cassé",
      body: "Une erreur inattendue est survenue.",
    },
  },
} satisfies Dictionary;

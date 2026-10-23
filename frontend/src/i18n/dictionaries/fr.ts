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
    accent: "Couleur",
    accents: {
      indigo: "Indigo",
      blue: "Bleu",
      teal: "Turquoise",
      rose: "Rose",
      orange: "Orange",
    },
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
    friends: "Amis",
    messages: "Messages",
    notifications: "Notifications",
    unreadNotifications: "Notifications, non lues : {count}",
    collapseSidebar: "Réduire la barre latérale",
    expandSidebar: "Déployer la barre latérale",
    signedOut: "Déconnecté",
    noSession: "Aucune session",
    signOut: "Se déconnecter",
    signOutConfirm: {
      title: "Se déconnecter ?",
      description: "Vous devrez vous reconnecter pour accéder à vos rooms.",
    },
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
      legal: "Informations légales",
      privacy: "Politique de confidentialité",
      terms: "Conditions d’utilisation",
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

  legal: {
    lastUpdated: "Dernière mise à jour : 20 octobre 2026",
    privacy: {
      title: "Politique de confidentialité",
      description:
        "Comment Shared Room collecte, utilise et protège vos données.",
      intro:
        "Cette politique explique quelles informations Shared Room traite lorsque vous créez un compte et utilisez ses fonctions collaboratives.",
      sections: [
        {
          title: "Informations collectées",
          body: "Nous traitons les informations de compte que vous fournissez, notamment votre nom d’utilisateur, votre adresse e-mail, votre mot de passe sous forme hachée, votre biographie et votre photo de profil. Nous conservons également les salles, messages, amitiés, dessins et fichiers que vous créez ou partagez.",
        },
        {
          title: "Utilisation des informations",
          body: "Vos informations servent à gérer votre compte, fournir les salles en temps réel, la messagerie et le partage de fichiers, afficher votre profil public, assurer la sécurité et diagnostiquer les problèmes techniques.",
        },
        {
          title: "Partage et visibilité",
          body: "Votre nom d’utilisateur, votre photo, votre biographie et votre présence peuvent être visibles par les autres utilisateurs. Le contenu d’une salle est partagé avec ses membres. Les messages privés sont accessibles à leurs participants. Nous ne vendons pas vos données personnelles.",
        },
        {
          title: "Conservation et sécurité",
          body: "Nous appliquons des mesures techniques raisonnables pour protéger les informations conservées. Aucun service en ligne ne peut garantir une sécurité absolue ; évitez donc de partager des informations sensibles dans les salles, messages, fichiers ou dessins.",
        },
        {
          title: "Vos choix",
          body: "Vous pouvez modifier votre profil et votre mot de passe, supprimer vos messages lorsque le service le permet et supprimer votre compte depuis les paramètres du profil. Certains contenus associés peuvent être supprimés ou anonymisés afin de préserver les conversations partagées.",
        },
        {
          title: "Modification de cette politique",
          body: "Cette politique peut évoluer avec le service. La date ci-dessus correspond à sa dernière révision. En continuant à utiliser le service après une mise à jour, vous acceptez la politique révisée.",
        },
      ],
    },
    terms: {
      title: "Conditions d’utilisation",
      description: "Les règles applicables à l’utilisation de Shared Room.",
      intro:
        "En créant un compte ou en utilisant Shared Room, vous acceptez ces conditions. Si vous ne les acceptez pas, n’utilisez pas le service.",
      sections: [
        {
          title: "Utilisation du service",
          body: "Shared Room propose des salles collaboratives, des tableaux blancs, une messagerie et le partage de fichiers. Vous devez fournir des informations exactes, protéger vos identifiants et répondre des activités réalisées depuis votre compte.",
        },
        {
          title: "Utilisation acceptable",
          body: "Vous ne devez pas utiliser le service pour enfreindre la loi, harceler autrui, usurper une identité, diffuser des logiciels malveillants, accéder sans autorisation à un compte ou une salle, perturber le service ou publier du contenu portant atteinte aux droits d’autrui.",
        },
        {
          title: "Votre contenu",
          body: "Vous restez propriétaire du contenu que vous publiez. Vous accordez au service l’autorisation limitée nécessaire pour le stocker, le traiter et l’afficher afin de fournir les fonctions demandées. Vous devez disposer du droit de le partager.",
        },
        {
          title: "Salles et modération",
          body: "Les propriétaires peuvent gérer leurs salles et supprimer les messages des autres membres. Nous pouvons restreindre ou supprimer un compte ou un contenu afin de protéger les utilisateurs, faire respecter ces conditions ou respecter une obligation légale.",
        },
        {
          title: "Disponibilité et responsabilité",
          body: "Ce projet pédagogique est fourni selon sa disponibilité, sans garantie de fonctionnement continu ni d’absence d’erreur. Dans les limites autorisées par la loi, nous ne sommes pas responsables des pertes indirectes liées à l’utilisation ou à l’impossibilité d’utiliser le service.",
        },
        {
          title: "Modifications et résiliation",
          body: "Les fonctionnalités et ces conditions peuvent évoluer. La date ci-dessus indique la dernière révision. Vous pouvez cesser d’utiliser le service ou supprimer votre compte à tout moment ; l’accès peut être suspendu en cas de violation grave ou répétée.",
        },
      ],
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
    toolbar: {
      searchPlaceholder: "Rechercher une salle, un code, une matière…",
      searchLabel: "Rechercher une salle",
      view: "Affichage",
      cardView: "Vue en cartes",
      tableView: "Vue en tableau",
      subject: "Matière",
      allSubjects: "Toutes les matières",
      sortBy: "Trier par",
      mostRecent: "Plus récentes",
      nameAz: "Nom (A–Z)",
      mostPeople: "Plus de monde",
    },
    status: {
      active: "Active",
      archived: "Archivée",
    },
    tabs: {
      label: "Listes de salles",
      all: "Toutes",
      owned: "Les miennes",
      archived: "Archivées",
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
      joinWithCode: "Rejoindre avec un code",
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
      visibility: "Qui peut la trouver",
      public: "Publique",
      private: "Privée",
      publicHint: "Tout le monde la voit dans la liste et peut la rejoindre.",
      privateHint:
        "Seules les personnes ayant le code peuvent la rejoindre. Elle n’apparaît pas dans la liste des autres.",
    },
    join: {
      title: "Rejoindre une salle",
      description: "Saisissez le code qu’on vous a partagé.",
      code: "Code de la salle",
      codePlaceholder: "A3F9C21B",
      codeHint:
        "Un code se compose de huit lettres et chiffres, comme A3F9C21B.",
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

  friends: {
    metaTitle: "Amis",
    metaDescription:
      "Trouvez des personnes, gérez vos amis et répondez aux demandes.",
    title: "Amis",
    subtitle:
      "Trouvez des personnes, répondez aux demandes et gardez vos amis près de vous.",
    tabsLabel: "Sections des amis",
    tabs: {
      friends: "Mes amis",
      received: "Reçues",
      sent: "Envoyées",
      find: "Trouver des gens",
    },
    noBio: "Pas encore de bio",
    toolbar: {
      searchLabel: "Rechercher par nom d’utilisateur",
      searchPlaceholder: "Rechercher par nom d’utilisateur",
      findPlaceholder: "Saisissez un nom d’utilisateur pour trouver quelqu’un",
      view: "Affichage",
      cardView: "Cartes",
      tableView: "Tableau",
      sort: "Trier par",
      recent: "Plus récents",
      nameAz: "Nom A–Z",
      relationship: "Relation",
      anyone: "Tout le monde",
    },
    table: {
      person: "Personne",
      bio: "Bio",
      actions: "Actions",
      since: "Amis depuis",
      requested: "Demandée",
      relationship: "Relation",
    },
    relationship: {
      none: "Pas en contact",
      friends: "Amis",
      sent: "Demande envoyée",
      received: "Veut devenir votre ami",
    },
    actions: {
      message: "Écrire",
      messageNamed: "Écrire à {name}",
      remove: "Retirer",
      removeNamed: "Retirer {name} de vos amis",
      accept: "Accepter",
      decline: "Refuser",
      cancel: "Annuler la demande",
      add: "Ajouter",
      viewRequest: "Voir la demande",
    },
    remove: {
      title: "Retirer {name} ?",
      description:
        "Vous ne serez plus amis et la conversation disparaîtra de votre liste.",
      confirm: "Retirer l’ami",
    },
    toast: {
      requestSent: "Demande d’ami envoyée à {name}.",
      accepted: "Vous et {name} êtes maintenant amis.",
    },
    find: {
      promptTitle: "Trouvez quelqu’un",
      promptBody:
        "Saisissez une partie d’un nom d’utilisateur pour chercher parmi tous les membres de Shared Room.",
    },
    empty: {
      filteredTitle: "Personne ne correspond",
      filteredBody: "Essayez un autre nom ou effacez les filtres.",
      friends: {
        title: "Pas encore d’amis",
        body: "Cherchez des personnes dans « Trouver des gens » et envoyez-leur une demande.",
      },
      received: {
        title: "Aucune demande en attente",
        body: "Quand quelqu’un voudra être votre ami, ce sera ici.",
      },
      sent: {
        title: "Aucune demande en cours",
        body: "Les demandes que vous envoyez restent ici jusqu’à leur réponse.",
      },
      find: {
        title: "Personne trouvé",
        body: "Essayez un autre nom d’utilisateur.",
      },
    },
    error: {
      title: "Impossible de charger cette liste",
      body: "Vérifiez votre connexion et réessayez.",
    },
  },
  messages: {
    metaTitle: "Messages",
    metaDescription: "Discutez en privé avec vos amis.",
    title: "Messages",
    friends: "Amis",
    conversations: "Conversations",
    empty: {
      title: "Aucune conversation",
      body: "Appuyez sur « Écrire » sur la carte d’un ami pour en démarrer une.",
      cta: "Aller aux amis",
    },
    choose: {
      title: "Choisissez une conversation",
      body: "Sélectionnez un ami à gauche pour lire et envoyer des messages.",
    },
    you: "Vous :",
    unread: "{count} non lus",
    back: "Retour aux conversations",
    loadEarlier: "Charger les messages précédents",
    noMessages: "Aucun message. Dites bonjour à {name} !",
    seen: "Vu",
    placeholder: "Écrire un message…",
    composerLabel: "Message",
    send: "Envoyer",
    deleteMessage: "Supprimer le message",
    deleteConfirm: {
      title: "Supprimer ce message ?",
      description:
        "Ce message sera supprimé pour tout le monde. Cette action est irréversible.",
      confirm: "Supprimer le message",
    },
    error: {
      list: "Impossible de charger les conversations.",
      thread: "Impossible de charger cette conversation.",
      notFriends: "Vous ne pouvez écrire qu’à vos amis.",
    },
  },
  pagination: {
    label: "Pagination",
    empty: "Rien à afficher",
    showing: "{from}–{to} sur {total}",
    perPage: "{count} / page",
    perPageLabel: "Éléments par page",
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
    friendsOnline: {
      title: "Amis en ligne",
      count: "{count} en ligne",
      empty: "Aucun de vos amis n’est en ligne pour le moment.",
    },
  },

  publicProfile: {
    metaTitle: "Profil utilisateur",
    metaDescription: "Consultez le profil public d’un membre de Shared Room.",
    backToPeople: "Voir les utilisateurs",
    noBio: "Cette personne n’a pas encore ajouté de présentation.",
    friendsSince: "Amis depuis le {date}",
    activity: "Activité",
    stats: {
      roomsJoined: "Salles rejointes",
      roomsOwned: "Salles créées",
      messagesSent: "Messages publiés",
      filesShared: "Fichiers partagés",
    },
    unavailable: {
      title: "Profil indisponible",
      body: "Ce compte n’existe pas ou n’est plus disponible.",
    },
  },
  profile: {
    metaTitle: "Profil",
    metaDescription:
      "Gérez votre photo, vos informations et votre mot de passe.",
    appearance: {
      title: "Apparence",
      description:
        "Choisissez le thème et la couleur d'accent. Ils sont enregistrés sur cet appareil.",
      language: "Langue",
      languageAuto: "Langue du navigateur",
    },
    header: {
      joined: "Inscrit le {date}",
      viewPublicProfile: "Voir mon profil public",
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
    apiKeys: {
      title: "Clés API",
      description:
        "Connectez des applications externes aux salles dont vous êtes propriétaire sans partager votre mot de passe.",
      documentation: "Ouvrir la documentation API",
      create: "Créer une clé API",
      loadError: "Impossible de charger vos clés API.",
      empty: "Aucune clé API",
      emptyHint:
        "Créez une clé lorsqu’une application externe a besoin d’un accès.",
      active: "Active",
      expired: "Expirée",
      revoked: "Révoquée",
      lastUsed: "Dernière utilisation",
      neverUsed: "Jamais utilisée",
      expires: "Expire le",
      revoke: "Révoquer",
      createTitle: "Créer une clé API",
      createDescription:
        "Donnez-lui un nom reconnaissable et, si nécessaire, une date d’expiration.",
      name: "Nom de la clé",
      namePlaceholder: "Intégration CI",
      nameHint: "Ce nom sert uniquement à reconnaître la clé.",
      expiration: "Date d’expiration",
      expirationHint: "Facultatif. Laissez vide pour une clé sans expiration.",
      createdTitle: "Clé API créée",
      createdDescription:
        "C’est la seule fois où la clé complète sera affichée.",
      copyWarning:
        "Copiez et conservez cette clé en lieu sûr avant de fermer cette fenêtre.",
      copy: "Copier la clé API",
      revokeTitle: "Révoquer cette clé API ?",
      revokeDescription:
        "Les applications qui l’utilisent perdront immédiatement leur accès. Cette action est irréversible.",
      confirmRevoke: "Révoquer la clé",
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
      bio: "Bio",
      bioPlaceholder: "Quelques mots sur vous",
      bioCount: "{count} / 280",
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

  room: {
    metaTitle: "Salle",
    leave: "Quitter la salle",
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
    fileFailed: "Le fichier n’a pas pu être envoyé ou enregistré.",
    download: "Télécharger {name}",
    deleteFile: "Supprimer {name}",
    deleteFileConfirm: {
      title: "Supprimer ce fichier ?",
      description:
        "{name} sera supprimé pour tous les membres de la room. Cette action est irréversible.",
      confirm: "Supprimer le fichier",
    },
    fileTooBig: "{name} dépasse {size} et n’a pas été partagé.",
    fileTypeNotAllowed: "Le type de fichier de {name} n’est pas accepté.",
    uploadProgress: "Progression de l’envoi du fichier",
    previewFile: "Prévisualiser {name}",
    pdfPreview: "Aperçu du PDF",
    invite: "Inviter",
    inviteTitle: "Inviter des participants",
    inviteBody: "Toute personne ayant ce code peut rejoindre la salle.",
    copyInviteCode: "Copier le code",
    openPanel: "Ouvrir : {panel}",
    closePanel: "Fermer le panneau",
    unreadChat: "{count} non lus",
    you: "Vous",
    messagesLabel: "Messages",
    chatEmpty: {
      title: "Aucun message",
      body: "Posez une question ou partagez une idée. Toute la salle la voit.",
    },
    jumpToLatest: "Derniers messages",
    newMessages: "Nouveaux messages",
    sendHint: "Entrée pour envoyer · Maj+Entrée pour un retour à la ligne",
    sendFailed:
      "Votre message n'a pas été envoyé. Il est revenu dans le champ : réessayez.",
    filesEmpty: {
      title: "Aucun fichier",
      body: "Partagez des notes, des exercices ou des images avec toute la salle.",
    },
    uploadFiles: "Envoyer des fichiers",
    dropFiles: "Déposez les fichiers pour les partager",
    peopleOnline: "En ligne · {count}",
    peopleOffline: "Hors ligne · {count}",
    unavailable: {
      title: "Cette salle n’est pas disponible",
      body: "La salle a peut-être été fermée, ou vous n’en êtes pas membre.",
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
  notifications: {
    metaTitle: "Notifications",
    title: "Notifications",
    description:
      "Suivez les activités concernant votre compte et vos salles partagées.",
    markAllRead: "Tout marquer comme lu",
    seeAll: "Voir toutes les notifications",
    loading: "Chargement des notifications…",
    loadError: "Impossible de charger les notifications.",
    empty: "Aucune notification",
    emptyDescription: "Les nouvelles activités apparaîtront ici.",
    unread: "Notification non lue",
    delete: "Supprimer la notification",
    someone: "Quelqu’un",
    aRoom: "une salle",
    aFile: "un fichier",
    types: {
      FRIEND_REQUEST: "{actor} vous a envoyé une demande d’ami.",
      FRIEND_REQUEST_ACCEPTED: "{actor} a accepté votre demande d’ami.",
      FRIEND_REQUEST_REJECTED: "{actor} a refusé votre demande d’ami.",
      FRIEND_REMOVED: "{actor} vous a retiré de ses amis.",
      NEW_DIRECT_MESSAGE: "{actor} vous a envoyé un message.",
      DIRECT_MESSAGE_DELETED: "{actor} a supprimé un message privé.",
      ROOM_CREATED: "La salle {room} a été créée.",
      ROOM_UPDATED: "{actor} a modifié {room}.",
      ROOM_DELETED: "{actor} a supprimé {room}.",
      ROOM_MEMBER_JOINED: "{actor} a rejoint {room}.",
      ROOM_MEMBER_LEFT: "{actor} a quitté {room}.",
      NEW_ROOM_MESSAGE: "{actor} a publié un message dans {room}.",
      ROOM_MESSAGE_DELETED:
        "{actor} a supprimé l’un de vos messages dans {room}.",
      ROOM_FILE_UPLOADED: "{actor} a ajouté {file} dans {room}.",
      ROOM_FILE_DELETED: "{actor} a supprimé {file} de {room}.",
      PROFILE_UPDATED: "Votre profil a été modifié.",
      PASSWORD_CHANGED: "Votre mot de passe a été modifié.",
      AVATAR_UPDATED: "Votre photo de profil a été modifiée.",
      API_KEY_CREATED: "Une nouvelle clé API a été créée.",
      API_KEY_REVOKED: "Une clé API a été révoquée.",
    },
  },

  validation: {
    usernameMin: "Le nom d’utilisateur doit faire au moins 3 caractères",
    usernameMax: "Le nom d’utilisateur doit faire au plus 20 caractères",
    bioMax: "La bio doit faire au plus 280 caractères",
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

  connection: {
    lost: "Le serveur ne répond pas. Les données affichées peuvent être obsolètes.",
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

/**
 * English is the source of truth: its shape is the `Dictionary` type, so a key
 * missing from French or Arabic is a compile error, not a blank spot in the UI.
 *
 * Deliberately no `as const` — the other dictionaries have to satisfy this
 * shape with their own wording, which literal types would forbid.
 */
export const en = {
  common: {
    appName: "Shared Room",
    tagline:
      "One room. One shared workspace. Everyone sees everything in real time.",
    description:
      "A real-time collaborative classroom where everyone can write, draw, chat and share files in the same room.",
    cancel: "Cancel",
    close: "Close",
    back: "Back",
    continue: "Continue",
    tryAgain: "Try again",
    saveChanges: "Save changes",
    clear: "Clear",
    seeAll: "See all",
    people: "People",
  },

  language: {
    label: "Language",
    change: "Change language",
  },

  theme: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },

  nav: {
    main: "Main",
    navigation: "Navigation",
    openNavigation: "Open navigation",
    closeNavigation: "Close navigation",
    newRoom: "New room",
    dashboard: "Dashboard",
    allRooms: "All rooms",
    profile: "Profile",
    friends: "Friends",
    messages: "Messages",
    notifications: "Notifications",
    unreadNotifications: "Notifications, {count} unread",
    collapseSidebar: "Collapse sidebar",
    expandSidebar: "Expand sidebar",
    recent: "Recent",
    noRoomsYet: "No rooms yet.",
    signedOut: "Signed out",
    noSession: "No session",
    signOut: "Sign out",
  },

  landing: {
    sections: {
      features: "Features",
      classroom: "Classroom",
      howItWorks: "How it works",
    },
    header: {
      signIn: "Sign in",
      createRoom: "Create a Room",
    },
    footer: {
      product: "Product",
      getStarted: "Get started",
      createRoom: "Create a Room",
      joinRoom: "Join a Room",
      login: "Login",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      viewOnGithub: "View on GitHub",
      copyright: "© {year} {name}. A 42 school project.",
    },
    hero: {
      badge: "Real-time collaborative classroom",
      titleLead: "Learn together.",
      titleAccent: "Write together.",
      subtitle:
        "A real-time collaborative classroom where everyone can write, draw, chat and share files in the same room.",
      createRoom: "Create a Room",
      joinRoom: "Join a Room",
      note: "No setup. Share a link and everyone is on the same board.",
    },
    features: {
      title: "Everything you need, in one room.",
      subtitle:
        "No juggling a call, a whiteboard app and a chat window. Shared Room puts the board, the conversation and the material in a single place.",
      whiteboard: {
        title: "Collaborative whiteboard",
        description:
          "A shared infinite canvas powered by tldraw. Draw, write, add shapes and explain concepts together.",
      },
      realtime: {
        title: "Real-time collaboration",
        description:
          "Every stroke, note and shape appears for everyone instantly, with each participant's cursor visible on the board.",
        caption: "You draw it",
        captionAccent: "→ everyone sees it.",
      },
      chat: {
        title: "Real-time chat",
        description:
          "Ask and answer questions without leaving the room. Names, timestamps and who is online, right beside the board.",
      },
      files: {
        title: "File sharing",
        description:
          "Drop course material straight into the room — PDFs, images and documents everyone can open.",
        shared: "Shared",
        dropHint: "Drop a PDF, image or document",
      },
    },
    classroom: {
      title: "A classroom without the walls.",
      subtitle:
        "Everyone opens the same link and lands in the same room — whether they are in a lecture hall, a library or at their kitchen table.",
      audiences: {
        teachers: "Teachers",
        students: "Students",
        tutors: "Tutors",
        studyGroups: "Study groups",
        remoteTeams: "Remote teams",
      },
      quote: "“Let’s solve this equation together.”",
      writing: "{name} is writing on the board…",
      whileOthers: "While {name} and the others can",
      actions: {
        watch: "Watch the explanation as it is drawn",
        tryIt: "Step onto the board and try it themselves",
        ask: "Ask a question without interrupting",
        openSheet: "Pull up the exercise sheet in one click",
      },
      roles: {
        teacher: "Teacher",
        student: "Student",
      },
    },
    showcase: {
      title: "One room. Everything in view.",
      subtitle:
        "The board, the people, the conversation and the files — side by side, updating live for everyone in the room.",
      live: "Live",
      chatTitle: "Chat",
      online: "{count} online",
      files: "Files",
      roomTitle: "Mathematics — Algebra",
      messages: {
        question: "How do we factor this one?",
        answer:
          "Look for the perfect square — the middle term is the giveaway.",
        gotIt: "Got it, it’s (x + 1)²",
      },
      boardTopic: "Factoring quadratics",
      stickyTitle: "Remember",
    },
    howItWorks: {
      title: "Up and running in three steps.",
      create: {
        title: "Create or join a room",
        description:
          "Start a room and invite others with a link or a code like {code}. No install, no account juggling.",
      },
      collaborate: {
        title: "Collaborate",
        description:
          "Write, draw and explain concepts together on the shared whiteboard. Everyone edits the same canvas.",
      },
      communicate: {
        title: "Communicate",
        description:
          "Ask questions in chat and share files without ever leaving the room.",
      },
    },
    useCases: {
      title: "Built for the way people actually teach.",
      classes: {
        title: "Online classes",
        description:
          "Teachers explain concepts on an interactive shared whiteboard the whole class can follow and join in on.",
      },
      studyGroups: {
        title: "Study groups",
        description:
          "Students work through problem sets together, each one able to pick up the pen.",
      },
      tutoring: {
        title: "Private tutoring",
        description:
          "A tutor and a student share one canvas, so corrections happen in the moment instead of over email.",
      },
      workshops: {
        title: "Team workshops",
        description:
          "Remote teams brainstorm on an infinite canvas and keep the notes, sketches and files in one room.",
      },
    },
    finalCta: {
      title: "Your classroom is one room away.",
      subtitle:
        "Create a room, invite your classmates and start collaborating in real time.",
    },
  },

  legal: {
    lastUpdated: "Last updated: October 20, 2026",
    privacy: {
      title: "Privacy Policy",
      description: "How Shared Room collects, uses and protects your data.",
      intro:
        "This policy explains what information Shared Room processes when you create an account and use its collaborative features.",
      sections: [
        {
          title: "Information we collect",
          body: "We process the account details you provide, such as your username, email address, password in hashed form, biography and profile picture. We also store the rooms, messages, friendships, drawings and files you create or share.",
        },
        {
          title: "How we use information",
          body: "Your information is used to operate your account, provide real-time rooms, messages and file sharing, display your public profile, maintain security and diagnose technical problems.",
        },
        {
          title: "Sharing and visibility",
          body: "Your username, profile picture, biography and presence may be visible to other users. Room content is shared with members of that room. Direct messages are available to their participants. We do not sell your personal information.",
        },
        {
          title: "Storage and security",
          body: "We use reasonable technical measures to protect stored information. No online service can guarantee absolute security, so avoid sharing sensitive personal information in rooms, messages, files or drawings.",
        },
        {
          title: "Your choices",
          body: "You can update your profile and password, delete messages where the service permits it, and delete your account from your profile settings. Account deletion may remove or anonymize associated content where required to preserve shared conversations.",
        },
        {
          title: "Changes to this policy",
          body: "We may update this policy when the service changes. The date shown above indicates the latest revision. Continued use after an update means the revised policy applies.",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      description: "The rules that apply when using Shared Room.",
      intro:
        "By creating an account or using Shared Room, you agree to these terms. If you do not agree, do not use the service.",
      sections: [
        {
          title: "Using the service",
          body: "Shared Room provides collaborative rooms, whiteboards, messaging and file sharing. You must provide accurate account information, keep your credentials secure and take responsibility for activity performed through your account.",
        },
        {
          title: "Acceptable use",
          body: "Do not use the service to break the law, harass others, impersonate someone, distribute malware, access accounts or rooms without permission, disrupt the service, or upload content that infringes another person's rights.",
        },
        {
          title: "Your content",
          body: "You keep ownership of content you submit. You grant the service the limited permission needed to store, process and display that content to provide the features you request. You are responsible for having the right to share it.",
        },
        {
          title: "Rooms and moderation",
          body: "Room owners may manage their rooms and remove messages from other members. We may restrict or remove accounts or content when necessary to protect users, enforce these terms or comply with legal obligations.",
        },
        {
          title: "Availability and liability",
          body: "This educational project is provided as available, without a guarantee that it will always be uninterrupted or error-free. To the extent permitted by law, we are not responsible for indirect loss caused by use of, or inability to use, the service.",
        },
        {
          title: "Changes and termination",
          body: "Features and these terms may change over time. The date above identifies the latest revision. You may stop using the service or delete your account at any time, and access may be suspended for serious or repeated violations.",
        },
      ],
    },
  },

  auth: {
    login: {
      metaTitle: "Sign in",
      metaDescription: "Sign in to rejoin your rooms.",
      title: "Welcome back",
      subtitle: "Sign in to rejoin your rooms and pick up where you left off.",
      email: "Email",
      emailPlaceholder: "you@student.42.fr",
      password: "Password",
      passwordPlaceholder: "Your password",
      submit: "Sign in",
      submitting: "Signing in…",
      failed: "Could not sign you in",
      noAccount: "New to Shared Room?",
      createAccount: "Create an account",
    },
    register: {
      metaTitle: "Create your account",
      metaDescription: "Sign up to get started.",
      title: "Create your account",
      subtitle: "Sign up to get started.",
      username: "Username",
      usernamePlaceholder: "norminette",
      email: "Email",
      emailPlaceholder: "you@student.42.fr",
      password: "Password",
      passwordPlaceholder: "At least 8 characters",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder: "Type it again",
      submit: "Create account",
      submitting: "Creating your account…",
      failed: "Could not create your account",
      created: "Account created. Sign in to continue.",
      haveAccount: "Already have an account?",
      signIn: "Sign in",
    },
    passwordStrength: {
      label: "Password strength",
      levels: {
        "0": "Too weak",
        "1": "Weak",
        "2": "Fair",
        "3": "Good",
        "4": "Strong",
      },
      checks: {
        length: "8+ characters",
        letterCase: "Upper & lowercase",
        number: "A number",
        symbol: "A symbol",
      },
      show: "Show password",
      hide: "Hide password",
    },
  },

  rooms: {
    metaTitle: "Rooms",
    metaDescription: "Browse, filter and open your collaborative rooms.",
    title: "Rooms",
    subtitle: "Browse every room you can reach, or start one of your own.",
    kpis: {
      total: "Total rooms",
      totalHint: "Across every subject",
      active: "Active",
      activeHint: "{count} archived",
      owned: "I own",
      ownedHint: "You can archive these",
      participants: "Participants",
      participantsHint: "Seats taken right now",
    },
    toolbar: {
      searchPlaceholder: "Search rooms, codes, subjects…",
      searchLabel: "Search rooms",
      view: "View",
      cardView: "Card view",
      tableView: "Table view",
      subject: "Subject",
      allSubjects: "All subjects",
      status: "Status",
      anyStatus: "Any status",
      ownership: "Ownership",
      everyonesRooms: "Everyone's rooms",
      roomsIOwn: "Rooms I own",
      roomsIJoined: "Rooms I joined",
      sortBy: "Sort by",
      mostRecent: "Most recent",
      nameAz: "Name (A–Z)",
      mostPeople: "Most people",
    },
    status: {
      active: "Active",
      archived: "Archived",
    },
    tabs: {
      label: "Room lists",
      all: "All",
      owned: "I own",
      archived: "Archived",
    },
    table: {
      room: "Room",
      subject: "Subject",
      owner: "Owner",
      people: "People",
      lastActive: "Last active",
      status: "Status",
    },
    addMenu: {
      addRoom: "Add room",
      more: "More room actions",
      joinWithCode: "Join a room with a code",
      jumpTo: "Jump to",
      roomsIOwn: "Rooms I own",
      roomsIJoined: "Rooms I joined",
      archivedRooms: "Archived rooms",
    },
    create: {
      title: "Create a room",
      description:
        "Give it a name and a subject. You get a code to share right after.",
      name: "Room name",
      namePlaceholder: "Mathematics — Algebra",
      subject: "Subject",
      subjectPlaceholder: "Pick a subject",
      submit: "Create room",
      visibility: "Who can find it",
      public: "Public",
      private: "Private",
      publicHint: "Anyone can see it in the list and join it.",
      privateHint:
        "Only people with the code can join. It stays out of the list for everyone else.",
    },
    join: {
      title: "Join a room",
      description: "Enter the code someone shared with you.",
      code: "Room code",
      codePlaceholder: "A3F9C21B",
      codeHint: "Codes are eight letters and digits, like A3F9C21B.",
      submit: "Join room",
    },
    empty: {
      filteredTitle: "No rooms match those filters",
      filteredBody: "Try a different subject, or clear the filters.",
      title: "No rooms yet",
      body: "Create one and share the code, or join a room someone else opened.",
    },
    error: {
      title: "Could not load your rooms",
      body: "Something went wrong loading your rooms.",
    },
    subjects: {
      Mathematics: "Mathematics",
      Physics: "Physics",
      "Computer Science": "Computer Science",
      Biology: "Biology",
      Chemistry: "Chemistry",
      History: "History",
      Languages: "Languages",
    },
  },

  friends: {
    metaTitle: "Friends",
    metaDescription: "Find people, manage your friends and answer requests.",
    title: "Friends",
    subtitle: "Find people, answer requests and keep your friends close.",
    tabsLabel: "Friends sections",
    tabs: {
      friends: "My friends",
      received: "Received",
      sent: "Sent",
      find: "Find people",
    },
    noBio: "No bio yet",
    toolbar: {
      searchLabel: "Search by username",
      searchPlaceholder: "Search by username",
      findPlaceholder: "Type a username to find someone",
      view: "Display",
      cardView: "Cards",
      tableView: "Table",
      sort: "Sort by",
      recent: "Most recent",
      nameAz: "Name A–Z",
      relationship: "Relationship",
      anyone: "Anyone",
    },
    table: {
      person: "Person",
      bio: "Bio",
      actions: "Actions",
      since: "Friends since",
      requested: "Requested",
      relationship: "Relationship",
    },
    relationship: {
      none: "Not connected",
      friends: "Friends",
      sent: "Request sent",
      received: "Wants to be your friend",
    },
    actions: {
      message: "Message",
      messageNamed: "Message {name}",
      remove: "Remove",
      removeNamed: "Remove {name} from your friends",
      accept: "Accept",
      decline: "Decline",
      cancel: "Cancel request",
      add: "Add friend",
      viewRequest: "View request",
    },
    remove: {
      title: "Remove {name}?",
      description:
        "You will no longer be friends and your conversation will disappear from your list.",
      confirm: "Remove friend",
    },
    toast: {
      requestSent: "Friend request sent to {name}.",
      accepted: "You and {name} are now friends.",
    },
    find: {
      promptTitle: "Find someone",
      promptBody:
        "Type part of a username above to search everyone on Shared Room.",
    },
    empty: {
      filteredTitle: "Nobody matches",
      filteredBody: "Try another name or clear the filters.",
      friends: {
        title: "No friends yet",
        body: "Search for people in “Find people” and send them a request.",
      },
      received: {
        title: "No requests waiting",
        body: "When someone asks to be your friend, it shows up here.",
      },
      sent: {
        title: "No pending requests",
        body: "Requests you send stay here until they are answered.",
      },
      find: {
        title: "Nobody found",
        body: "Try another username.",
      },
    },
    error: {
      title: "We couldn’t load this list",
      body: "Check your connection and try again.",
    },
  },
  messages: {
    metaTitle: "Messages",
    metaDescription: "Chat privately with your friends.",
    title: "Messages",
    friends: "Friends",
    conversations: "Conversations",
    empty: {
      title: "No conversations yet",
      body: "Open a friend’s profile card and press Message to start one.",
      cta: "Go to friends",
    },
    choose: {
      title: "Pick a conversation",
      body: "Choose a friend on the left to read and send messages.",
    },
    you: "You:",
    unread: "{count} unread",
    back: "Back to conversations",
    loadEarlier: "Load earlier messages",
    noMessages: "No messages yet. Say hello to {name}!",
    seen: "Seen",
    placeholder: "Write a message…",
    composerLabel: "Message",
    send: "Send",
    deleteMessage: "Delete message",
    deleteConfirm: {
      title: "Delete this message?",
      description:
        "This message will be removed for everyone. This cannot be undone.",
      confirm: "Delete message",
    },
    error: {
      list: "Conversations couldn’t be loaded.",
      thread: "This conversation couldn’t be loaded.",
      notFriends: "You can only message your friends.",
    },
  },
  pagination: {
    label: "Pagination",
    empty: "Nothing to show",
    showing: "Showing {from}–{to} of {total}",
    perPage: "{count} / page",
    perPageLabel: "Items per page",
    previous: "Previous page",
    next: "Next page",
    page: "Page {page}",
  },

  dashboard: {
    metaTitle: "Dashboard",
    metaDescription: "Your recent rooms and collaboration activity.",
    welcome: "Welcome back",
    welcomeNamed: "Welcome back, {name}",
    subtitle: "Here is what has been happening in your rooms.",
    browseAll: "Browse all rooms",
    stats: {
      roomsJoined: "Rooms joined",
      roomsJoinedHint: "Since you signed up",
      collaborated: "Collaborated",
      collaboratedHint: "Over the last 7 days",
      messagesSent: "Messages sent",
      messagesSentHint: "Across every room",
      filesShared: "Files shared",
      filesSharedHint: "PDFs, images, documents",
    },
    chart: {
      title: "Time on the board this week",
      subtitle: "Minutes spent in rooms, by day.",
    },
    duration: {
      hoursMinutes: "{hours}h {minutes}m",
      hours: "{hours}h",
      minutes: "{minutes}m",
    },
    recentRooms: "Recent rooms",
    friendsOnline: {
      title: "Friends online",
      count: "{count} online",
      empty: "None of your friends are online right now.",
    },
  },

  publicProfile: {
    metaTitle: "User profile",
    metaDescription: "View a Shared Room member’s public profile.",
    back: "Back to people",
    backToPeople: "Browse people",
    about: "About",
    noBio: "This person has not added a bio yet.",
    activity: "Shared activity",
    stats: {
      roomsJoined: "Rooms joined",
      roomsOwned: "Rooms created",
      messagesSent: "Room messages",
      filesShared: "Files shared",
    },
    unavailable: {
      title: "Profile unavailable",
      body: "This account does not exist or is no longer available.",
    },
  },
  profile: {
    metaTitle: "Profile",
    metaDescription: "Manage your photo, account details and password.",
    header: {
      joined: "Joined {date}",
      viewPublicProfile: "View public profile",
    },
    error: {
      title: "Could not load your profile",
      body: "Your session is not available. Sign in again to manage your account.",
    },
    password: {
      title: "Password",
      description:
        "Changing it does not sign you out of rooms you are already in.",
      current: "Current password",
      new: "New password",
      confirm: "Confirm new password",
      submit: "Change password",
      changed: "Your password has been changed.",
    },
    apiKeys: {
      title: "API keys",
      description:
        "Connect external applications to the rooms you own without sharing your password.",
      documentation: "Open API documentation",
      create: "Create API key",
      loadError: "Could not load your API keys.",
      empty: "No API keys yet",
      emptyHint: "Create a key when an external application needs access.",
      active: "Active",
      expired: "Expired",
      revoked: "Revoked",
      lastUsed: "Last used",
      neverUsed: "Never used",
      expires: "Expires",
      revoke: "Revoke",
      createTitle: "Create an API key",
      createDescription:
        "Give the key a recognizable name and, optionally, an expiration date.",
      name: "Key name",
      namePlaceholder: "CI integration",
      nameHint: "This name is only used to help you identify the key.",
      expiration: "Expiration date",
      expirationHint:
        "Optional. Leave empty for a key without an expiration date.",
      createdTitle: "API key created",
      createdDescription:
        "This is the only time the complete key will be displayed.",
      copyWarning:
        "Copy and store this key securely before closing this window.",
      copy: "Copy API key",
      revokeTitle: "Revoke this API key?",
      revokeDescription:
        "Applications using it will immediately lose access. This cannot be undone.",
      confirmRevoke: "Revoke key",
    },
    changePhoto: "Change profile photo",
    removePhoto: "Remove profile photo",
    account: {
      title: "Account details",
      description: "Your username is how other people find you in a room.",
      username: "Username",
      email: "Email",
      emailHint: "Used to sign in and to recover your account.",
      bio: "Bio",
      bioPlaceholder: "A few words about you",
      bioCount: "{count} / 280",
      saved: "Your details have been saved.",
    },
    picker: {
      label: "Photo",
      usingCurrent: "Using your current photo",
      usingInitials: "Using your initials",
      choose: "Choose a photo",
      chooseAnother: "Choose another photo",
      dropHint: "or drop an image here",
      removeSelection: "Remove selection",
      removePhoto: "Remove photo",
      hint: "Optional. PNG, JPG or WebP up to {size} — large images are shrunk before upload.",
    },
    danger: {
      title: "Delete account",
      description:
        "Your rooms, boards and messages are removed for everyone. This cannot be undone.",
      confirmLabel: "Type your username to confirm",
      confirmHint: "Type “{username}” exactly to confirm",
      submit: "Delete my account",
      cancel: "Cancel",
      confirmDescription: "Type {username} to unlock the button below.",
      permanentlyDelete: "Permanently delete",
      start: "Delete account",
    },
  },

  room: {
    metaTitle: "Room",
    back: "Back to rooms",
    leave: "Leave room",
    copyCode: "Copy room code",
    copyCodeTitle: "Copy the room code",
    copied: "Code copied",
    tabs: "Room panel tabs",
    panels: "Room panels",
    chat: "Chat",
    files: "Files",
    people: "People",
    closePanels: "Close panels",
    hidePanel: "Hide the side panel",
    showPanel: "Show the side panel",
    chatPlaceholder: "Ask a question…",
    message: "Message",
    send: "Send",
    onBoard: "On the board",
    away: "Away",
    host: "Host",
    guest: "Guest",
    online: "Online",
    offline: "Offline",
    chooseFiles: "Choose files",
    filesDropHint: "or drop them here · up to {size}",
    fileFailed: "The file could not be sent or saved.",
    download: "Download {name}",
    deleteFile: "Delete {name}",
    fileTooBig: "{name} is over {size} and was not shared.",
    fileTypeNotAllowed: "{name} is not a supported file type.",
    uploadProgress: "File upload progress",
    previewFile: "Preview {name}",
    pdfPreview: "PDF preview",
    invite: "Invite",
    inviteTitle: "Invite people",
    inviteBody: "Anyone with this code can join the room.",
    copyInviteCode: "Copy code",
    openPanel: "Open {panel}",
    closePanel: "Close panel",
    unreadChat: "{count} unread",
    you: "You",
    messagesLabel: "Messages",
    chatEmpty: {
      title: "No messages yet",
      body: "Ask a question or share an idea. Everyone in the room sees it.",
    },
    jumpToLatest: "Latest messages",
    newMessages: "New messages",
    sendHint: "Enter to send · Shift+Enter for a new line",
    filesEmpty: {
      title: "No files yet",
      body: "Share notes, exercises or images with everyone in the room.",
    },
    uploadFiles: "Upload files",
    dropFiles: "Drop files to share them",
    peopleOnline: "Online · {count}",
    peopleOffline: "Offline · {count}",
    unavailable: {
      title: "This room is not available",
      body: "The room may have been closed, or you are not a member of it.",
      back: "Back to your rooms",
    },
    sync: {
      connecting: {
        text: "Connecting",
        title: "Connecting to the board server",
      },
      live: {
        text: "Live",
        title: "Everyone sees your cursor and your edits",
      },
      local: {
        text: "Local",
        title:
          "This board is saved in your browser only. Other people cannot see it yet.",
      },
      offline: {
        text: "Offline",
        title:
          "The board server is unreachable; your edits stay on this device.",
      },
    },
  },
  notifications: {
    metaTitle: "Notifications",
    title: "Notifications",
    description: "Follow activity that concerns your account and shared rooms.",
    markAllRead: "Mark all as read",
    loading: "Loading notifications…",
    loadError: "Notifications could not be loaded.",
    empty: "No notifications",
    emptyDescription: "New activity will appear here.",
    unread: "Unread notification",
    delete: "Delete notification",
    someone: "Someone",
    aRoom: "a room",
    aFile: "a file",
    types: {
      FRIEND_REQUEST: "{actor} sent you a friend request.",
      FRIEND_REQUEST_ACCEPTED: "{actor} accepted your friend request.",
      FRIEND_REQUEST_REJECTED: "{actor} declined your friend request.",
      FRIEND_REMOVED: "{actor} removed you from their friends.",
      NEW_DIRECT_MESSAGE: "{actor} sent you a message.",
      DIRECT_MESSAGE_DELETED: "{actor} deleted a direct message.",
      ROOM_CREATED: "Room {room} was created.",
      ROOM_UPDATED: "{actor} updated {room}.",
      ROOM_DELETED: "{actor} deleted {room}.",
      ROOM_MEMBER_JOINED: "{actor} joined {room}.",
      ROOM_MEMBER_LEFT: "{actor} left {room}.",
      NEW_ROOM_MESSAGE: "{actor} posted a message in {room}.",
      ROOM_MESSAGE_DELETED: "{actor} removed one of your messages in {room}.",
      ROOM_FILE_UPLOADED: "{actor} uploaded {file} in {room}.",
      ROOM_FILE_DELETED: "{actor} deleted {file} from {room}.",
      PROFILE_UPDATED: "Your profile was updated.",
      PASSWORD_CHANGED: "Your password was changed.",
      AVATAR_UPDATED: "Your profile picture was updated.",
      API_KEY_CREATED: "A new API key was created.",
      API_KEY_REVOKED: "An API key was revoked.",
    },
  },

  validation: {
    usernameMin: "Username must be at least 3 characters",
    usernameMax: "Username must be at most 20 characters",
    bioMax: "Bio must be at most 280 characters",
    usernameMinShort: "At least 3 characters",
    usernameMaxShort: "At most 32 characters",
    email: "Enter a valid email address",
    passwordMin: "Password must be at least 8 characters",
    passwordMinShort: "At least 8 characters",
    passwordConfirm: "Confirm your password",
    passwordMismatch: "Passwords do not match",
    currentPassword: "Enter your current password",
    newPasswordMin: "New password must be at least 8 characters",
    newPasswordConfirm: "Confirm your new password",
    newPasswordSame: "Choose a password different from your current one",
    roomNameMin: "Room name must be at least 3 characters",
    roomNameMax: "Room name must be at most 60 characters",
    roomSubject: "Pick a subject",
    roomCodeMin: "Enter the room code",
    roomCodeMax: "That code looks too long",
    roomCodeFormat: "Codes use letters, numbers and dashes only",
  },

  connection: {
    lost: "The server is not responding. The data shown may be out of date.",
  },

  errors: {
    notFound: {
      title: "Page not found",
      back: "Back home",
    },
    crash: {
      title: "Something broke",
      body: "An unexpected error occurred.",
    },
  },
};

export type Dictionary = typeof en;

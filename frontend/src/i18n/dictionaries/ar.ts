import type { Dictionary } from "./en";

/**
 * Arabic (Modern Standard), written right to left.
 *
 * Numbers stay in Latin digits, the way they do on a room code, rather than
 * switching to Arabic-Indic mid-sentence.
 */
export const ar = {
  common: {
    appName: "Shared Room",
    tagline: "غرفة واحدة. مساحة عمل مشتركة. الجميع يرى كل شيء مباشرةً.",
    description:
      "قاعة دراسية تعاونية في الوقت الحقيقي، يكتب فيها الجميع ويرسمون ويتحادثون ويتشاركون الملفات في غرفة واحدة.",
    cancel: "إلغاء",
    close: "إغلاق",
    back: "رجوع",
    continue: "متابعة",
    tryAgain: "إعادة المحاولة",
    saveChanges: "حفظ التغييرات",
    clear: "مسح",
    seeAll: "عرض الكل",
    people: "المشاركون",
  },

  language: {
    label: "اللغة",
    change: "تغيير اللغة",
  },

  theme: {
    label: "المظهر",
    light: "فاتح",
    dark: "داكن",
    system: "النظام",
  },

  nav: {
    main: "الرئيسية",
    navigation: "التنقل",
    openNavigation: "فتح قائمة التنقل",
    closeNavigation: "إغلاق قائمة التنقل",
    newRoom: "غرفة جديدة",
    dashboard: "لوحة التحكم",
    allRooms: "كل الغرف",
    profile: "الملف الشخصي",
    recent: "الأحدث",
    noRoomsYet: "لا توجد غرف بعد.",
    signedOut: "غير مسجَّل الدخول",
    noSession: "لا توجد جلسة",
    signOut: "تسجيل الخروج",
  },

  landing: {
    sections: {
      features: "المزايا",
      classroom: "القاعة",
      howItWorks: "كيف تعمل",
    },
    header: {
      signIn: "تسجيل الدخول",
      createRoom: "أنشئ غرفة",
    },
    footer: {
      product: "المنتج",
      getStarted: "ابدأ الآن",
      createRoom: "أنشئ غرفة",
      joinRoom: "انضم إلى غرفة",
      login: "الدخول",
      viewOnGithub: "اعرضه على GitHub",
      copyright: "© {year} {name}. مشروع من مدرسة 42.",
    },
    hero: {
      badge: "قاعة دراسية تعاونية في الوقت الحقيقي",
      titleLead: "تعلّموا معًا.",
      titleAccent: "واكتبوا معًا.",
      subtitle:
        "قاعة دراسية تعاونية في الوقت الحقيقي، يكتب فيها الجميع ويرسمون ويتحادثون ويتشاركون الملفات في غرفة واحدة.",
      createRoom: "أنشئ غرفة",
      joinRoom: "انضم إلى غرفة",
      note: "دون أي إعداد. شارك رابطًا وسيكون الجميع على السبورة نفسها.",
    },
    features: {
      title: "كل ما تحتاجه، في غرفة واحدة.",
      subtitle:
        "لا داعي للتنقل بين مكالمة وسبورة ونافذة محادثة. يجمع Shared Room السبورة والحوار والمواد في مكان واحد.",
      whiteboard: {
        title: "سبورة تعاونية",
        description:
          "لوحة لا نهائية مشتركة تعمل بـ tldraw. ارسموا واكتبوا وأضيفوا الأشكال واشرحوا المفاهيم معًا.",
      },
      realtime: {
        title: "تعاون في الوقت الحقيقي",
        description:
          "كل خط وكل ملاحظة وكل شكل يظهر للجميع فورًا، مع ظهور مؤشر كل مشارك على السبورة.",
        caption: "أنت ترسم",
        captionAccent: "← والجميع يرى.",
      },
      chat: {
        title: "محادثة مباشرة",
        description:
          "اسأل وأجب دون مغادرة الغرفة. الأسماء والأوقات ومَن المتصل، إلى جانب السبورة تمامًا.",
      },
      files: {
        title: "مشاركة الملفات",
        description:
          "أسقِط المواد الدراسية مباشرةً في الغرفة — ملفات PDF وصور ومستندات يفتحها الجميع.",
        shared: "تمت المشاركة",
        dropHint: "أسقِط ملف PDF أو صورة أو مستندًا",
      },
    },
    classroom: {
      title: "قاعة دراسية بلا جدران.",
      subtitle:
        "يفتح الجميع الرابط نفسه فيصلون إلى الغرفة نفسها — سواء كانوا في مدرَّج أو مكتبة أو على طاولة المطبخ.",
      audiences: {
        teachers: "المعلمون",
        students: "الطلاب",
        tutors: "المدرّسون الخصوصيون",
        studyGroups: "مجموعات المذاكرة",
        remoteTeams: "الفرق عن بُعد",
      },
      quote: "«لنحلّ هذه المعادلة معًا.»",
      writing: "{name} يكتب على السبورة…",
      whileOthers: "وفي الوقت نفسه يستطيع {name} والآخرون",
      actions: {
        watch: "متابعة الشرح وهو يُكتب",
        tryIt: "الكتابة على السبورة والمحاولة بأنفسهم",
        ask: "طرح سؤال دون مقاطعة",
        openSheet: "فتح ورقة التمارين بنقرة واحدة",
      },
      roles: {
        teacher: "معلّمة",
        student: "طالب",
      },
    },
    showcase: {
      title: "غرفة واحدة. وكل شيء أمامك.",
      subtitle:
        "السبورة والمشاركون والحوار والملفات — جنبًا إلى جنب، وتتحدّث مباشرةً للجميع في الغرفة.",
      live: "مباشر",
      chatTitle: "المحادثة",
      online: "{count} متصلون",
      files: "الملفات",
      roomTitle: "الرياضيات — الجبر",
      messages: {
        question: "كيف نحلّل هذا؟",
        answer: "ابحث عن المربع الكامل — الحدّ الأوسط هو الدليل.",
        gotIt: "فهمت، إنه (x + 1)²",
      },
      boardTopic: "تحليل المقادير التربيعية",
      stickyTitle: "تذكَّر",
    },
    howItWorks: {
      title: "جاهز في ثلاث خطوات.",
      create: {
        title: "أنشئ غرفة أو انضم إليها",
        description:
          "ابدأ غرفة وادعُ الآخرين برابط أو برمز مثل {code}. دون تثبيت ودون حسابات متعددة.",
      },
      collaborate: {
        title: "تعاونوا",
        description:
          "اكتبوا وارسموا واشرحوا المفاهيم معًا على السبورة المشتركة. الجميع يحرّر اللوحة نفسها.",
      },
      communicate: {
        title: "تواصلوا",
        description:
          "اطرحوا الأسئلة في المحادثة وشاركوا الملفات دون مغادرة الغرفة.",
      },
    },
    useCases: {
      title: "مصمَّم لطريقة التدريس الحقيقية.",
      classes: {
        title: "الدروس عن بُعد",
        description:
          "يشرح المعلمون على سبورة مشتركة تفاعلية يتابعها الصف كله ويشارك فيها.",
      },
      studyGroups: {
        title: "مجموعات المذاكرة",
        description:
          "يحلّ الطلاب التمارين معًا، ويستطيع كل واحد منهم أن يمسك القلم.",
      },
      tutoring: {
        title: "الدروس الخصوصية",
        description:
          "يتشارك المدرّس والطالب لوحة واحدة، فتتم التصحيحات في حينها بدل البريد الإلكتروني.",
      },
      workshops: {
        title: "ورش العمل",
        description:
          "تتبادل الفرق عن بُعد الأفكار على لوحة لا نهائية وتحتفظ بالملاحظات والرسوم والملفات في غرفة واحدة.",
      },
    },
    finalCta: {
      title: "قاعتك على بُعد غرفة واحدة.",
      subtitle: "أنشئ غرفة وادعُ زملاءك وابدأوا التعاون في الوقت الحقيقي.",
    },
  },

  auth: {
    login: {
      metaTitle: "تسجيل الدخول",
      metaDescription: "سجّل الدخول للعودة إلى غرفك.",
      title: "أهلًا بعودتك",
      subtitle: "سجّل الدخول للعودة إلى غرفك ومتابعة ما بدأته.",
      username: "اسم المستخدم",
      usernamePlaceholder: "اسم المستخدم الخاص بك",
      password: "كلمة المرور",
      passwordPlaceholder: "كلمة المرور الخاصة بك",
      submit: "تسجيل الدخول",
      submitting: "جارٍ تسجيل الدخول…",
      failed: "تعذّر تسجيل دخولك",
      noAccount: "جديد على Shared Room؟",
      createAccount: "أنشئ حسابًا",
    },
    register: {
      metaTitle: "إنشاء حساب",
      metaDescription: "سجّل لتبدأ.",
      title: "أنشئ حسابك",
      subtitle: "سجّل لتبدأ.",
      username: "اسم المستخدم",
      usernamePlaceholder: "norminette",
      email: "البريد الإلكتروني",
      emailPlaceholder: "you@student.42.fr",
      password: "كلمة المرور",
      passwordPlaceholder: "8 أحرف على الأقل",
      confirmPassword: "تأكيد كلمة المرور",
      confirmPasswordPlaceholder: "أعد كتابتها",
      submit: "إنشاء الحساب",
      submitting: "جارٍ إنشاء حسابك…",
      failed: "تعذّر إنشاء حسابك",
      haveAccount: "لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
    },
    passwordStrength: {
      label: "قوة كلمة المرور",
      levels: {
        "0": "ضعيفة جدًا",
        "1": "ضعيفة",
        "2": "مقبولة",
        "3": "جيدة",
        "4": "قوية",
      },
      checks: {
        length: "8 أحرف أو أكثر",
        letterCase: "حرف كبير وحرف صغير",
        number: "رقم",
        symbol: "رمز",
      },
      show: "إظهار كلمة المرور",
      hide: "إخفاء كلمة المرور",
    },
  },

  rooms: {
    metaTitle: "الغرف",
    metaDescription: "تصفّح غرفك التعاونية وصفِّها وافتحها.",
    title: "الغرف",
    subtitle: "تصفّح كل غرفة يمكنك الوصول إليها، أو ابدأ غرفتك الخاصة.",
    kpis: {
      total: "إجمالي الغرف",
      totalHint: "في جميع المواد",
      active: "نشطة",
      activeHint: "{count} مؤرشفة",
      owned: "غرفي",
      ownedHint: "يمكنك أرشفتها",
      participants: "المشاركون",
      participantsHint: "المقاعد المشغولة الآن",
    },
    toolbar: {
      searchPlaceholder: "ابحث عن غرفة أو رمز أو مادة…",
      searchLabel: "البحث عن غرفة",
      view: "العرض",
      cardView: "عرض البطاقات",
      tableView: "عرض الجدول",
      subject: "المادة",
      allSubjects: "كل المواد",
      status: "الحالة",
      anyStatus: "كل الحالات",
      ownership: "الملكية",
      everyonesRooms: "غرف الجميع",
      roomsIOwn: "غرفي",
      roomsIJoined: "الغرف التي انضممت إليها",
      sortBy: "الترتيب حسب",
      mostRecent: "الأحدث",
      nameAz: "الاسم (أ–ي)",
      mostPeople: "الأكثر مشاركين",
    },
    status: {
      active: "نشطة",
      archived: "مؤرشفة",
    },
    table: {
      room: "الغرفة",
      subject: "المادة",
      owner: "المالك",
      people: "الأشخاص",
      lastActive: "آخر نشاط",
      status: "الحالة",
    },
    addMenu: {
      addRoom: "إضافة غرفة",
      more: "إجراءات أخرى",
      joinWithCode: "الانضمام برمز",
      jumpTo: "انتقل إلى",
      roomsIOwn: "غرفي",
      roomsIJoined: "الغرف التي انضممت إليها",
      archivedRooms: "الغرف المؤرشفة",
    },
    create: {
      title: "إنشاء غرفة",
      description: "امنحها اسمًا ومادة. ستحصل فورًا على رمز لمشاركته.",
      name: "اسم الغرفة",
      namePlaceholder: "الرياضيات — الجبر",
      subject: "المادة",
      subjectPlaceholder: "اختر مادة",
      submit: "إنشاء الغرفة",
    },
    join: {
      title: "الانضمام إلى غرفة",
      description: "أدخل الرمز الذي شاركه معك أحدهم.",
      code: "رمز الغرفة",
      codePlaceholder: "ALG-4271",
      codeHint: "يتكوّن الرمز من ثلاثة أحرف وشرطة وأربعة أرقام.",
      submit: "انضمام",
    },
    empty: {
      filteredTitle: "لا توجد غرف تطابق هذه المرشّحات",
      filteredBody: "جرّب مادة أخرى، أو امسح المرشّحات.",
      title: "لا توجد غرف بعد",
      body: "أنشئ واحدة وشارك رمزها، أو انضم إلى غرفة فتحها شخص آخر.",
    },
    error: {
      title: "تعذّر تحميل غرفك",
      body: "حدث خطأ أثناء تحميل غرفك.",
    },
    subjects: {
      Mathematics: "الرياضيات",
      Physics: "الفيزياء",
      "Computer Science": "علوم الحاسوب",
      Biology: "الأحياء",
      Chemistry: "الكيمياء",
      History: "التاريخ",
      Languages: "اللغات",
    },
  },

  pagination: {
    label: "تصفّح الصفحات",
    empty: "لا توجد غرف لعرضها",
    showing: "{from}–{to} من {total}",
    perPage: "{count} / صفحة",
    perPageLabel: "عدد الغرف في الصفحة",
    previous: "الصفحة السابقة",
    next: "الصفحة التالية",
    page: "صفحة {page}",
  },

  dashboard: {
    metaTitle: "لوحة التحكم",
    metaDescription: "غرفك الأخيرة ونشاطك التعاوني.",
    welcome: "أهلًا بعودتك",
    welcomeNamed: "أهلًا بعودتك يا {name}",
    subtitle: "إليك ما جرى في غرفك.",
    browseAll: "تصفّح كل الغرف",
    stats: {
      roomsJoined: "الغرف المنضم إليها",
      roomsJoinedHint: "منذ تسجيلك",
      collaborated: "وقت التعاون",
      collaboratedHint: "خلال الأيام السبعة الماضية",
      messagesSent: "الرسائل المرسلة",
      messagesSentHint: "في جميع الغرف",
      filesShared: "الملفات المشتركة",
      filesSharedHint: "ملفات PDF وصور ومستندات",
    },
    chart: {
      title: "الوقت على السبورة هذا الأسبوع",
      subtitle: "الدقائق التي قضيتها في الغرف، يومًا بيوم.",
    },
    duration: {
      hoursMinutes: "{hours} س {minutes} د",
      hours: "{hours} س",
      minutes: "{minutes} د",
    },
    recentRooms: "الغرف الأخيرة",
  },

  profile: {
    metaTitle: "الملف الشخصي",
    metaDescription: "أدِر صورتك وبيانات حسابك وكلمة مرورك.",
    header: {
      joined: "انضم في {date}",
    },
    error: {
      title: "تعذّر تحميل ملفك الشخصي",
      body: "جلستك غير متاحة. سجّل الدخول من جديد لإدارة حسابك.",
    },
    password: {
      title: "كلمة المرور",
      description: "تغييرها لا يُخرجك من الغرف التي أنت فيها بالفعل.",
      current: "كلمة المرور الحالية",
      new: "كلمة المرور الجديدة",
      confirm: "تأكيد كلمة المرور الجديدة",
      submit: "تغيير كلمة المرور",
      changed: "تم تغيير كلمة المرور.",
    },
    changePhoto: "تغيير صورة الملف الشخصي",
    removePhoto: "إزالة صورة الملف الشخصي",
    account: {
      title: "بيانات الحساب",
      description: "اسم المستخدم هو ما يجدك به الآخرون داخل الغرفة.",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      emailHint: "يُستخدم لتسجيل الدخول ولاستعادة حسابك.",
      saved: "تم حفظ بياناتك.",
    },
    picker: {
      label: "الصورة",
      usingCurrent: "تُستخدم صورتك الحالية",
      usingInitials: "تُستخدم الأحرف الأولى من اسمك",
      choose: "اختر صورة",
      chooseAnother: "اختر صورة أخرى",
      dropHint: "أو أسقِط صورة هنا",
      removeSelection: "إزالة الاختيار",
      removePhoto: "إزالة الصورة",
      hint: "اختياري. PNG أو JPG أو WebP حتى {size} — تُصغَّر الصور الكبيرة قبل الرفع.",
    },
    danger: {
      title: "حذف الحساب",
      description:
        "ستُحذف غرفك وسبوراتك ورسائلك للجميع. لا يمكن التراجع عن هذا.",
      confirmLabel: "اكتب اسم المستخدم للتأكيد",
      confirmHint: "اكتب «{username}» تمامًا للتأكيد",
      submit: "حذف حسابي",
      cancel: "إلغاء",
      confirmDescription: "اكتب {username} لتفعيل الزر أدناه.",
      permanentlyDelete: "حذف نهائي",
      start: "حذف الحساب",
    },
  },

  onboarding: {
    metaTitle: "ابدأ الآن",
    metaDescription: "أعدّ ملفك الشخصي وافتح غرفتك الأولى.",
    progress: "الخطوة {current} من {total} · {label}",
    progressLabel: "التقدّم",
    steps: {
      welcome: "مرحبًا",
      picture: "الصورة",
      firstRoom: "الغرفة الأولى",
    },
    welcome: {
      title: "مرحبًا 👋",
      titleNamed: "مرحبًا يا {name} 👋",
      subtitle:
        "‏Shared Room غرفة واحدة يكتب فيها الجميع ويرسمون ويتحادثون معًا. خطوتان سريعتان وتصبح بالداخل.",
      board: {
        title: "سبورة يرسم عليها الجميع",
        description: "لوحة لا نهائية، تتشاركها الغرفة كلها.",
      },
      chat: {
        title: "محادثة في صلب الموضوع",
        description: "اطرح سؤالًا دون أن تقطع الشرح.",
      },
      files: {
        title: "المواد في المتناول",
        description: "أسقِط ملف PDF أو صورة ليفتحها الجميع.",
      },
      submit: "ابدأ الآن",
    },
    avatar: {
      title: "اختر صورة",
      subtitle:
        "تظهر بجوار مؤشرك على السبورة، فيعرف الآخرون من يرسم. يمكنك تخطّي هذه الخطوة وإضافتها لاحقًا.",
      saveAndContinue: "حفظ ومتابعة",
    },
    firstRoom: {
      title: "افتح غرفتك الأولى",
      subtitle: "ابدأ واحدة وشارك رمزها، أو ادخل غرفة فتحها أحدهم من قبل.",
      create: {
        title: "إنشاء غرفة",
        description: "افتح سبورة وشارك الرمز مع مجموعتك.",
      },
      join: {
        title: "الانضمام برمز",
        description: "ادخل غرفة فتحها أحدهم من قبل.",
      },
      later: "سأفعل ذلك لاحقًا",
    },
  },

  room: {
    metaTitle: "غرفة {code}",
    back: "العودة إلى الغرف",
    copyCode: "نسخ رمز الغرفة",
    copyCodeTitle: "نسخ رمز الغرفة",
    copied: "تم نسخ الرمز",
    tabs: "تبويبات اللوحات",
    panels: "لوحات الغرفة",
    chat: "المحادثة",
    files: "الملفات",
    people: "المشاركون",
    closePanels: "إغلاق اللوحات",
    hidePanel: "إخفاء اللوحة الجانبية",
    showPanel: "إظهار اللوحة الجانبية",
    chatPlaceholder: "اطرح سؤالًا…",
    message: "رسالة",
    send: "إرسال",
    onBoard: "على السبورة",
    away: "غائب",
    host: "المضيف",
    guest: "ضيف",
    online: "متصل",
    offline: "غير متصل",
    chooseFiles: "اختر ملفات",
    filesDropHint: "أو أسقِطها هنا · حتى {size}",
    fileTooBig: "{name} يتجاوز {size} ولم تتم مشاركته.",
    unavailable: {
      title: "هذه الغرفة غير متاحة",
      body: "ربما أُغلقت الغرفة، أو أن الرمز خاطئ.",
      back: "العودة إلى غرفك",
    },
    sync: {
      connecting: {
        text: "جارٍ الاتصال",
        title: "جارٍ الاتصال بخادم السبورة",
      },
      live: {
        text: "مباشر",
        title: "يرى الجميع مؤشرك وتعديلاتك",
      },
      local: {
        text: "محلي",
        title: "هذه السبورة محفوظة في متصفحك وحده. لا يراها الآخرون بعد.",
      },
      offline: {
        text: "غير متصل",
        title: "خادم السبورة غير متاح؛ تبقى تعديلاتك على هذا الجهاز.",
      },
    },
  },
  validation: {
    usernameMin: "يجب ألا يقل اسم المستخدم عن 3 أحرف",
    usernameMax: "يجب ألا يزيد اسم المستخدم عن 30 حرفًا",
    usernameMinShort: "3 أحرف على الأقل",
    usernameMaxShort: "32 حرفًا على الأكثر",
    email: "أدخل بريدًا إلكترونيًا صالحًا",
    passwordMin: "يجب ألا تقل كلمة المرور عن 8 أحرف",
    passwordMinShort: "8 أحرف على الأقل",
    passwordConfirm: "أكّد كلمة المرور",
    passwordMismatch: "كلمتا المرور غير متطابقتين",
    currentPassword: "أدخل كلمة المرور الحالية",
    newPasswordMin: "يجب ألا تقل كلمة المرور الجديدة عن 8 أحرف",
    newPasswordConfirm: "أكّد كلمة المرور الجديدة",
    newPasswordSame: "اختر كلمة مرور مختلفة عن الحالية",
    roomNameMin: "يجب ألا يقل اسم الغرفة عن 3 أحرف",
    roomNameMax: "يجب ألا يزيد اسم الغرفة عن 60 حرفًا",
    roomSubject: "اختر مادة",
    roomCodeMin: "أدخل رمز الغرفة",
    roomCodeMax: "يبدو هذا الرمز طويلًا جدًا",
    roomCodeFormat: "يتكوّن الرمز من حروف وأرقام وشرطات فقط",
  },

  errors: {
    notFound: {
      title: "الصفحة غير موجودة",
      back: "العودة إلى الرئيسية",
    },
    crash: {
      title: "حدث خلل ما",
      body: "وقع خطأ غير متوقع.",
    },
  },
} satisfies Dictionary;

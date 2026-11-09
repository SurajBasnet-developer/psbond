// 🕉️ Hindu Books — free scripture library, bundled offline, forever free.
// All texts are traditional (public domain). English lines are our own free
// renderings of the sense — so you can actually read, not just recite.
//
// Line shape: { sa: 'sanskrit/devanagari…', en: 'the meaning, in plain words' }
// Prose sections use lines with only `en` (or `ne` for Nepali-facing notes).

export const SCRIPTURE_CATS = ['All', 'Gita', 'Stotra', 'Chaupai', 'Veda', 'Upanishad', 'Mantra', 'Stories'];

export const SCRIPTURES = [
  // ===================== BHAGAVAD GITA =====================
  {
    id: 'h-gita',
    emoji: '🪷',
    title: 'Bhagavad Gita',
    sub: 'The song of the Divine — 18 chapters',
    author: 'Krishna speaks · Arjuna listens',
    cat: 'Gita',
    gradient: 'linear-gradient(135deg,#f59e0b,#b45309 55%,#7c2d12)',
    tagline: 'Do your duty. Leave the fruit. Live calm and strong.',
    intro: 'On the field of Kurukshetra, Arjuna loses heart — and Krishna, his friend and charioteer, becomes his teacher. Every chapter below carries the chapter\u2019s essence and its most-loved verses, with a free plain-meaning line so anyone can read it.',
    sections: [
      {
        title: 'अध्याय १ · Arjuna Vishada Yoga — Arjuna\u2019s heavy heart',
        lines: [
          { sa: 'धृतराष्ट्र उवाच — धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥', en: 'Dhritarashtra asks: what did my sons and the Pandavas, gathered for battle on the field of dharma, do?' },
          { en: 'Essence — armies face each other. Arjuna sees his teachers, cousins, elders, friends on the other side — and the hero of the age loses feeling in his hands. His bow slips. This despair is the perfect soil for the greatest teaching ever planted.' },
        ],
      },
      {
        title: 'अध्याय २ · Samkhya Yoga — The soul cannot be killed',
        lines: [
          { sa: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः । आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥', en: 'Heat and cold, joy and grief — they come and go like contacts. They arise and pass. Endure them, Arjuna.' },
          { sa: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः । अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥', en: 'The soul is never born nor does it ever die. Unborn, eternal, ever-lasting — it is not slain when the body is slain.' },
          { sa: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥', en: 'Your right is to the work, never to its results. Do not act to enjoy outcomes — and do not let stillness become an excuse to do nothing.' },
          { sa: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय । सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥', en: 'Settled in yoga, act, giving up attachment — equal in success and failure. That evenness is called yoga.' },
          { sa: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते । सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते ॥', en: 'Dwell on objects and attachment is born; from attachment, desire; from desire, anger.' },
          { sa: 'क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः । स्मृतिभ्रंशाद्बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥', en: 'From anger comes confusion; from confusion, loss of memory; then the intellect is lost — and with it, the person is lost.' },
        ],
      },
      {
        title: 'अध्याय ३ · Karma Yoga — do the work that is truly yours',
        lines: [
          { sa: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् । स्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥', en: 'Better is one\u2019s own duty, even imperfect, than another\u2019s duty well performed. Better to die in your own path than to walk another\u2019s path in fear.' },
        ],
      },
      {
        title: 'अध्याय ४ · Jnana Karma Yoga — knowledge with action',
        lines: [
          { sa: 'कर्मण्यकर्म यः पश्येदकर्मणि च कर्म यः । स बुद्धिमान्मनुष्येषु स युक्तः कृत्स्नकर्मकृत् ॥', en: 'Who sees action in inaction and inaction in action — that person is truly wise and absorbed in yoga.' },
          { sa: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥', en: 'Whenever dharma fades and adharma rises, I manifest myself.' },
          { sa: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम् । धर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥', en: 'To uplift the good, to destroy wrongdoers, to establish dharma — I take birth age after age.' },
        ],
      },
      {
        title: 'अध्याय ५ · Karma Sanyasa Yoga — work without weight',
        lines: [
          { sa: 'भोक्तारं यज्ञतपसां सर्वलोकमहेश्वरम् । सुहृदं सर्वभूतानां ज्ञात्वा मां शान्तिमृच्छति ॥', en: 'Knowing the Lord as the enjoyer of sacrifice and austerity, the great master of all worlds, and the friend of every being — one attains peace.' },
          { en: 'Essence — sannyas is not escaping work; it is dropping the weight of “I did” and “for me”. The same desk, the same home, one freed heart.' },
        ],
      },
      {
        title: 'अध्याय ६ · Dhyana Yoga — steady self, steady mind',
        lines: [
          { sa: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् । आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥', en: 'Lift yourself up by yourself — never let yourself fall. The self alone is your friend, and the self alone your enemy.' },
          { sa: 'नात्यश्नतस्तु योगोऽस्ति न चैकान्तमनश्नतः । न चाति स्वप्नशीलस्य जाग्रतो नैव चार्जुन ॥', en: 'Yoga is not for one who eats too much, nor for one who eats too little; not for one who sleeps too much, nor who stays awake too long.' },
          { sa: 'युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु । युक्तस्वप्नावबोधस्य योगो भवति दुःखहा ॥', en: 'Moderate in food and rest, moderate in action, moderate in sleep and waking — yoga destroys sorrow for such a person.' },
          { sa: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम् । अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥', en: 'The mind is restless and hard to master, no doubt — yet it is brought under control by steady practice and letting go.' },
        ],
      },
      {
        title: 'अध्याय ७ · Jnana Vijnana Yoga — knowing the real',
        lines: [
          { sa: 'मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय । मयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव ॥', en: 'Nothing is higher than Me. All this world is strung on Me, like pearls on a thread.' },
        ],
      },
      {
        title: 'अध्याय ८ · Raja Vidya Raja Guhya — remember, even in the storm',
        lines: [
          { sa: 'तस्मात्सर्वेषु कालेषु मामनुस्मर युध्य च । मय्यर्पितमनोबुद्धिर्मामेवैष्यस्यसंशयम् ॥', en: 'At all times remember Me — and keep fighting. With your mind and intellect offered to Me, you will reach Me. No doubt.' },
        ],
      },
      {
        title: 'अध्याय ९ · Raja Vidya Yoga — the kindest promise',
        lines: [
          { sa: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते । तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥', en: 'Those who love only Me and think of Me always — for them I personally carry what they lack and guard what they have.' },
          { sa: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति । तदहं भक्त्युपहृतमश्नामि प्रयतात्मनः ॥', en: 'A leaf, a flower, a fruit, a little water — offered with love, I accept it all from a devoted heart.' },
        ],
      },
      {
        title: 'अध्याय १० · Vibhuti Yoga — where God shines',
        lines: [
          { sa: 'अहमात्मा गुडाकेश सर्वभूताशयस्थितः । अहमादिश्च मध्यं च भूतानामन्त एव च ॥', en: 'I am the Self seated in the heart of every being. I am the beginning, the middle, and the end of all.' },
        ],
      },
      {
        title: 'अध्याय ११ — the cosmic vision',
        lines: [
          { sa: 'कालोऽस्मि लोकक्षयकृत्प्रवृद्धः लोकान्समाहर्तुमिह प्रवृत्तः । ऋतेऽपि त्वां न भविष्यन्ति सर्वे येऽवस्थिताः प्रत्यनीकेषु योद्धाः ॥', en: 'I am Time, grown vast, shaking worlds toward their end. Even without you, the armies facing you will not escape.' },
          { en: 'Essence — Arjuna\u2019s heart trembles and then fills: seeing everything begin and dissolve in one divine form, he finally understands who his friend is.' },
        ],
      },
      {
        title: 'अध्याय १२ · Bhakti Yoga — the qualities the Lord loves',
        lines: [
          { sa: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च । निर्ममो निरहंकारः समदुःखसुखः क्षमी ॥', en: 'Who bears no hate for any being, is friendly and compassionate, without possessiveness or ego, equal in joy and sorrow, forgiving —' },
          { sa: 'सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः । मय्यर्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः ॥', en: '— content always, self-controlled, resolved, with mind and intellect devoted to Me: such a devotee is dear to Me.' },
        ],
      },
      {
        title: 'अध्याय १३ · Prakriti Purusha — seeing with an even eye',
        lines: [
          { sa: 'समं सर्वेषु भूतेषु तिष्ठन्तं परमेश्वरम् । विनश्यत्स्वविनश्यन्तं यः पश्यति स पश्यति ॥', en: 'One truly sees, who sees the same Lord remaining in every being — imperishable amid the perishing.' },
        ],
      },
      {
        title: 'अध्याय १४ · Gunatraya — beyond the three ropes',
        lines: [
          { sa: 'मां च योऽव्यभिचारेण भक्तियोगेन सेवते । स गुणान्समतीत्यात्तान्ब्रह्मभूयाय कल्पते ॥', en: 'Who serves Me with unswerving devotion rises beyond the gunas — sattva, rajas, tamas — and is fit for the Brahman.' },
        ],
      },
      {
        title: 'अध्याय १५ · Purushottama — the Self in every heart',
        lines: [
          { sa: 'सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च । वेदैश्च सर्वैरहमेव वेद्यो वेदान्तकृद्वेदविदेव चाहम् ॥', en: 'I sit in every heart. Memory, knowledge, their forgetting — all flow from Me. I am known by all Vedas; I make the Vedanta; I know the Vedas.' },
        ],
      },
      {
        title: 'अध्याय १६ · Daivasurasampad — grow the divine qualities',
        lines: [
          { sa: 'अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितः । दानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम् ॥', en: 'Fearlessness, purity of heart, steady learning — generosity, self-restraint, sacrifice, study, austerity, honesty: the wealth of the divine nature begins here.' },
          { en: 'Essence — courage, cleanliness, letting go, no anger, no boasting, bright speech… every one of these is trainable. Pick one this week.' },
        ],
      },
      {
        title: 'अध्याय १७ — speech as tapasya',
        lines: [
          { sa: 'अनुद्वेगकरं वाक्यं सत्यं प्रियहितं च यत् । स्वाध्यायाभ्यसनं चैव वाङ्मयं तप उच्यते ॥', en: 'Speech that upsets no one, that is true, pleasant and useful — and the study of one\u2019s own tradition: that is the discipline of words.' },
        ],
      },
      {
        title: 'अध्याय १८ · Moksha Sanyasa — the final shelter',
        lines: [
          { sa: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥', en: 'Leave every other anxiety and come to Me alone for shelter — I will free you from all that binds you. Do not grieve.' },
          { en: 'Essence — 700 verses end in one word of comfort: मा शुचः — do not weep. Your duty is done; the rest is love.' },
        ],
      },
    ],
  },

  // ===================== HANUMAN CHALISA (full) =====================
  {
    id: 'h-hanuman',
    emoji: '🚩',
    title: 'Hanuman Chalisa',
    sub: 'Full 40 chaupays · Goswami Tulsidas',
    author: 'बुद्धिहीन तनु जानिके — the door of courage',
    cat: 'Chaupai',
    gradient: 'linear-gradient(135deg,#ef4444,#b91c1c 55%,#7f1d1d)',
    tagline: 'Strength, wisdom and fearlessness — sung in 40 verses.',
    intro: 'Sung daily by millions, this short hymn of Tulsidas folds courage, devotion and sanity into 40 chaupays. Read it in one breath — or one verse a day.',
    sections: [
      {
        title: 'दोहा — the opening',
        lines: [
          { sa: 'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि । बरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥', en: 'I polish my mind\u2019s mirror with the dust of my Teacher\u2019s lotus feet, and sing the spotless fame of Ram, giver of the four true fruits of life.' },
          { sa: 'बुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार । बल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार ॥', en: ' knowing myself empty of wisdom, I remember the son of the Wind: give me strength, mind and learning; undo my faults and stings.' },
        ],
      },
      {
        title: 'चौपाई १–५ — जय हनुमान',
        lines: [
          { sa: 'जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥ १॥', en: 'Victory to Hanuman, ocean of wisdom and virtue; victory to the monkey-lord who lights the three worlds!' },
          { sa: 'राम दूत अतुलित बल धामा । अंजनि-पुत्र पवनसुत नामा ॥ २॥', en: 'Ram\u2019s messenger, matchless fort of strength, son of Anjani, hailed as the Wind\u2019s own child.' },
          { sa: 'महाबीर बिक्रम बजरंगी । कुमति निवार सुमति के संगी ॥ ३॥', en: 'Great hero, valiant as lightning (bajrang); who drives out wicked counsel and walks with the wise.' },
          { sa: 'कंचन बरन बिराज सुबेसा । कानन कुंडल कुंचित केसा ॥ ४॥', en: 'Gold-lit body, radiant presence; earrings of woven flowers, hair that curls in glory.' },
          { sa: 'हाथ बज्र औ ध्वजा बिराजै । काँधे मूँज जनेऊ साजै ॥ ५॥', en: 'Thunderbolt in one hand, his Lord\u2019s banner in the other; the sacred thread resting across his shoulder.' },
        ],
      },
      {
        title: 'चौपाई ६–१०',
        lines: [
          { sa: 'शंकर सुवन केसरीनंदन । तेज प्रताप महा जग बंदन ॥ ६॥', en: ' Called Shankar\u2019s own son, Kesari\u2019s delight; his blazing glory the whole world bows to.' },
          { sa: 'विद्यावान गुनी अति चातुर । राम काज करिबे को आतुर ॥ ७॥', en: 'Learned, virtuous, endlessly skilled — yet ever eager for Ram\u2019s smallest errand.' },
          { sa: 'प्रभु चरित्र सुनिबे को रसिया । राम लखन सीता मन बसिया ॥ ८॥', en: 'He tastes joy in hearing Ram\u2019s story — and Ram, Sita and Lakhshman live happily in his heart.' },
          { sa: 'सूक्ष्म रूप धरि सियहि दिखावा । बिकट रूप धरि लंक जरावा ॥ ९॥', en: 'Tiny beyond telling to comfort Sita; vast beyond imagination to burn Lanka.' },
          { sa: 'भीम रूप धरि असुर सँहारे । रामचंन्द्र के काज सँवारे ॥ १०॥', en: 'Massive in form to crush demons; humble in form to serve Ramchandra\u2019s work.' },
        ],
      },
      {
        title: 'चौपाई ११–१५',
        lines: [
          { sa: 'लाय सजीवन लखन जियाये । श्री रघुबीर हरषि उर लाये ॥ ११॥', en: 'He flew back the healing mountain and revived Lakshman; Ram laughed with happiness and gathered him to his chest.' },
          { sa: 'रघुपति कीन्ही बहुत बड़ाई । तुम मम प्रिय भरत सम भाई ॥ १२॥', en: 'Ram himself praised him, saying: “You are as dear to me as Bharat, my brother.”' },
          { sa: 'सहस बदन तुम्हरो जस गावैं । अस कहि श्रीपति कंठ लगावैं ॥ १३॥', en: '“A thousand mouths would be needed to sing your fame” — so said Shripati (Ram), clasping him close.' },
          { sa: 'सनकादिक ब्रह्मादि मुनीसा । नारद सारद सहित अहीसा ॥ १४॥', en: 'Sanaka and sages, Brahma and the great ones, Narada and Sharda, even the serpent-king —' },
          { sa: 'यम कुबेर दिगपाल जहां ते । कबि कोबिद कहि सके कहां ते ॥ १५॥', en: '— Yama, Kubera, the guardians of the quarters, poets and scholars — wherever your greatness is told, words give up.' },
        ],
      },
      {
        title: 'चौपाई १६–२०',
        lines: [
          { sa: 'तुम उपकार सुग्रीवहि कीन्हा । राम मिलाय राज पद दीन्हा ॥ १६॥', en: 'You lifted Sugriva; reunited him with Ram and seated him on his kingdom\u2019s throne.' },
          { sa: 'तुम्हरो मंत्र बिभीषन माना । लंकेस्वर भए सब जग जाना ॥ १७॥', en: 'Vibhishan trusted your counsel — and became Lanka\u2019s lord, known in all the world.' },
          { sa: 'जुग सहस्त्र योजन पर भानू । लील्यो ताहि मधुर फल जानू ॥ १८॥', en: 'The sun, twenty-thousand leagues away, you leapt for and caught — thinking it a sweet, ripe fruit.' },
          { sa: 'प्रभु मुद्रिका मेलि मुख माहीं । जलधि लाँघि गये अचरज नाहीं ॥ १९॥', en: 'Holding Ram\u2019s ring in your mouth, you crossed the ocean — why wonder at anything you do?' },
          { sa: 'दुर्गम काज जगत के जेते । सुगम अनुग्रह तुम्हरे तेते ॥ २०॥', en: 'Every difficult task in this world becomes easy inside your grace.' },
        ],
      },
      {
        title: 'चौपाई २१–२५ — the shield verses',
        lines: [
          { sa: 'राम दुआरे तुम रखवारे । होत न आज्ञा बिनु पैसारे ॥ २१॥', en: 'You stand gate-keeper at Ram\u2019s door; none steps ahead without your word.' },
          { sa: 'सब सुख लहै तुम्हारी सरना । तुम रच्छक काहू को डर ना ॥ २२॥', en: 'All happiness comes to whoever takes your shelter; under a protector like you, fear is a stranger.' },
          { sa: 'आपन तेज सम्हारो आपै । तीनों लोक हाँक तें काँपै ॥ २३॥', en: 'You carry your own fire, holding it in your grip; all three worlds tremble at your sinewy call.' },
          { sa: 'भूत पिसाच निकट नहिं आवै । महावीर जब नाम सुनावै ॥ २४॥', en: 'No dark force dares come close when the brave one\u2019s name is spoken.' },
          { sa: 'नासै रोग हरै सब पीरा । जपत निरन्तर हनुमत बीरा ॥ २५॥', en: 'Illness is undone, all anguish removed, for one who repeats Hanuman\u2019s name without pause.' },
        ],
      },
      {
        title: 'चौपाई २६–३०',
        lines: [
          { sa: 'संकट तें हनुमान छुड़ावै । मन क्रम वचन ध्यान जो लावै ॥ २६॥', en: 'From every crisis Hanuman frees those who bring the whole mind to him — heart, effort, word and meditation.' },
          { sa: 'सब पर राम तपस्वी राजा । तिन के काज सकल तुम साजा ॥ २७॥', en: 'Ram, the lord of yogis, is king of all — and you accomplish his every purpose.' },
          { sa: 'और मनोरथ जो कोई लावै । सोइ अमित जीवन फल पावै ॥ २८॥', en: 'Whatever wish a person brings with faith becomes an endless life\u2019s reward.' },
          { sa: 'चारों जुग परताप तुम्हारा । है परसिद्ध जगत उजियारा ॥ २९॥', en: 'Through all four ages your radiance has been famous — the whole world lit by it.' },
          { sa: 'साधु संत के तुम रखवारे । असुर निकंदन राम दुलारे ॥ ३०॥', en: 'You guard the honest and the holy; you are the demons\u2019 end and Ram\u2019s beloved.' },
        ],
      },
      {
        title: 'चौपाई ३१–३५',
        lines: [
          { sa: 'अष्ट सिद्धि नौ निधि के दाता । अस बर दीन जानकी माता ॥ ३१॥', en: 'The eight powers and nine treasures rest in your gift — so Mata Janaki blessed you.' },
          { sa: 'राम रसायन तुम्हरे पासा । सदा रहो रघुपति के दासा ॥ ३२॥', en: 'Ram\u2019s own elixir is near you; may you remain forever his servant.' },
          { sa: 'तुम्हरे भजन राम को पावै । जनम जनम के दुख बिसरावै ॥ ३३॥', en: 'By singing your praise one finds Ram — and forgets lifetimes of sorrow.' },
          { sa: 'अंत काल रघुबर पुर जाई । जहाँ जन्म हरि भक्त कहाई ॥ ३४॥', en: 'At the last hour such a one goes to Ram\u2019s city, reborn as Ram\u2019s own devotee.' },
          { sa: 'और देवता चित्त न धरई । हनुमत सेइ सर्ब सुख करई ॥ ३५॥', en: 'Fix a mind on Hanuman alone and every happiness arrives — such is his service.' },
        ],
      },
      {
        title: 'चौपाई ३६–४०',
        lines: [
          { sa: 'संकट कटै मिटै सब पीरा । जो सुमिरैं हनुमत बलबीरा ॥ ३६॥', en: 'For one who remembers mighty Hanuman — trouble is cut through, and every pain melts.' },
          { sa: 'जै जै जै हनुमान गोसाईं । कृपा करहु गुरुदेव की नाईं ॥ ३७॥', en: 'Victory, victory, victory to Lord Hanuman — bless me as only a true Teacher can.' },
          { sa: 'जो सत बार पाठ कर कोई । छूटहि बंदि महा सुख होई ॥ ३८॥', en: 'One who reads this a hundred times walks free of chains into deep happiness.' },
          { sa: 'जो यह पढ़ै हनुमान चलीसा । होय सिद्धि साखी गौरीसा ॥ ३९॥', en: 'Whoever reads the Chalisa — let this witness it — meets fulfilment, Mahesh himself its guarantor.' },
          { sa: 'तुलसीदास सदा हरि चेरा । कीजै नाथ हृदय महँ डेरा ॥ ४०॥', en: 'Tulsidas, always Hari\u2019s servant, asks only this: Lord, pitch your tent in my heart.' },
        ],
      },
      {
        title: 'दोहा — the closing prayer',
        lines: [
          { sa: 'पवनतनय संकट हरन, मंगल मूरति रूप । राम लखन सीता सहित, हृदय बसहु सुर भूप ॥', en: 'O son of the Wind, remover of crises, embodiment of blessing — stay with Ram, Lakshman and Sita, ever ruler of my heart.' },
          { en: 'Traditional close: ॥ इति श्री हनुमान चालीसा संपूर्ण ॥ — सियावर रामचंद्र की जय · पवन सुत हनुमान की जय।' },
        ],
      },
    ],
  },

  // ===================== SHIVA STOTRAS =====================
  {
    id: 'h-shiva',
    emoji: '🔱',
    title: 'Shiva Stotras',
    sub: 'Mahamrityunjaya · Rudrashtakam · Tandava',
    author: 'Adi Shankara · Tulsidas · Ravana',
    cat: 'Stotra',
    gradient: 'linear-gradient(135deg,#38bdf8,#6d28d9 60%,#1e1b4b)',
    tagline: 'Kailash in your pocket — hymns for fearlessness and calm.',
    intro: 'The great hymns to Mahadev, hand-picked and complete. Read one section slowly; the rhythm itself stills the mind.',
    sections: [
      {
        title: 'Mahamrityunjaya Mantra — the prayer of unbroken health',
        lines: [
          { sa: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥', en: 'We worship the three-eyed One, fragrant and ever-nourishing. As a ripened cucumber leaves its vine, may my spirit leave the vine of fear and death — never by cutting, but by ripening. ॐ.' },
          { en: 'How to read — 108 rounds with a mala is classic; even 11 calm repetitions each morning is a real practice.' },
        ],
      },
      {
        title: 'Om Namah Shivaya — the five syllables',
        lines: [
          { sa: 'ॐ नमः शिवाय', en: 'The five syllables न–म–शि–वा–य flow one into the next: inward bow, then brightness. The chant itself is the medicine — it steadies the breath, and heaviness passes. Whenever the mind shakes today: ॐ नमः शिवाय।' },
          { en: 'Chant it with the breath — in for ॐ; out for नमः शिवाय. Five syllables, five elements flowing back into stillness.' },
        ],
      },
      {
        title: 'Shri Rudrashtakam (Tulsidas) — complete eight verses',
        lines: [
          { sa: 'नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम् । निजं निर्गुणं निर्विकल्पं निरीहं चिदाकाशमाकाशवासं भजेऽहम् ॥ १॥', en: ' (1) I offer my being to that Lord who is liberation\u2019s very form, all-pervading, the soul of the Vedas — beyond qualities, beyond doubt, beyond needing anything to do: consciousness as vast as the sky, living in the sky of the heart.' },
          { sa: 'निराकारमोंकारमूलं तुरीयं गिराज्ञानगोतीतमीशं गिरीशम् । करालं महाकालकालं कृपालं गुणागारसंसारपारं नतोऽहम् ॥ २॥', en: '(2) I bow to the formless one rooted in ॐ, the fourth state beyond speech and knowing — fierce beyond the great Time itself, yet drowning in mercy, who ferries the world across.' },
          { sa: 'तुषाराद्रिसंकाशगौरं गभीरं मनोभूतकोटिप्रभाश्रीशरीरम् । स्फुरन्मौलिकल्लोलिनीचारुगङ्गा लसद्भालबालेन्दु कण्ठे भुजङ्गा ॥ ३॥', en: '(3) White as the snow-peak, deep as its valleys, radiance outshining a million minds; the dancing Ganga sparkles through his crown-locks, the young moon on his brow, a serpent coiled at his throat.' },
          { sa: 'चलत्कुण्डलं भ्रूसुनेत्रं विशालं प्रसन्नाननं नीलकण्ठं दयालम् । मृगाधीशचर्माम्बरं मुण्डमालं प्रियं शङ्करं सर्वनाथं भजामि ॥ ४॥', en: '(4) Earrings swinging, third-eye gleaming, face vast and gently smiling — the blue-throated, kind one wrapped in bark and deer-skin, garlanded in skulls: sweet Shankar, lord of all, I hold you in my worship.' },
          { sa: 'प्रचण्डं प्रकृष्टं प्रगल्भं परेशमखण्डमजं भानुकोटिप्रकाशम् । त्रयःशूलनिर्मूलनं शूलपाणिं भजेऽहं भवानीपतिं भावगम्यम् ॥ ५॥', en: '(5) I worship the fierce, the foremost, the fearless — unborn, unbroken, shining like ten-million suns; trident in hand, its points uprooting birth, death and their tiredness — Bhavani\u2019s lord, reached only by love.' },
          { sa: 'कलातीतकल्याणकल्पान्तकारी सदा सज्जनानन्ददाता पुरारी । चिदानन्दसंदोहमोहापहारी प्रसीद प्रसीद प्रभो मन्मथारी ॥ ६॥', en: '(6) Beyond time, always blessing, ending old eras to start them clean; ever granting the good their joy, dissolver of delusion — be well-pleased, be well-pleased, O Lord, slayer of the arrow-god of wandering want.' },
          { sa: 'न यावदुमानाथपादारविन्दं भजन्तीह लोके परे वा नराणाम् । न तावत्सुखं शान्ति सन्तापनाशं प्रसीद प्रभो सर्वभूताधिवासं ॥ ७॥', en: '(7) Till a soul seats itself at Uma\u2019s Lord\u2019s lotus feet — this world and the next hold no peace, no settled sweetness. Be pleased, O Lord — you who dwell wherever any being is.' },
          { sa: 'न जानामि योगं जपं नैव पूजां नतोऽहं सदा सर्वदा शम्भु तुभ्यम् । जराजन्मदुःखौघतातप्यमानं प्रभो पाहि आपन्नमामीशशम्भो ॥ ८॥', en: '(8) I know no yoga, no japa, no ritual — still, Shambhu, my head bows to you forever. Scorched by old age and birth and waves of grief: lift me, Lord! I am drowning, Ishashambho.' },
          { sa: 'रुद्राष्टकमिदं प्रोक्तं विप्रेण हरतुष्टये । ये पठन्ति नरा भक्त्या तेषां शम्भुः प्रसीदति ॥', en: 'Phala — this Rudrashtakam was sung by the sage for Mahesh\u2019s delight; whoever reads it with devotion — Shambhu is pleased.' },
        ],
      },
      {
        title: 'Shiva Tandava Stotram (Ravana) — first sarga, the great drum-beat',
        lines: [
          { sa: 'जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्। डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥ १॥', en: 'His head washed by the streams falling from the forest of his matted hair; the long snakes hanging like a garland from his throat; with every डम्-डम् of the damaru drum in his hand he dances the fierce Tandava — may Shiva, the auspicious one, dance blessing into us.' },
          { en: 'Essence — Ravana\u2019s own composition, built out of pure sound: read it aloud even once and the tongue discovers why this stotra is famous for dissolving heaviness.' },
        ],
      },
    ],
  },

  // ===================== DEVI =====================
  {
    id: 'h-devi',
    emoji: '🌺',
    title: 'Devi Mahatmya gems',
    sub: 'Durga Saptashati verses · Navadurga',
    author: 'The Mother, in her many forms',
    cat: 'Stotra',
    gradient: 'linear-gradient(135deg,#f472b6,#be185d 55%,#701a75)',
    tagline: 'शक्ति — the strength women and men both borrow.',
    intro: 'Short, complete, endlessly recited verses from the Durga Saptashati tradition and the Navadurga list — for strength on hard days.',
    sections: [
      {
        title: 'Ya Devi Servebhutehshu — Strength in all beings',
        lines: [
          { sa: 'या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥', en: 'To the Devi who lives in every being as strength itself — salutation, salutation, salutation again.' },
          { sa: 'या देवी सर्वभूतेषु स्मृतिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥', en: 'Who in every being rests as memory…' },
          { sa: 'या देवी सर्वभूतेषु क्षान्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥', en: 'Who in every being rests as patience…' },
          { sa: 'या देवी सर्वभूतेषु दयारूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥', en: 'Who in every being rests as everyday kindness…' },
          { sa: 'या देवी सर्वभूतेषु शान्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥', en: 'Who in every being rests as deep peace — salutation, again and again.' },
        ],
      },
      {
        title: 'Jayanti Mangala Kali — the eight names',
        lines: [
          { sa: 'जयंती मंगला काली भद्रकाली कपालिनी । दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥', en: 'Jayanti, Mangala, Kali, Bhadrakali, Kapalini; Durga, Kshama, Shiva, Dhatri, Svaha, Svadha — I bow to all of you.' },
        ],
      },
      {
        title: 'Karpooragauram Karunavtaram — the gentle face of Shiva & Shakti',
        lines: [
          { sa: 'कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम् । सदा वसन्तं हृदयारविन्दे भवं भवानीं सहितं नमामि ॥', en: 'White as camphor, compassion walking on earth; the essence of all worlds, the snake-garlanded one — who forever sits in the lotus of the heart: Bhava, together with Bhavani, I bow to you both.' },
        ],
      },
      {
        title: 'Navadurga — nine mornings, nine strengths',
        lines: [
          { en: 'शैलपुत्री — daughter of the mountain; Steady. Choose her when your feet feel unsure.' },
          { en: 'ब्रह्मचारिणी — the seeker: focus. For a week of deep work.' },
          { en: 'चन्द्रघण्टा — the moon-bell: courage that rings. When you must speak up.' },
          { en: 'कुष्माण्डा — the eight-armet maker: creation, warmth, health. Good for home & body days.' },
          { en: 'स्कन्दमाता — the protector: caretaker\u2019s vast, patient love.' },
          { en: 'कात्यायनी — the undefeated: clarity that ends complicate histories.' },
          { en: 'कालरात्रि — the dark night: she who removes the deepest dread. Read this on your worst day.' },
          { en: 'महागौरी — the great white one: after long austerity, courage grows pale, calm, clean.' },
          { en: 'सिद्धिदात्री — the grantress: who completes what was begun. endings made true.' },
        ],
      },
    ],
  },

  // ===================== RAMCHARITMANAS =====================
  {
    id: 'h-manas',
    emoji: '🏹',
    title: 'Ramcharitmanas gems',
    sub: 'Seven kands — Tulasidas\u2019s lake of Ram\u2019s deeds',
    author: 'Goswami Tulasidas · Ayodhya\u2019s beloved Ram',
    cat: 'Chaupai',
    gradient: 'linear-gradient(135deg,#22c55e,#15803d 55%,#14532d)',
    tagline: 'Maryada: where duty is done gently and completely.',
    intro: 'Seven kands, each summarised honestly — plus the chaupays that have kept households standing for four hundred years.',
    sections: [
      {
        title: 'बाल काण्ड — where the tale begins',
        lines: [
          { en: 'Tulasidas bows, then opens: the tale of Ram\u2019s birth at Ayodhya — Dasharatha\u2019s longing, Vishnu\u2019s promise, four brothers growing bright as four suns; till Sage Vishwamitra comes asking, and Ram willingly becomes a disciple\u2019s strength.' },
          { sa: 'मंगल भवन अमंगल हारी । द्रवउ सो दसरथ अज बिहारी ॥', en: 'O maker of all that is auspicious, dissolver of all that is not — pour your grace, Ayodhya\u2019s prince, Dasharatha\u2019s delight.' },
        ],
      },
      {
        title: 'अयोध्या काण्ड — renunciation in action',
        lines: [
          { en: 'Ram receives the forest-exile like morning dew leaving a leaf — pleasant, self-gathered. Bharat refuses the throne and wears the shoes for fourteen years, ruling Ayodhya from a farmer\u2019s hut at Nandigram. Discipline lived at home — the hardest task.' },
          { sa: 'होईहि सोई जो राम रचि राखा । को तरक बढ़ि सकई सो लाखा ॥', en: 'Only that happens which Ram himself ordains; can anyone out-stretch his decree?' },
        ],
      },
      {
        title: 'अरण्य काण्ड — the forest teaches',
        lines: [
          { en: 'Panchavati\u2019s peace; Shurpanakha\u2019s wounded pride; the war that answer provoked. Then the golden deer, Sita\u2019s abduction, the vulture-king Jatayu falling as he fought to protect her. Grief carried without complaint; the long wait begins.' },
        ],
      },
      {
        title: 'किष्किन्धा काण्ड — making allies of the humble',
        lines: [
          { en: 'Ram meets the exiled Sugriva, and his alliance is sealed with Hanuman — the mightiest among the smallest of peoples. The monkey-king\u2019s vow is honoured; the search for Sita spreads southward like a river in flood.' },
          { en: 'Leadership lesson hidden here: Ram eats at Sugriva\u2019s simple plate as if at a brother\u2019s fire. He invests early in the unimportant. That is why mountains moved for him.' },
        ],
      },
      {
        title: 'सुन्दर काण्ड — the leap',
        lines: [
          { en: 'The ocean crossed in one leap of devotion. The Ashoka grove, Sita\u2019s tearful joy at a servant\u2019s greeting, Lanka set alight by his tail, the warning carried home. In every household this kand is read in hard times — it is Hanuman\u2019s own chapter.' },
          { sa: 'बिनु सत्संग विवेक न होई । राम कृपा बिनु सुलभ न कोई ॥', en: 'Without good company, discrimination never dawns; without Ram\u2019s grace — nothing.' },
        ],
      },
      {
        title: 'लंका (युद्ध) काण्ड — sovereignty with a wash of tears',
        lines: [
          { en: 'Sita\u2019s courage; Kumbhakarna\u2019s long sleep ended; Indrajit\u2019s illusions broken; Lakshmana wounded and the healing mountain flown. At last Ravana\u2019s chariot stands empty and the lesson is read. The war ends where respect for the fallen begins.' },
        ],
      },
      {
        title: 'उत्तर काण्ड — beyond riches and endings',
        lines: [
          { en: 'The coronation at Ayodhya; Hanuman\u2019s love proved again; Shiva and Ram in tender dialogue (where the Rudrashtakam is sung — read it complete in the Shiva Stotras book in this app). The Manas ends asking nothing but a corner in the reader\u2019s heart.' },
        ],
      },
    ],
  },

  // ===================== UPANISHADS =====================
  {
    id: 'h-upanishad',
    emoji: '🪔',
    title: 'Upanishad wisdom',
    sub: 'Mahavakyas & shanti mantras',
    author: 'The forest sages of old India',
    cat: 'Upanishad',
    gradient: 'linear-gradient(135deg,#a78bfa,#7c3aed 55%,#4c1d95)',
    tagline: 'Where the question “who am I?” is welcomed.',
    intro: 'The Upanishads are the deep-water end of the Vedas — short, dialogues, questions asked under trees. Below: the great four Mahavakyas and the mantras you have heard all your life, finally readable.',
    sections: [
      {
        title: 'The Four Mahavakyas — one-line keys',
        lines: [
          { sa: 'प्रज्ञानं ब्रह्म (ऐतरेय उपनिषद्)', en: 'Consciousness is the Absolute. — Knowing itself, awake, is the ultimate.' },
          { sa: 'अहं ब्रह्मास्मि (बृहदारण्यक उपनिषद्)', en: 'I am the Brahman. — The deepest “I” is not a role; it is Reality itself.' },
          { sa: 'तत्त्वमसि (छान्दोग्य उपनिषद्)', en: 'You are That. — Say it gently: this thing you call “me” is not other than what is true of the universe.' },
          { sa: 'अयमात्मा ब्रह्म (माण्डूक्य उपनिषद्)', en: 'This Self is the Brahman. — No pilgrimage required; the nearest point is your own centre.' },
        ],
      },
      {
        title: 'Isha Upanishad — the fullness mantra',
        lines: [
          { sa: 'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते । पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥ ॐ शान्तिः शान्तिः शान्तिः ॥', en: ' Om. That is full; this is full. From fullness, fullness flows. When fullness is drawn from fullness, what remains is still fullness. Peace, peace, peace.' },
          { sa: 'ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥', en: 'The Lord lives in everything here that moves in the moving world. Enjoy through letting go — do not seize; whose is this wealth, after all?' },
        ],
      },
      {
        title: 'Brihadaranyaka & Chandogya shanti',
        lines: [
          { sa: 'असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मामृतं गमय । ॐ शान्तिः शान्तिः शान्तिः ॥', en: 'From the unreal, lead me to the real. From darkness, lead me to light. From death, lead me to deathlessness. Peace, peace, peace — the classic Upanishad prayer.' },
        ],
      },
      {
        title: 'Katha Upanishad — Nachiketa\u2019s questions to Yama',
        lines: [
          { sa: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत । क्षुरस्य धारा निशिता दुरत्यया दुर्गं पथस्तत्कवयो वदन्ति ॥', en: 'Arise! Wake up! Reach for the masters and learn. The path is sharp as a razor\u2019s edge, hard to cross — so the wise have said.' },
        ],
      },
      {
        title: 'Taittiriya Upanishad — the student-teacher shanti',
        lines: [
          { sa: 'ॐ सहनाववतु सहनौ भुनक्तु सहवीर्यं करवावहै । तेजस्विनावधीतमस्तु मा विद्विषावहै ॥ ॐ शान्तिः शान्तिः शान्तिः ॥', en: 'Protect us both together; nourish us both together; let us be strong together; may our learning be radiant; may we never resent each other. Peace, peace, peace.' },
        ],
      },
    ],
  },

  // ===================== VEDA =====================
  {
    id: 'h-veda',
    emoji: '🌅',
    title: 'Vedic hymns',
    sub: 'Rigveda gems & the Gayatri',
    author: 'More than three thousand years old — and still singing',
    cat: 'Veda',
    gradient: 'linear-gradient(135deg,#fb923c,#c2410c 55%,#7c2d12)',
    tagline: 'The oldest poetry humans still recite.',
    intro: 'Morning hymns from the Rigveda and the great Gayatri with its word-meanings — sunlight in syllable form.',
    sections: [
      {
        title: 'Gayatri Mantra — with word meanings',
        lines: [
          { sa: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥', en: 'Om = the one sound behind all sounds. भूर् land, भुवः the mid-realm, स्वः the illumined heavens. सवितुः that divine radiance (सूर्य). वरेण्यं most excellent. भर्गः the luminous grace. देवस्य of the shining One. धीमहि we meditate on. धियो our intellects. यः नः who us. प्रचोदयात् may He urge forward.' },
          { en: 'In one line — “May that radiant Source of the three realms tend and sharpen our thought.” Read 11 times at sunrise; you will feel it.' },
        ],
      },
      {
        title: 'Rigveda 1.164.46 — one truth, many names',
        lines: [
          { sa: 'एकं सद्विप्रा बहुधा वदन्त्यग्निं यमं मातरिश्वानमाहुः ॥', en: 'Truth is one; the wise call it by many names — physicists of the spirit, saying it as Fire, as Yama, as the Wind.' },
        ],
      },
      {
        title: 'Rigveda — the world is one family',
        lines: [
          { sa: 'कृण्वन्तो विश्वमार्यम्।', en: '“Make the whole world noble.” A Vedic mission statement — closer to a to-do list than a hymn.' },
          { sa: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥', en: 'May all be happy; may all be free of illness; may all see what is good; may none suffer. Shanti — from the bruhadaaranyaka-recited family prayer.' },
          { sa: 'ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः । वनस्पतयः शान्तिर्विश्वदेवाः शान्तिर्ब्रह्म शान्तिः सर्वं शान्तिः शान्तिरेव शान्तिः सा मा शान्तिरेधि ॥', en: ' Om: peace to the sky, to the air, to the earth, to waters, to plants and herbs, to trees, to all gods, to Brahman — peace everywhere; may that all-peace come into me.' },
        ],
      },
      {
        title: 'Purusha Sukta — first mantra (RV 10.90)',
        lines: [
          { sa: 'सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् । स भूमिं विश्वतो वृत्वात्यतिष्ठद्दशांगुलम् ॥', en: 'The Cosmic Person has a thousand heads, a thousand eyes, a thousand feet. He covers the whole earth and still stands there, ten fingers beyond it.' },
          { en: 'Essence — the very first “many players, one team” image: society, weather and sacrifice all described as organs of one great Being. Read slowly and the sense of “separate people” softens.' },
        ],
      },
      {
        title: 'Manu Smriti — dharma protects',
        lines: [
          { sa: 'धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः ।', en: 'Dharma, if you wound it, wounds you back; if you guard it, it guards you — the most quoted line of the old law-books.' },
        ],
      },
    ],
  },

  // ===================== DAILY MANTRAS =====================
  {
    id: 'h-daily',
    emoji: '🙏',
    title: 'Daily shlokas',
    sub: 'Morning · before study · on the road',
    author: 'The little mantras people actually use',
    cat: 'Mantra',
    gradient: 'linear-gradient(135deg,#facc15,#a16207 55%,#713f12)',
    tagline: 'Ten seconds each — and the day re-tunes.',
    intro: 'Short prayers for the particular hour: waking, studying, travelling, cooking, sleeping. Memorise one; it lives in you for decades.',
    sections: [
      {
        title: 'कराग्रे वसते लक्ष्मी — looking at your hands',
        lines: [
          { sa: 'कराग्रे वसते लक्ष्मीः करमध्ये सरस्वती । करमूले स्थितो ब्रह्म प्रभाते करदर्शनम् ॥', en: 'Wealth lives at the fingertips, Saraswati in the palms, Brahman at the wrist-roots — so look at your hands first thing. Then use them.' },
        ],
      },
      {
        title: 'Vakratunda — clearing the path',
        lines: [
          { sa: 'वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥', en: 'O curved-tusk one, vast-bodied, shining like ten million suns — make everything I do today free of obstacles.' },
        ],
      },
      {
        title: 'Ya Kundendu — Saraswati before study',
        lines: [
          { sa: 'या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता । या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना । या ब्रह्माच्युतशंकरप्रभृतिभिर्देवैः सदा वन्दिता । सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा ॥', en: 'White-glowing like jasmine-moon-dew, wrapped in shining cloth; fine veena resting on her hands, seated on white lotus; honoured always by Brahma, Vishnu and Shankar — may that Mother Saraswati protect me, and take away my dullness completely.' },
        ],
      },
      {
        title: 'Guru brahma — with respect for your teachers',
        lines: [
          { sa: 'गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः । गुरुरेव परं ब्रह्म तस्मै श्रीगुरवे नमः ॥', en: 'The teacher is the creator, the preserver, the destroyer of ignorance; the teacher is the highest reality itself — salutations to that teacher.' },
        ],
      },
      {
        title: 'Shubham karoti — when lighting the lamp at dusk',
        lines: [
          { sa: 'शुभं करोति कल्याणम् आरोग्यं धनसंपदा । शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥', en: 'Maker of all that is auspicious; giver of health, wealth and fortune; dissolver of ill-will in enemies\u2019 minds — salutation to the flame of the lamp.' },
        ],
      },
      {
        title: 'Samudravasane — when touching the earth',
        lines: [
          { sa: 'समुद्रवसने देवि पर्वतस्तनमण्डिते । विष्णुपत्नी नमस्तुभ्यं पादस्पर्शं क्षमस्वमे ॥', en: 'Ocean-robed, mountain-adorned, wife of Vishnu — Mother Earth, forgive my footstep as I rise.' },
        ],
      },
      {
        title: 'Shuklambaradharam — before any new beginning',
        lines: [
          { sa: 'शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् । प्रसन्नवदनं ध्यायेत्सर्वविघ्नोपशान्तये ॥', en: 'White-robed, moon-hued, four-armed, with an ever-kind face — visualise that One for a breath before you begin; obstacles subside.' },
        ],
      },
    ],
  },

  // ===================== PURANA STORIES =====================
  {
    id: 'h-stories',
    emoji: '🐘',
    title: 'Purana stories',
    sub: 'Six tales with the whole meaning in them',
    author: 'Retold for one reading, not one lifetime',
    cat: 'Stories',
    gradient: 'linear-gradient(135deg,#34d399,#0d9488 55%,#134e4a)',
    tagline: 'Myth as instruction — the oldest form of teaching.',
    intro: 'Short versions of the stories every Hindu household grows up hearing, with the point of each tale kept whole. Read one at night; they are five minutes each.',
    sections: [
      {
        title: '🥛 Samudra Manthan — churning the ocean',
        lines: [
          { en: 'The gods and asuras together churned the milky ocean, Mount Mandara as the churning rod and the great serpent as the rope. Treasures of beauty — and of poison — rose first: Shiva drank the poison and held it in his throat, hence Neelkanth, the blue-throated one. Dhanvantari\u2019s pot of amrita was finally shared among the faithful.' },
          { en: 'Point — anything worthy (amrita) comes only from shared, long, patient churning; and there is always a poison邯郸? to swallow on the way. Decide early who holds it gracefully.' },
        ],
      },
      {
        title: '🐘 Ganesha\u2019s single tusk',
        lines: [
          { en: 'Writing the Mahabharata for Vyasa, Ganesha needed a pen that never broke. When his stylus snapped, he did not stop, blame or rest — he snapped off his own tusk and continued the story to the end.' },
          { en: 'Point — commitment is a body part, not a mood. The work was bigger than the tooth; priorities must be as clear to us as they were to him.' },
        ],
      },
      {
        title: '🐍 Krishna & Kaliya',
        lines: [
          { en: 'A serpent with a thousand poisons ruled the Yamuna\u2019s waters where villages drank. Child Krishna walked straight into the water, out-danced the serpent across its every hood and grip, and finally stood on its tail — then let it live, exiled to the distant Ramanaka island.' },
          { en: 'Point — don\u2019t destroy what dominance alone produced; poison out of place can still be moved to a healthier river. Accountability survives mercy.' },
        ],
      },
      {
        title: '🦁 Narasimha — the tenth-second rescue',
        lines: [
          { en: 'Hiranyakashipu\u2019s boon made him untouchable by day or night, indoors or out, by man or beast, at ground or on sky. At dusk, on a threshold, in a pillar-form (neither man nor beast), with the demon on his lap — the Lord broke the contract right through its clauses and kept the child Prahlad alive.' },
          { en: 'Point — protection sometimes arrives in a form our plans do not allow for. Keep faith unhurried: Prahlad was five and had not wronged anyone.' },
        ],
      },
      {
        title: '🏔 Shiva catches the Ganga',
        lines: [
          { en: 'The river Ganga descended with a force ready to smash the earth. No dam existed; so Shiva asked the river\u2019s whole body to keep falling — and caught it, softly, in his matted hair, releasing it as a thousand gentle streams for the north plains\u2019 people.' },
          { en: 'Point — strength is storage capacity. The mighty score is held in the quietest feature: the hair of the still one on the hill.' },
        ],
      },
      {
        title: '🛡 Shurpanakha, or the cost of unhealed pride',
        lines: [
          { en: 'Ravana\u2019s sister Shurpanakha came to Panchavati with desire and hurt pride; every answer she received stung her more. Lakshman\u2019s blade, and the war-plan was born — her brother later burned in its flame.' },
          { en: 'Point — most wars start from one person\u2019s unhealed pride, not from the field of battle. Ask regularly: what wound is steering my reaction right now?' },
        ],
      },
    ],
  },
];

// ===== Flat list for “Shloka of the day” — every Sanskrit line + a few N/A picks =====
export const DAILY_WISDOM = SCRIPTURES.flatMap(b =>
  b.sections.flatMap(s => s.lines.filter(l => l.sa && !/Try|N\/A/.test(l.en))
    .map(l => ({ sa: l.sa, en: l.en, book: b.id, emoji: b.emoji })))
).concat([
  { en: 'संकट कटै मिटै सब पीरा — जो सुमिरै हनुमत बलबीरा.', book: 'h-hanuman', emoji: '🚩' },
  { en: 'Dharma protects the protected; the wounded dharma wounds you back.', book: 'h-veda', emoji: '🌅' },
]);

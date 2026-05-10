const Sound = (() => {
  let ctx = null;
  let enabled = true;
  const init = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  };
  const tone = (freq, duration, type = 'sine', volume = 0.15, when = 0) => {
    if (!enabled || !ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain); gain.connect(ctx.destination);
    const t = ctx.currentTime + when;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t); osc.stop(t + duration);
  };
  return {
    init,
    setEnabled: (v) => { enabled = v; if (v) init(); },
    isEnabled: () => enabled,
    click: () => { init(); tone(880, 0.08, 'square', 0.08); },
    select: () => { init(); tone(660, 0.1, 'sine', 0.12); tone(990, 0.12, 'sine', 0.1, 0.05); },
    correct: () => {
      init();
      tone(523.25, 0.15, 'sine', 0.18);
      tone(659.25, 0.15, 'sine', 0.18, 0.12);
      tone(783.99, 0.25, 'sine', 0.18, 0.24);
      tone(1046.5, 0.4, 'sine', 0.18, 0.36);
    },
    wrong: () => {
      init();
      tone(196, 0.2, 'sawtooth', 0.12);
      tone(146.83, 0.4, 'sawtooth', 0.12, 0.12);
    },
    tick: () => { init(); tone(1200, 0.04, 'square', 0.06); },
    timeUp: () => {
      init();
      tone(440, 0.12, 'square', 0.18);
      tone(330, 0.12, 'square', 0.18, 0.13);
      tone(220, 0.3, 'square', 0.18, 0.26);
    },
    win: () => {
      init();
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((f, i) => tone(f, 0.2, 'sine', 0.18, i * 0.12));
      tone(1568, 0.6, 'sine', 0.2, 0.6);
    }
  };
})();

const CATEGORIES = {
  anime: {
    id: 'anime', name: 'أنمي', icon: '🎌',
    questions: {
      easy: [
        { q: 'ما اسم البطل في أنمي One Piece صاحب القبعة القشّية؟', a: 'مونكي دي لوفي' },
        { q: 'في Naruto، ما اسم المعلّم الذي يقود الفريق السابع؟', a: 'كاكاشي هاتاكي' },
        { q: 'ما اسم القرية التي ينتمي إليها ناروتو؟', a: 'قرية كونوها (الورق)' },
        { q: 'ما اسم الفأر الكهربائي الأصفر الشهير في Pokémon؟', a: 'بيكاتشو' },
        { q: 'في Dragon Ball، ما اسم البطل الرئيسي؟', a: 'سون غوكو' },
        { q: 'ما لون شعر ساكورا في Naruto؟', a: 'وردي' },
        { q: 'ما اسم الأخ الأصغر لإدوارد في Fullmetal Alchemist؟', a: 'ألفونس إلريك' },
        { q: 'ما الفاكهة التي أكلها لوفي وأعطته قواه؟', a: 'فاكهة المطاط (Gomu Gomu)' }
      ],
      medium: [
        { q: 'في Attack on Titan، ما اسم الجدار الخارجي الذي اخترق أولاً؟', a: 'جدار ماريا' },
        { q: 'من هو مؤلف مانغا Dragon Ball؟', a: 'أكيرا تورياما' },
        { q: 'ما اسم سيف زورو الذي يحمله بفمه في One Piece؟', a: 'واتو إيتشيمونجي' },
        { q: 'من أعدى أعداء غوكو في Dragon Ball Z وله شعر يقف للأعلى؟', a: 'فيجيتا' },
        { q: 'في Demon Slayer، ما اسم الأخت التي تحوّلت إلى شيطانة؟', a: 'نيزوكو كامادو' },
        { q: 'ما اسم المنظمة في Black Clover التي ينتمي إليها أستا؟', a: 'الثيران السوداء' },
        { q: 'من بطل My Hero Academia؟', a: 'إيزوكو ميدوريا (ديكو)' },
        { q: 'في Bleach، ما اسم سيف إيشيغو الكبير؟', a: 'زانغيتسو' }
      ],
      hard: [
        { q: 'في Death Note، ما الاسم الحقيقي للمحقق L؟', a: 'إل لوليت (L Lawliet)' },
        { q: 'في أي عام بدأ بثّ أول حلقة من Neon Genesis Evangelion؟', a: '1995' },
        { q: 'من مخرج فيلم Spirited Away؟', a: 'هاياو ميازاكي' },
        { q: 'ما اسم استوديو الأنمي الذي أنتج Attack on Titan في الموسم الأخير؟', a: 'استوديو MAPPA' },
        { q: 'في Hunter x Hunter، ما اسم عائلة كيلوا للقتلة؟', a: 'عائلة زولديك' },
        { q: 'من مؤلف مانغا Berserk؟', a: 'كنتارو ميورا' },
        { q: 'ما اسم تقنية ناروتو النهائية ضد ساسكي في وادي النهاية؟', a: 'راسنغان' },
        { q: 'في Code Geass، ما اسم القناع الذي يلبسه ليلوش؟', a: 'زيرو' }
      ]
    }
  },
  movies: {
    id: 'movies', name: 'أفلام', icon: '🎬',
    questions: {
      easy: [
        { q: 'من بطل سلسلة Mission Impossible؟', a: 'توم كروز' },
        { q: 'ما اسم البطل الذي يقول "I am Iron Man"؟', a: 'توني ستارك' },
        { q: 'ما اسم الفيلم الكرتوني الذي بطلته أميرة الثلج إلسا؟', a: 'فروزن (Frozen)' },
        { q: 'من البطل الذي يقول "May the Force be with you"؟', a: 'جداي من Star Wars' },
        { q: 'ما اسم الفيلم الذي بطله أسد صغير؟', a: 'الأسد الملك (The Lion King)' },
        { q: 'من بطل أفلام Spider-Man الأخيرة لـ Marvel؟', a: 'توم هولاند' },
        { q: 'ما اسم سفينة الفضاء التي يقودها هان سولو في Star Wars؟', a: 'الميلينيوم فالكون' },
        { q: 'في Toy Story من اللعبة الكاوبوي؟', a: 'وودي' }
      ],
      medium: [
        { q: 'من أخرج Inception و Interstellar؟', a: 'كريستوفر نولان' },
        { q: 'كم عدد أفلام The Lord of the Rings الأصلية؟', a: '3 أفلام' },
        { q: 'من بطل Titanic عام 1997؟', a: 'ليوناردو دي كابريو' },
        { q: 'في The Matrix، ما لون الحبة التي يأخذها نيو ليعرف الحقيقة؟', a: 'الحمراء' },
        { q: 'ما اسم القرية الصغيرة في Harry Potter بجانب المدرسة؟', a: 'هوغسميد' },
        { q: 'من ملحّن موسيقى Star Wars و Indiana Jones؟', a: 'جون ويليامز' },
        { q: 'في Forrest Gump، ما الجملة الشهيرة عن الحياة وعلبة الشوكولاتة؟', a: '"الحياة كعلبة شوكولاتة لا تعلم ما ستحصل عليه"' },
        { q: 'ما اسم الجزيرة في Jurassic Park؟', a: 'إسلا نوبلار' }
      ],
      hard: [
        { q: 'في أي عام صدر أول فيلم Star Wars؟', a: '1977' },
        { q: 'من أخرج الفيلم السعودي "وجدة"؟', a: 'هيفاء المنصور' },
        { q: 'ما الفيلم الكوري الذي فاز بأوسكار أفضل فيلم 2020؟', a: 'باراسايت (Parasite)' },
        { q: 'في Citizen Kane، ما الكلمة التي يقولها كين قبل موته؟', a: 'روزباد (Rosebud)' },
        { q: 'من أخرج Pulp Fiction؟', a: 'كوينتن تارانتينو' },
        { q: 'ما الفيلم الذي يحمل أكبر عدد جوائز أوسكار في التاريخ؟', a: 'Ben-Hur, Titanic, LOTR (11 جائزة)' },
        { q: 'من بطل وكاتب فيلم The Artist 2011؟', a: 'جان دوجاردان' },
        { q: 'ما اسم الفيلم القصير الأول لـ Pixar؟', a: 'Luxo Jr.' }
      ]
    }
  },
  geography: {
    id: 'geography', name: 'جغرافيا', icon: '🌍',
    questions: {
      easy: [
        { q: 'ما عاصمة المملكة العربية السعودية؟', a: 'الرياض' },
        { q: 'ما أكبر قارّة في العالم؟', a: 'آسيا' },
        { q: 'في أي محافظة تقع منطقة القطيف؟', a: 'المنطقة الشرقية' },
        { q: 'ما البحر الذي تطلّ عليه القطيف؟', a: 'الخليج العربي' },
        { q: 'ما عاصمة دولة الإمارات؟', a: 'أبوظبي' },
        { q: 'ما عاصمة دولة قطر؟', a: 'الدوحة' },
        { q: 'كم عدد قارات العالم؟', a: '7 قارات' },
        { q: 'ما أكبر دولة في العالم من حيث المساحة؟', a: 'روسيا' }
      ],
      medium: [
        { q: 'ما هو أطول نهر في العالم؟', a: 'نهر النيل' },
        { q: 'ما هي أكبر صحراء حارّة في العالم؟', a: 'الصحراء الكبرى' },
        { q: 'ما العملة الرسمية في اليابان؟', a: 'الين' },
        { q: 'ما اسم المنطقة الزراعية الشهيرة المجاورة للقطيف والتي تشتهر بواحاتها ونخيلها؟', a: 'الأحساء' },
        { q: 'في أي قارة توجد دولة مصر بشكل أساسي؟', a: 'أفريقيا' },
        { q: 'ما اسم البحيرة التي تشتهر بها واحات الأحساء؟', a: 'بحيرة الأصفر' },
        { q: 'ما أعلى جبل في العالم؟', a: 'إفرست' },
        { q: 'ما هي أكبر دولة عربية مساحة؟', a: 'الجزائر' },
        { q: 'ما اسم الجزيرة التابعة للقطيف والمشهورة بآثارها التاريخية؟', a: 'جزيرة تاروت' }
      ],
      hard: [
        { q: 'ما أصغر دولة في العالم؟', a: 'مدينة الفاتيكان' },
        { q: 'ما العاصمة الإدارية لجنوب أفريقيا؟', a: 'بريتوريا' },
        { q: 'ما اسم القلعة التاريخية الموجودة في جزيرة تاروت ويعود تاريخها لآلاف السنين؟', a: 'قلعة تاروت' },
        { q: 'كم عدد الدول التي تشترك بحدود مع روسيا براً؟', a: '14 دولة' },
        { q: 'ما اسم أعمق نقطة في المحيطات؟', a: 'خندق ماريانا' },
        { q: 'ما الدولة العربية الوحيدة التي ليس لها حدود مع أي دولة عربية أخرى؟', a: 'جزر القمر' },
        { q: 'ما أطول حدود برية بين دولتين في العالم؟', a: 'بين أمريكا وكندا' },
        { q: 'في أي عام أُكمل بناء جسر الملك فهد؟', a: '1986' }
      ]
    }
  },
  history: {
    id: 'history', name: 'تاريخ', icon: '📜',
    questions: {
      easy: [
        { q: 'في أي عام تأسست المملكة العربية السعودية؟', a: '1932' },
        { q: 'من هو فاتح القسطنطينية؟', a: 'السلطان محمد الفاتح' },
        { q: 'في أي قارة وُلدت الحضارة الفرعونية؟', a: 'أفريقيا (مصر)' },
        { q: 'من هو مؤسس الدولة السعودية الأولى؟', a: 'الإمام محمد بن سعود' },
        { q: 'كم عاماً استمرت الحرب العالمية الثانية؟', a: '6 سنوات' },
        { q: 'ما اسم الحضارة القديمة التي قامت في وادي الرافدين؟', a: 'حضارة بلاد الرافدين' },
        { q: 'في أي عام هبط الإنسان على القمر لأول مرة؟', a: '1969' },
        { q: 'في أي عام انتهت الحرب الباردة بسقوط جدار برلين؟', a: '1989' }
      ],
      medium: [
        { q: 'متى وقعت معركة بدر الكبرى؟', a: 'في رمضان سنة 2 هـ' },
        { q: 'في أي عام انتهت الحرب العالمية الأولى؟', a: '1918' },
        { q: 'متى أُسست منظمة الأمم المتحدة؟', a: '1945' },
        { q: 'من هي آخر فراعنة مصر القديمة؟', a: 'كليوباترا السابعة' },
        { q: 'ما اسم المدينة المشهورة بمكتبتها العباسية الكبرى التي دُمّرت في غزو المغول؟', a: 'بغداد (دار الحكمة)' },
        { q: 'متى تم اختراع المطبعة على يد غوتنبرغ تقريباً؟', a: 'حوالي 1440' },
        { q: 'من هو القائد الذي وحّد ألمانيا في القرن التاسع عشر؟', a: 'أوتو فون بسمارك' },
        { q: 'في أي عام بدأت ثورة الياسمين في تونس التي أشعلت الربيع العربي؟', a: '2010' }
      ],
      hard: [
        { q: 'من القائد الذي هزم المغول في معركة عين جالوت؟', a: 'سيف الدين قطز' },
        { q: 'في أي عام سقطت بغداد على يد المغول؟', a: '1258 م' },
        { q: 'متى تم توحيد المملكة العربية السعودية رسمياً؟', a: '23 سبتمبر 1932' },
        { q: 'ما اسم المعاهدة التي أنهت الحرب العالمية الأولى؟', a: 'معاهدة فرساي' },
        { q: 'من أول من اخترع نظاماً للأرقام العشرية بالشكل الحديث؟', a: 'الخوارزمي' },
        { q: 'متى تأسست الخلافة العباسية؟', a: '750 م (132 هـ)' },
        { q: 'ما اسم المؤتمر الذي قُسّمت فيه أراضي الدولة العثمانية بعد الحرب العالمية الأولى؟', a: 'معاهدة سايكس-بيكو / مؤتمر سان ريمو' },
        { q: 'من هو القائد العسكري الذي قاد فرنسا في فترة الإمبراطورية وانهزم في معركة واترلو؟', a: 'نابليون بونابرت' }
      ]
    }
  },
  celebrities: {
    id: 'celebrities', name: 'مشاهير', icon: '⭐',
    questions: {
      easy: [
        { q: 'من هو لاعب كرة القدم الأرجنتيني الملقّب بـ"البرغوث"؟', a: 'ليونيل ميسي' },
        { q: 'من هو مؤسس Tesla و SpaceX؟', a: 'إيلون ماسك' },
        { q: 'من هو لاعب كرة القدم البرتغالي صاحب الرقم 7؟', a: 'كريستيانو رونالدو' },
        { q: 'من هو مؤسس Microsoft؟', a: 'بيل غيتس' },
        { q: 'من مؤسس Apple؟', a: 'ستيف جوبز' },
        { q: 'من هي الفنانة المصرية الملقّبة بـ"كوكب الشرق"؟', a: 'أم كلثوم' },
        { q: 'من هو الثنائي السعودي في "طاش ما طاش"؟', a: 'ناصر القصبي وعبدالله السدحان' },
        { q: 'من هي ملكة بريطانيا التي حكمت 70 عاماً وتوفيت 2022؟', a: 'الملكة إليزابيث الثانية' }
      ],
      medium: [
        { q: 'من هو الفنان السعودي الملقّب بـ"فنان العرب"؟', a: 'محمد عبده' },
        { q: 'من هو الممثل المصري بطل فيلم "الإرهاب والكباب"؟', a: 'عادل إمام' },
        { q: 'من هي الكاتبة صاحبة سلسلة هاري بوتر؟', a: 'ج. ك. رولينغ' },
        { q: 'من هو مدير ومؤسس Amazon؟', a: 'جيف بيزوس' },
        { q: 'من هي المغنية الأمريكية صاحبة ألبوم "1989" و "Folklore"؟', a: 'تايلور سويفت' },
        { q: 'من هو الممثل الذي لعب دور "جوكر" وفاز بأوسكار 2020؟', a: 'هواكين فينيكس' },
        { q: 'من هي مستشارة ألمانيا السابقة الأقوى في تصنيف فوربس؟', a: 'أنجيلا ميركل' },
        { q: 'من هو القائد الذي حرّر الهند بالنضال السلمي؟', a: 'المهاتما غاندي' }
      ],
      hard: [
        { q: 'من الفيزيائي الذي طوّر نظرية النسبية؟', a: 'ألبرت أينشتاين' },
        { q: 'من أول امرأة فازت بجائزة نوبل؟', a: 'ماري كوري' },
        { q: 'من هو الشاعر السعودي صاحب قصيدة "أنا اللي ما أنحني"؟', a: 'الأمير خالد الفيصل' },
        { q: 'من هو مخترع المصباح الكهربائي التجاري؟', a: 'توماس إديسون' },
        { q: 'من هي أول رائدة فضاء عربية؟', a: 'ريانة برناوي' },
        { q: 'من هو الكاتب الياباني الحاصل على جائزة نوبل للأدب 1994؟', a: 'كنزابورو أوي' },
        { q: 'من هو الرسام الإيطالي الذي رسم "العشاء الأخير"؟', a: 'ليوناردو دافنشي' },
        { q: 'من هو رئيس وزراء بريطانيا خلال الحرب العالمية الثانية؟', a: 'ونستون تشرشل' }
      ]
    }
  },
  videogames: {
    id: 'videogames', name: 'ألعاب فيديو', icon: '🎮',
    questions: {
      easy: [
        { q: 'ما اسم أخو ماريو الذي يلبس اللون الأخضر؟', a: 'لويجي' },
        { q: 'ما اسم الشخصية الرئيسية الافتراضية في ماين كرافت؟', a: 'ستيف' },
        { q: 'ما اسم لعبة Battle Royale الشهيرة من Epic Games؟', a: 'Fortnite' },
        { q: 'ما اسم منصة الألعاب الاجتماعية المشهورة عند الأطفال؟', a: 'Roblox' },
        { q: 'في PUBG، ما اسم خريطة الصحراء الشهيرة؟', a: 'ميرامار' },
        { q: 'ما اسم العدوّ اللدود لسونيك العالم الشرير ذو الشارب الأحمر؟', a: 'دكتور إيغمان (Dr. Eggman)' },
        { q: 'ما الشخصية الوحش الأخضر في Pokémon المعروفة بقدراتها الورقية؟', a: 'بلباصور' },
        { q: 'ما لعبة كرة القدم الشهيرة من EA Sports سنوياً؟', a: 'FIFA / EA FC' },
        { q: 'ما اسم سلسلة ألعاب الرعب الشهيرة من Capcom التي تدور حول فيروسات تحوّل الناس لزومبي؟', a: 'Resident Evil' },
        { q: 'في Resident Evil، ما اسم المنظمة الشريرة التي طوّرت الفيروسات؟', a: 'أمبريلا (Umbrella Corporation)' }
      ],
      medium: [
        { q: 'ما اسم بطل سلسلة The Legend of Zelda؟', a: 'لينك (Link)' },
        { q: 'في GTA V، من هم الأبطال الثلاثة القابلون للعب؟', a: 'مايكل، فرانكلين، تريفور' },
        { q: 'ما الشركة المطوّرة للعبة League of Legends؟', a: 'Riot Games' },
        { q: 'في Among Us، ما اسم الشخصية المخادعة؟', a: 'الإمبوستر (Impostor)' },
        { q: 'في Call of Duty، ما اسم أشهر شخصية بريطانية بقبعة؟', a: 'الكابتن برايس' },
        { q: 'ما اسم اللعبة الشهيرة من Riot التي تشبه CS:GO؟', a: 'فالورانت' },
        { q: 'من بطل سلسلة God of War الإغريقي؟', a: 'كريتوس (Kratos)' },
        { q: 'في Animal Crossing، ما اسم الشخصية الراكون التاجر؟', a: 'توم نوك' },
        { q: 'من هو البطل في Resident Evil 4؟', a: 'ليون كينيدي' },
        { q: 'في Resident Evil 5، في أي قارة تدور أحداث اللعبة؟', a: 'أفريقيا' }
      ],
      hard: [
        { q: 'في أي عام أُصدرت أول نسخة من Pokémon؟', a: '1996' },
        { q: 'من ملحّن موسيقى Final Fantasy الشهيرة؟', a: 'نوبو أويماتسو' },
        { q: 'ما اسم الشخصية الرئيسية في Metal Gear Solid؟', a: 'سوليد سنيك' },
        { q: 'من مطوّر لعبة The Witcher 3؟', a: 'CD Projekt Red' },
        { q: 'ما اسم لعبة الفيديو الأولى التي بيعت تجارياً عام 1971؟', a: 'Computer Space' },
        { q: 'في Elden Ring، من المخرج المشهور؟', a: 'هيدتاكا ميازاكي (FromSoftware)' },
        { q: 'من مؤلف رواية لعبة Death Stranding؟', a: 'هيديو كوجيما' },
        { q: 'ما اسم الفيروس في لعبة Resident Evil الأولى؟', a: 'فيروس T (T-Virus)' },
        { q: 'ما اسم الشخص الذي يبيع الأسلحة في Resident Evil 4 ويقول "What are ya buyin?"؟', a: 'التاجر (The Merchant)' },
        { q: 'في Resident Evil Village، ما اسم العائلة الأرستقراطية التي تتكوّن من أم وثلاث بنات؟', a: 'عائلة دميتريسكو (Dimitrescu)' }
      ]
    }
  },
  science: {
    id: 'science', name: 'علوم', icon: '🔬',
    questions: {
      easy: [
        { q: 'ما هو الكوكب الأقرب إلى الشمس؟', a: 'عطارد' },
        { q: 'ما الرمز الكيميائي للماء؟', a: 'H₂O' },
        { q: 'كم عدد ألوان قوس السماء؟', a: '7 ألوان' },
        { q: 'ما العضو المسؤول عن ضخّ الدم؟', a: 'القلب' },
        { q: 'ما أكبر كوكب في المجموعة الشمسية؟', a: 'المشتري' },
        { q: 'كم تستطيع الأذن البشرية أن تسمع من ترددات تقريباً؟', a: 'من 20 هرتز إلى 20,000 هرتز' },
        { q: 'ما الغاز الذي يتنفسه الإنسان؟', a: 'الأكسجين' },
        { q: 'ما أصغر وحدة في المادة؟', a: 'الذرة' }
      ],
      medium: [
        { q: 'كم عدد عظام جسم الإنسان البالغ؟', a: '206 عظمة' },
        { q: 'ما أصلب معدن طبيعي على وجه الأرض؟', a: 'الألماس' },
        { q: 'ما اسم العالم صاحب قانون الجاذبية؟', a: 'إسحاق نيوتن' },
        { q: 'ما عدد الكروموسومات في خلية الإنسان؟', a: '46 (23 زوج)' },
        { q: 'ما الغاز المسؤول عن ظاهرة الاحتباس الحراري بشكل رئيسي؟', a: 'ثاني أكسيد الكربون (CO₂)' },
        { q: 'ما اسم الجهاز الذي يقيس الزلازل؟', a: 'السيزموغراف' },
        { q: 'كم درجة غليان الماء عند سطح البحر؟', a: '100 درجة مئوية' },
        { q: 'ما اسم الخلية المسؤولة عن نقل الأكسجين؟', a: 'كريات الدم الحمراء' }
      ],
      hard: [
        { q: 'من اكتشف البنسلين؟', a: 'ألكسندر فلمنغ' },
        { q: 'ما سرعة الضوء تقريباً بالكيلومتر في الثانية؟', a: '300,000 كم/ث' },
        { q: 'ما أكبر عضو في جسم الإنسان؟', a: 'الجلد' },
        { q: 'ما اسم النظرية التي تشرح أصل الكون من نقطة واحدة؟', a: 'الانفجار العظيم (Big Bang)' },
        { q: 'من اكتشف الكهرومغناطيسية؟', a: 'مايكل فاراداي' },
        { q: 'ما العنصر الكيميائي الأكثر وفرة في الكون؟', a: 'الهيدروجين' },
        { q: 'ما اسم العملية التي تحوّل بها النباتات الضوء إلى طاقة؟', a: 'البناء الضوئي' },
        { q: 'ما هو رقم أفوغادرو تقريباً؟', a: '6.022 × 10²³' }
      ]
    }
  },
  food: {
    id: 'food', name: 'طبخ', icon: '🍲',
    questions: {
      easy: [
        { q: 'ما المكوّن الأساسي في صنع الخبز؟', a: 'الدقيق (الطحين)' },
        { q: 'ما اسم الطبق الخليجي التقليدي المصنوع من الأرز واللحم؟', a: 'الكبسة / المجبوس' },
        { q: 'من أي بلد أصل البيتزا؟', a: 'إيطاليا' },
        { q: 'ما اسم الحلوى التراثية في القطيف المصنوعة من التمر؟', a: 'المعمول' },
        { q: 'ما الفاكهة الشهيرة جداً في القطيف؟', a: 'التمر / الرطب' },
        { q: 'ما أصل طبق السوشي؟', a: 'اليابان' },
        { q: 'ما هو الطبق المصري المصنوع من الأرز والعدس والمكرونة؟', a: 'الكشري' },
        { q: 'من أي حيوان نحصل على الحليب عادةً؟', a: 'البقر / الغنم / الإبل' }
      ],
      medium: [
        { q: 'ما التابل الأصفر الأساسي في الكاري الهندي؟', a: 'الكركم' },
        { q: 'ما الفاكهة المعروفة بـ"ملكة الفواكه"؟', a: 'المانغوستين' },
        { q: 'ما اسم الطبق القطيفي الشهير المصنوع من السمك مع الأرز؟', a: 'المچبوس / صيادية السمك' },
        { q: 'ما اسم الحلوى الفرنسية ذات الطبقات الكثيرة من العجين الرقيق؟', a: 'المل فوي (Mille-feuille)' },
        { q: 'ما اسم السمكة الكبيرة الشهيرة في الخليج العربي والمعروفة بطعمها اللذيذ ولونها الرمادي المرقّط؟', a: 'الهامور' },
        { q: 'ما اسم الجبن الإيطالي الذي يدخل في صنع البيتزا؟', a: 'الموزاريلا' },
        { q: 'ما اسم أكلة الباذنجان التركية الشهيرة؟', a: 'الإمام بايلدي' },
        { q: 'ما اسم التابل الذي يدخل في معظم الأكلات الهندية؟', a: 'الكاري' }
      ],
      hard: [
        { q: 'ما اسم الحلوى التراثية القطيفية المصنوعة من الدقيق والسكر والزعفران؟', a: 'العصيدة (والساقو)' },
        { q: 'ما اسم أغلى نوع كافيار في العالم؟', a: 'بلوغا (Beluga)' },
        { q: 'ما اسم التتبيل الفرنسي المكوّن من البقدونس والثوم وقشر الليمون؟', a: 'غريمولاتا' },
        { q: 'ما اسم تقنية الطهي الفرنسية بالحرارة المنخفضة في كيس مفرّغ؟', a: 'سو-فيد (Sous-vide)' },
        { q: 'ما اسم البهار الأغلى في العالم والذي يُستخلص من خيوط زهرة الكروكس البنفسجية؟', a: 'الزعفران' },
        { q: 'ما اسم نوع الفطر الياباني الغالي الذي ينمو على جذور الصنوبر؟', a: 'فطر ماتسوتاكي' },
        { q: 'ما اسم الطبق التراثي القطيفي المعد من قمح مهروس مع اللحم؟', a: 'الهريسة (الجريش)' },
        { q: 'ما اسم نوع البقرة اليابانية الفاخرة؟', a: 'واغيو (Wagyu)' }
      ]
    }
  },
  islam: {
    id: 'islam', name: 'إسلام', icon: '🕌',
    questions: {
      easy: [
        { q: 'كم عدد أركان الإسلام؟', a: '5 أركان' },
        { q: 'ما أول سورة في القرآن الكريم؟', a: 'سورة الفاتحة' },
        { q: 'في أي شهر هجري يصوم المسلمون؟', a: 'شهر رمضان' },
        { q: 'في أي مدينة وُلد النبي محمد ﷺ؟', a: 'مكة المكرمة' },
        { q: 'كم عدد ركعات صلاة الفجر؟', a: 'ركعتان' },
        { q: 'ما أول الأئمة الاثني عشر؟', a: 'الإمام علي بن أبي طالب (عليه السلام)' },
        { q: 'في أي يوم تُحيا ذكرى استشهاد الإمام الحسين عليه السلام؟', a: 'يوم عاشوراء (10 محرم)' },
        { q: 'ما اسم الإمام الذي لُقّب بـ"باقر العلم" وكان الإمام الخامس؟', a: 'الإمام محمد الباقر (عليه السلام)' }
      ],
      medium: [
        { q: 'متى وقعت معركة بدر الكبرى؟', a: 'في رمضان سنة 2 هـ' },
        { q: 'في أي مدينة وقعت معركة كربلاء؟', a: 'كربلاء (في العراق)' },
        { q: 'من هي أم الإمامين الحسن والحسين عليهما السلام؟', a: 'فاطمة الزهراء بنت رسول الله ﷺ' },
        { q: 'من هو أخو الإمام الحسين الذي حمل لواءه يوم عاشوراء؟', a: 'العباس بن علي (عليه السلام)' },
        { q: 'ما اسم البئر الذي ألقي فيه النبي يوسف عليه السلام؟', a: 'بئر في أرض كنعان' },
        { q: 'ما اسم زوجة النبي ﷺ الأولى؟', a: 'خديجة بنت خويلد' },
        { q: 'ما اسم الكتاب الذي يجمع أحاديث الإمام علي عليه السلام؟', a: 'نهج البلاغة' },
        { q: 'في أي عام وقعت غزوة أُحد؟', a: 'في السنة الثالثة للهجرة (3 هـ)' }
      ],
      hard: [
        { q: 'ما اسم الإمام الثاني عشر المعتقد بغيبته وظهوره؟', a: 'الإمام محمد المهدي (عجل الله فرجه)' },
        { q: 'من هو الإمام الملقَّب بـ"زين العابدين" و"السجّاد"؟', a: 'الإمام علي بن الحسين (عليه السلام)' },
        { q: 'ما اسم الكتاب الذي يضم أدعية الإمام السجّاد؟', a: 'الصحيفة السجّادية' },
        { q: 'كم عدد سور القرآن الكريم؟', a: '114 سورة' },
        { q: 'ما اسم أطول سورة في القرآن؟', a: 'سورة البقرة' },
        { q: 'متى استشهد الإمام علي بن أبي طالب عليه السلام؟', a: 'في 21 رمضان سنة 40 هـ' },
        { q: 'ما اسم الإمام الذي لُقّب بـ"الكاظم"؟', a: 'الإمام موسى بن جعفر (عليه السلام)' },
        { q: 'كم عدد آيات سورة الفاتحة؟', a: '7 آيات' }
      ]
    }
  },
  disney: {
    id: 'disney', name: 'ديزني', icon: '🏰',
    questions: {
      easy: [
        { q: 'ما اسم البطلة في فيلم Frozen التي تحوّل كل شيء إلى ثلج؟', a: 'إلسا' },
        { q: 'في فيلم The Lion King، ما اسم والد سيمبا؟', a: 'موفاسا' },
        { q: 'من هي الأميرة التي تنام 100 سنة وتستيقظ من نومها؟', a: 'الأميرة النائمة (Aurora)' },
        { q: 'ما اسم الفأر الشهير شعار شركة ديزني؟', a: 'ميكي ماوس' },
        { q: 'ما اسم البطلة في فيلم Tangled صاحبة الشعر الطويل؟', a: 'رابونزل' },
        { q: 'في Toy Story، ما اسم رائد الفضاء اللعبة؟', a: 'باز يطير (Buzz Lightyear)' },
        { q: 'ما اسم الأميرة الصينية التي تتنكر بزي رجل لتذهب للحرب؟', a: 'مولان' },
        { q: 'ما اسم البطلة الصغيرة في Finding Nemo التي تعاني من قصر الذاكرة؟', a: 'دوري' }
      ],
      medium: [
        { q: 'في فيلم Aladdin، ما اسم القرد الصديق لعلاء الدين؟', a: 'أبو' },
        { q: 'ما اسم الجزيرة الخيالية في Peter Pan؟', a: 'نيفرلاند (Neverland)' },
        { q: 'في فيلم The Little Mermaid، ما اسم البطلة؟', a: 'آرييل' },
        { q: 'من هو والد إلسا وآنا في Frozen؟', a: 'الملك أغنار' },
        { q: 'في Moana، ما اسم البطل القوي الذي يرافق موانا في رحلتها؟', a: 'ماوي (Maui)' },
        { q: 'ما اسم الشركة الفرعية لديزني المختصة بأفلام الرسوم المتحركة الحاسوبية؟', a: 'بيكسار (Pixar)' },
        { q: 'في Inside Out، ما هي العواطف الخمس الرئيسية؟', a: 'الفرح، الحزن، الغضب، الخوف، الاشمئزاز' },
        { q: 'في Beauty and the Beast، ما اسم الأميرة بيلا؟', a: 'بيل (Belle)' }
      ],
      hard: [
        { q: 'في أي عام تأسست شركة والت ديزني؟', a: '1923' },
        { q: 'ما اسم أول فيلم رسوم متحركة كامل من إنتاج ديزني؟', a: 'Snow White and the Seven Dwarfs (1937)' },
        { q: 'في أي ولاية أمريكية تجري أحداث Lilo & Stitch؟', a: 'هاواي (كاواي تحديداً)' },
        { q: 'من هو المؤدي الأصلي لصوت ميكي ماوس؟', a: 'والت ديزني نفسه' },
        { q: 'ما اسم التنين الصديق في فيلم Mulan؟', a: 'موشو (Mushu)' },
        { q: 'كم عدد الأقزام في فيلم Snow White؟', a: '7 أقزام' },
        { q: 'ما اسم الساحرة الشريرة في Sleeping Beauty؟', a: 'مالفيسنت (Maleficent)' },
        { q: 'ما اسم القرصان الشرير في Peter Pan؟', a: 'الكابتن هوك' }
      ]
    }
  },
  spacetoon: {
    id: 'spacetoon', name: 'سبيس تون', icon: '🚀',
    questions: {
      easy: [
        { q: 'ما اسم القناة الفضائية العربية الشهيرة برسومها المتحركة المدبلجة؟', a: 'سبيس تون (Spacetoon)' },
        { q: 'ما اسم القط الأزرق الياباني الذي يساعد نوبيتا؟', a: 'دورايمون' },
        { q: 'ما اسم البطلة في "هايدي" التي تعيش في الجبال؟', a: 'هايدي' },
        { q: 'ما اسم النحلة الصغيرة الشهيرة في كرتون قديم؟', a: 'النحلة مايا (هايلي)' },
        { q: 'ما اسم القط الذي يطارد جيري دائماً؟', a: 'توم' },
        { q: 'في "بوكيمون"، ما اسم البطل صاحب القبعة؟', a: 'آش (ساتوشي)' },
        { q: 'في "زينة ونحول"، ما اسم النحلة الذكر الكسول صديق زينة؟', a: 'نحول' },
        { q: 'في كرتون "ساسوكي"، ما الحرفة التي يتقنها البطل؟', a: 'نينجا (شينوبي)' }
      ],
      medium: [
        { q: 'في كرتون "كابتن ماجد"، ما المركز الذي يلعب فيه ماجد في الفريق؟', a: 'مهاجم / صانع ألعاب' },
        { q: 'في كرتون "ريمي"، ما اسم الكلب الوفي الذي يرافق ريمي في رحلاته؟', a: 'كابي' },
        { q: 'في "غريندايزر"، ما اسم البطل الأمير الفضائي؟', a: 'دايسكي / دوق فليد' },
        { q: 'في كرتون "فلونة"، ما الحيوان الأليف الذي تربيه البطلة؟', a: 'ظبية صغيرة' },
        { q: 'في كرتون "ديناصور دي"، ما لون الديناصور البطل؟', a: 'بنفسجي / أزرق' },
        { q: 'في "النمر المقنع"، ما هي رياضة البطل؟', a: 'المصارعة الحرّة' },
        { q: 'في كرتون "عدنان ولينا"، ما صلة القرابة بين رامي ولينا؟', a: 'جدّها' },
        { q: 'في كرتون "ساندي بل"، عن من تبحث ساندي طوال القصة؟', a: 'أمها (التي افترقت عنها)' }
      ],
      hard: [
        { q: 'في "كابتن رابح"، ما الذي يميّز وجه البطل؟', a: 'الندبة على وجهه' },
        { q: 'ما اسم القائد الأشرار في "غرندايزر"؟', a: 'الإمبراطور فيغا' },
        { q: 'ما اسم الكوكب الأم في "غرندايزر"؟', a: 'كوكب فليد' },
        { q: 'ما الاسم الياباني الأصلي لكرتون "السيف الشجاع"؟', a: 'يايبا (Yaiba)' },
        { q: 'ما اسم القناة الكويتية التي كانت تبث الكثير من الأنمي قبل ظهور سبيس تون؟', a: 'تلفزيون الكويت / قناة الأطفال' },
        { q: 'في كرتون "سالي"، ما هي قصة البطلة باختصار؟', a: 'فتاة يتيمة تعيش في ميتم وتبحث عن السعادة' },
        { q: 'ما اسم الحصان في كرتون "السنافر"؟', a: 'لا يوجد حصان رئيسي / السنافر يستخدمون اللقالق' },
        { q: 'في "ابطال الديجيتال" (ديجيمون)، ما اسم البطل صاحب القبعة الزرقاء؟', a: 'تاي (Tai)' }
      ]
    }
  }
};

const POINTS_BY_DIFFICULTY = { easy: 200, medium: 400, hard: 600 };
const TIMER_SECONDS = 30;

const state = {
  team1: { name: 'الفريق الأول', score: 0 },
  team2: { name: 'الفريق الثاني', score: 0 },
  selectedCategories: [],
  board: {},
  currentTurn: 1,
  currentQuestion: null,
  timer: { interval: null, remaining: TIMER_SECONDS },
  soundOn: true
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const showScreen = (id) => {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#screen-' + id).classList.add('active');
};

function renderCategories() {
  const grid = $('#categories-grid');
  grid.innerHTML = '';
  Object.values(CATEGORIES).forEach(cat => {
    const tile = document.createElement('div');
    tile.className = 'cat-tile';
    tile.dataset.catId = cat.id;
    tile.innerHTML = '<div class="cat-tile-icon">' + cat.icon + '</div>' +
                     '<div class="cat-tile-name">' + cat.name + '</div>';
    tile.addEventListener('click', () => toggleCategory(cat.id, tile));
    grid.appendChild(tile);
  });
}

function toggleCategory(id, tile) {
  Sound.click();
  const idx = state.selectedCategories.indexOf(id);
  if (idx >= 0) {
    state.selectedCategories.splice(idx, 1);
    tile.classList.remove('selected');
  } else {
    if (state.selectedCategories.length >= 6) return;
    state.selectedCategories.push(id);
    tile.classList.add('selected');
    Sound.select();
  }
  updateCounter();
  updateDisabledTiles();
}

function updateCounter() {
  const count = state.selectedCategories.length;
  const counter = $('#cat-counter');
  counter.innerHTML = 'المختار: <strong>' + count + '</strong> من 6';
  counter.classList.toggle('complete', count === 6);
  $('#start-btn').disabled = count !== 6;
}

function updateDisabledTiles() {
  const full = state.selectedCategories.length >= 6;
  $$('.cat-tile').forEach(tile => {
    if (!tile.classList.contains('selected')) {
      tile.classList.toggle('disabled', full);
    }
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildBoard() {
  state.board = {};
  state.selectedCategories.forEach(catId => {
    const cat = CATEGORIES[catId];
    state.board[catId] = {
      easy:   shuffle([...cat.questions.easy]).slice(0, 2).map(q => ({ ...q, used: false })),
      medium: shuffle([...cat.questions.medium]).slice(0, 2).map(q => ({ ...q, used: false })),
      hard:   shuffle([...cat.questions.hard]).slice(0, 2).map(q => ({ ...q, used: false }))
    };
  });
}

function renderBoard() {
  const grid = $('#board-grid');
  grid.innerHTML = '';
  state.selectedCategories.forEach(catId => {
    const cat = CATEGORIES[catId];
    const col = document.createElement('div');
    col.className = 'board-col';
    const header = document.createElement('div');
    header.className = 'cat-header';
    header.innerHTML = '<div class="cat-header-icon">' + cat.icon + '</div>' +
                       '<div class="cat-header-name">' + cat.name + '</div>';
    col.appendChild(header);
    const order = [
      { difficulty: 'easy', idx: 0 }, { difficulty: 'easy', idx: 1 },
      { difficulty: 'medium', idx: 0 }, { difficulty: 'medium', idx: 1 },
      { difficulty: 'hard', idx: 0 }, { difficulty: 'hard', idx: 1 }
    ];
    order.forEach(({ difficulty, idx }) => {
      const cell = document.createElement('div');
      cell.className = 'point-cell level-' + difficulty;
      cell.dataset.catId = catId;
      cell.dataset.difficulty = difficulty;
      cell.dataset.idx = idx;
      const points = POINTS_BY_DIFFICULTY[difficulty];
      cell.textContent = points;
      const qData = state.board[catId][difficulty][idx];
      if (qData.used) cell.classList.add('used');
      cell.addEventListener('click', () => onCellClick(catId, difficulty, idx));
      col.appendChild(cell);
    });
    grid.appendChild(col);
  });
}

function updateBoardHeader() {
  $('#display-team1-name').textContent = state.team1.name;
  $('#display-team2-name').textContent = state.team2.name;
  $('#display-team1-score').textContent = state.team1.score;
  $('#display-team2-score').textContent = state.team2.score;
  $('#turn-name').textContent = state.currentTurn === 1 ? state.team1.name : state.team2.name;
  $('#team-card-1').classList.toggle('active', state.currentTurn === 1);
  $('#team-card-2').classList.toggle('active', state.currentTurn === 2);
}

function checkGameOver() {
  let used = 0, total = 0;
  Object.values(state.board).forEach(cat => {
    Object.values(cat).forEach(arr => {
      arr.forEach(q => { total++; if (q.used) used++; });
    });
  });
  return used === total;
}

function onCellClick(catId, difficulty, idx) {
  const qData = state.board[catId][difficulty][idx];
  if (qData.used) return;
  Sound.click();
  state.currentQuestion = {
    catId, difficulty, idx,
    points: POINTS_BY_DIFFICULTY[difficulty],
    q: qData.q, a: qData.a
  };
  showQuestion();
}

function showQuestion() {
  const cq = state.currentQuestion;
  const cat = CATEGORIES[cq.catId];
  $('#q-cat-icon').textContent = cat.icon;
  $('#q-cat-name').textContent = cat.name;
  $('#q-points').textContent = cq.points;
  $('#q-team-turn').textContent = 'دور ' + (state.currentTurn === 1 ? state.team1.name : state.team2.name);
  $('#q-text').textContent = cq.q;
  $('#q-answer-reveal').classList.remove('show');
  $('#q-answer-text').textContent = cq.a;
  $('#show-answer-btn').style.display = 'inline-flex';
  $('#btn-team1-name').textContent = state.team1.name;
  $('#btn-team2-name').textContent = state.team2.name;
  showScreen('question');
  startTimer();
}

function startTimer() {
  stopTimer();
  state.timer.remaining = TIMER_SECONDS;
  updateTimerUI();
  state.timer.interval = setInterval(() => {
    state.timer.remaining--;
    updateTimerUI();
    if (state.timer.remaining <= 5 && state.timer.remaining > 0) Sound.tick();
    if (state.timer.remaining <= 0) {
      stopTimer();
      Sound.timeUp();
      revealAnswer();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timer.interval) {
    clearInterval(state.timer.interval);
    state.timer.interval = null;
  }
}

function updateTimerUI() {
  const secs = state.timer.remaining;
  $('#timer-text').textContent = secs;
  const ring = $('#timer-ring');
  const circle = ring.querySelector('.fg-circle');
  const total = 2 * Math.PI * 45;
  const offset = total * (1 - secs / TIMER_SECONDS);
  circle.style.strokeDasharray = total;
  circle.style.strokeDashoffset = offset;
  ring.classList.toggle('warning', secs <= 10 && secs > 5);
  ring.classList.toggle('danger', secs <= 5);
}

function revealAnswer() {
  $('#q-answer-reveal').classList.add('show');
  $('#show-answer-btn').style.display = 'none';
}

function awardPoints(teamNum) {
  stopTimer();
  Sound.correct();
  const cq = state.currentQuestion;
  if (teamNum === 1) state.team1.score += cq.points;
  else state.team2.score += cq.points;
  finishQuestion();
}

function noAnswer() {
  stopTimer();
  Sound.wrong();
  finishQuestion();
}

function finishQuestion() {
  const cq = state.currentQuestion;
  state.board[cq.catId][cq.difficulty][cq.idx].used = true;
  state.currentTurn = state.currentTurn === 1 ? 2 : 1;
  if (checkGameOver()) {
    setTimeout(() => showResults(), 800);
    return;
  }
  setTimeout(() => {
    renderBoard();
    updateBoardHeader();
    showScreen('board');
  }, 600);
}

function showResults() {
  Sound.win();
  $('#result-team1-name').textContent = state.team1.name;
  $('#result-team2-name').textContent = state.team2.name;
  $('#result-team1-score').textContent = state.team1.score;
  $('#result-team2-score').textContent = state.team2.score;
  const c1 = $('#result-card-1');
  const c2 = $('#result-card-2');
  c1.classList.remove('winner');
  c2.classList.remove('winner');
  const wn = $('#winner-name');
  wn.classList.remove('tie');
  let winnerName = '';
  if (state.team1.score > state.team2.score) {
    c1.classList.add('winner');
    winnerName = state.team1.name;
    wn.textContent = winnerName;
  } else if (state.team2.score > state.team1.score) {
    c2.classList.add('winner');
    winnerName = state.team2.name;
    wn.textContent = winnerName;
  } else {
    wn.textContent = 'تعادل!';
    wn.classList.add('tie');
  }
  showScreen('results');
  if (winnerName) launchConfetti();
}

function launchConfetti() {
  const container = $('#confetti');
  container.style.display = 'block';
  container.innerHTML = '';
  const colors = ['#ffd84d', '#f5c518', '#4ea8d8', '#1e7bb8', '#fffaf0'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.animationDelay = Math.random() * 1.5 + 's';
    piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    container.appendChild(piece);
  }
  setTimeout(() => { container.style.display = 'none'; container.innerHTML = ''; }, 5000);
}

let modalConfirmCallback = null;
function showModal(opts) {
  $('#modal-icon').textContent = opts.icon || '⚠️';
  $('#modal-title').textContent = opts.title || 'تأكيد';
  $('#modal-text').textContent = opts.text || '';
  $('#modal-confirm').textContent = opts.confirmText || 'نعم';
  modalConfirmCallback = opts.onConfirm;
  $('#modal').classList.add('show');
}
function hideModal() {
  $('#modal').classList.remove('show');
  modalConfirmCallback = null;
}

function startGame() {
  Sound.init(); Sound.select();
  const t1 = $('#team1-input').value.trim() || 'الفريق الأول';
  const t2 = $('#team2-input').value.trim() || 'الفريق الثاني';
  state.team1 = { name: t1, score: 0 };
  state.team2 = { name: t2, score: 0 };
  state.currentTurn = 1;
  buildBoard();
  renderBoard();
  updateBoardHeader();
  showScreen('board');
}

function resetToHome() {
  state.selectedCategories = [];
  state.team1 = { name: 'الفريق الأول', score: 0 };
  state.team2 = { name: 'الفريق الثاني', score: 0 };
  state.currentTurn = 1;
  $$('.cat-tile').forEach(t => t.classList.remove('selected', 'disabled'));
  updateCounter();
  showScreen('home');
}

function playAgain() {
  state.team1.score = 0;
  state.team2.score = 0;
  state.currentTurn = 1;
  buildBoard();
  renderBoard();
  updateBoardHeader();
  showScreen('board');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  updateCounter();
  $('#sound-toggle').addEventListener('click', (e) => {
    const el = e.currentTarget;
    el.classList.toggle('on');
    state.soundOn = el.classList.contains('on');
    Sound.setEnabled(state.soundOn);
    if (state.soundOn) Sound.click();
    el.querySelector('.label').textContent = state.soundOn ? '🔊 الأصوات' : '🔇 الأصوات';
  });
  $('#start-btn').addEventListener('click', startGame);
  $('#show-answer-btn').addEventListener('click', () => { Sound.click(); revealAnswer(); });
  $('#correct-team1-btn').addEventListener('click', () => awardPoints(1));
  $('#correct-team2-btn').addEventListener('click', () => awardPoints(2));
  $('#no-answer-btn').addEventListener('click', noAnswer);
  $('#exit-btn').addEventListener('click', () => {
    showModal({
      icon: '⚠️', title: 'إنهاء اللعبة',
      text: 'هل تريد فعلاً إنهاء اللعبة الحالية والعودة إلى الرئيسية؟',
      confirmText: 'نعم، أنهِ',
      onConfirm: () => { hideModal(); resetToHome(); }
    });
  });
  $('#play-again-btn').addEventListener('click', playAgain);
  $('#home-btn').addEventListener('click', resetToHome);
  $('#modal-confirm').addEventListener('click', () => {
    if (modalConfirmCallback) modalConfirmCallback();
    else hideModal();
  });
  $('#modal-cancel').addEventListener('click', hideModal);
  $('#modal').addEventListener('click', (e) => {
    if (e.target === $('#modal')) hideModal();
  });
  document.addEventListener('keydown', (e) => {
    const onQuestion = $('#screen-question').classList.contains('active');
    if (onQuestion) {
      if (e.key === '1') awardPoints(1);
      if (e.key === '2') awardPoints(2);
      if (e.key === '0' || e.key === ' ') { e.preventDefault(); noAnswer(); }
      if (e.key === 'a' || e.key === 'A') revealAnswer();
    }
    if (e.key === 'Escape') hideModal();
  });
});

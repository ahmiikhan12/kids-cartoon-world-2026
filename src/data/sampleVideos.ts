import type { StoryScene, VideoItem } from '../types/video';

export const SAMPLE_THUMBNAIL_GALLERY = [
  {
    label: 'Clever Little Fox',
    url: '/src/assets/images/cartoon_clever_fox_1795274007721.jpg',
  },
  {
    label: 'Bongo Bear Pancakes',
    url: '/src/assets/images/cartoon_bongo_bear_1795274009312.jpg',
  },
  {
    label: 'Chintu Parrot Garden',
    url: '/src/assets/images/cartoon_chintu_parrot_1795274008054.jpg',
  },
  {
    label: 'Honest Woodcutter',
    url: '/src/assets/images/cartoon_honest_woodcutter_1795274009064.jpg',
  },
  {
    label: 'Patient Little Sparrow',
    url: '/src/assets/images/cartoon_patient_sparrow_1795274006162.jpg',
  },
  {
    label: 'Captain Owl Shapes',
    url: '/src/assets/images/cartoon_captain_owl_1795274007717.jpg',
  },
  {
    label: 'Rainbows & Clouds',
    url: '/src/assets/images/cartoon_rainbow_clouds_1795274007952.jpg',
  },
  {
    label: 'Goodnight Firefly',
    url: '/src/assets/images/cartoon_goodnight_firefly_1795274006787.jpg',
  },
] as const;

export const DEMO_SCENES_BY_ID: Record<string, StoryScene[]> = {
  'demo-clever-fox-well': [
    {
      heading: 'Scene 1 · A Curious Evening Walk',
      caption:
        'Pip the little orange fox wrapped on his favorite red scarf and trotted toward the mossy village well as twilight fireflies began to glow.',
    },
    {
      heading: 'Scene 2 · The Cheese in the Water?',
      caption:
        'Peering over the stone rim, Pip gasped! Floating right on the dark water was a bright golden crescent. "Oh my! Someone dropped a giant slice of mango cheese!" he giggled.',
    },
    {
      heading: 'Scene 3 · A Gentle Ripple Lesson',
      caption:
        'When Pip tapped the water with his wooden bucket, the golden crescent wiggled into a dozen dancing sparkles—and then he looked up and laughed at the real moon smiling above.',
    },
    {
      heading: 'Scene 4 · Sharing the Laugh',
      caption:
        'Pip realized curiosity is wonderful when we look closely and think calmly. He waved goodnight to the moon and skipped home with a bright smile.',
    },
  ],
  'demo-bongo-bear-pancakes': [
    {
      heading: 'Scene 1 · Sunny Morning Kitchen',
      caption:
        'Bongo Bear tied his cheerful polka-dot apron and hummed his breakfast song while measuring flour, milk, and sweet woodland honey.',
    },
    {
      heading: 'Scene 2 · The Highest Pancake Flip',
      caption:
        'With a mighty "One, two, flip!" Bongo tossed three fluffy pancakes so high they nearly tickled the rafters while Rosie Squirrel cheered from the sunny windowsill.',
    },
    {
      heading: 'Scene 3 · Catching With Teamwork',
      caption:
        'One cheeky pancake wobbled left, then right—until Bongo hopped across the wooden floor and caught all three in a neat golden stack!',
    },
    {
      heading: 'Scene 4 · Breakfast for Friends',
      caption:
        'Bongo drizzled warm syrup and shared a plate with Rosie Squirrel. Everything tastes twice as sweet when shared with a friend.',
    },
  ],
  'demo-chintu-parrot-echo': [
    {
      heading: 'Scene 1 · Morning Under the Mango Tree',
      caption:
        'Chintu the bright emerald parrot loved greeting everyone in the marigold courtyard. Two little bluebirds hopped onto his branch ready to play.',
    },
    {
      heading: 'Scene 2 · The Silly Repeat Game',
      caption:
        'When the bluebirds sang "Chirp-chirp, good morning!" Chintu puffed out his feathers and echoed back in a funny squeaky voice, making the whole garden laugh.',
    },
    {
      heading: 'Scene 3 · Listening Carefully',
      caption:
        'Soon Chintu learned that taking turns to listen is just as fun as talking—especially when friends have a brand new tune to teach.',
    },
    {
      heading: 'Scene 4 · The Courtyard Chorus',
      caption:
        'Together, Chintu and the bluebirds sang a happy duet under the ripening mangoes while the flowers swayed in the warm breeze.',
    },
  ],
  'demo-honest-woodcutter-urdu': [
    {
      heading: 'Scene 1 · A Hardworking Morning',
      caption:
        'In a peaceful green valley lived Karim, an honest village woodcutter who worked kindly each day to care for his family.',
      urduCaption: 'ایک سرسبز وادی میں کریم نامی ایک محنتی اور ایماندار لکڑہارا رہتا تھا۔',
    },
    {
      heading: 'Scene 2 · The Missing Iron Axe',
      caption:
        'While resting by the sparkling stream, Karim’s simple iron axe slipped into the deep water. He sat quietly, wishing only to recover his own humble tool.',
      urduCaption: 'کریم کی لوہے کی کلہاڑی ندی میں گر گئی، مگر اس نے صبر اور ہمت سے کام لیا۔',
    },
    {
      heading: 'Scene 3 · Choosing Truth Over Gold',
      caption:
        'When a gleaming golden axe and a silver axe were offered to him, Karim politely shook his head: "Those do not belong to me. Mine is only a plain iron axe."',
      urduCaption: 'اس نے سونے اور چاندی کی کلہاڑی لینے سے انکار کیا اور سچ بولا: میری کلہاڑی لوہے کی ہے۔',
    },
    {
      heading: 'Scene 4 · The Reward of Honesty',
      caption:
        'Delighted by Karim’s truthfulness, the valley guardian returned his iron axe along with generous blessings. Honesty always brings lasting peace and respect.',
      urduCaption: 'ایمانداری اور سچائی ہمیشہ عزت اور برکت لاتی ہے۔',
    },
  ],
  'demo-patient-sparrow-urdu': [
    {
      heading: 'Scene 1 · One Tiny Twig at a Time',
      caption:
        'Nanni the little brown sparrow wanted to build a safe, warm nest high in the blooming courtyard tree before the spring winds arrived.',
      urduCaption: 'ننھی چڑیا نے پھولوں والے درخت پر اپنا خوبصورت گھونسلہ بنانے کا ارادہ کیا۔',
    },
    {
      heading: 'Scene 2 · Never Giving Up',
      caption:
        'Sometimes a gust of wind blew a twig away, yet Nanni smiled, fluttered down gently, and picked up another piece with calm patience.',
      urduCaption: 'جب ہوا تنکا اڑا لے جاتی، تو ننھی چڑیا ہمت نہ ہارتی اور دوبارہ محنت کرتی۔',
    },
    {
      heading: 'Scene 3 · A Cozy Home Complete',
      caption:
        'By golden sunset, twig by twig and leaf by leaf, her sturdy nest was finished—soft, round, and tucked safely among pink blossoms.',
      urduCaption: 'شام تک صبر اور لگن سے اس کا مضبوط اور آرام دہ گھونسلہ تیار ہو گیا۔',
    },
    {
      heading: 'Scene 4 · Moral of the Story',
      caption:
        'Big dreams grow from small, steady steps taken with patience and gratitude every single day.',
      urduCaption: 'صبر اور مستقل مزاجی سے ہر مشکل کام آسان ہو جاتا ہے۔',
    },
  ],
  'demo-captain-owl-shapes': [
    {
      heading: 'Scene 1 · Welcome to Starry Lookout',
      caption:
        'Put on your explorer hat! Captain Owl adjusted his round spectacles and welcomed young learners to his cozy wooden treehouse observatory.',
    },
    {
      heading: 'Scene 2 · Meet Triangles and Squares',
      caption:
        'Count along with Captain Owl: a triangle has 3 pointy corners like a mountain peak, while a rectangle has 4 neat sides like your favorite storybook!',
    },
    {
      heading: 'Scene 3 · Circles & Five-Pointed Stars',
      caption:
        'A circle rolls smoothly around with zero sharp corners, and tonight’s brightest sky stars shine with 5 twinkling points.',
    },
    {
      heading: 'Scene 4 · Shape Spotting at Home',
      caption:
        'Look around your room with a parent—can you spot one circle, one rectangle, and one triangle right now? Great job, little explorer!',
    },
  ],
  'demo-rainbow-clouds-science': [
    {
      heading: 'Scene 1 · How Clouds Float Up High',
      caption:
        'Warm sunshine gently lifts tiny invisible water droplets into the cool sky, where they gather together like soft fluffy pillows called clouds.',
    },
    {
      heading: 'Scene 2 · Gentle Spring Raindrops',
      caption:
        'When the cloud droplets grow heavy and full, they dance down as refreshing raindrops that help green meadows, apple trees, and wildflowers grow.',
    },
    {
      heading: 'Scene 3 · Sunlight Meets Rain',
      caption:
        'When bright sunlight shines through falling raindrops at the right angle, white sunlight splits into seven cheerful colors curving across the sky!',
    },
    {
      heading: 'Scene 4 · Seven Colors Together',
      caption:
        'Red, orange, yellow, green, blue, indigo, and violet—every rainbow is nature’s gentle reminder that sunshine and rain work together.',
    },
  ],
  'demo-goodnight-firefly-bedtime': [
    {
      heading: 'Scene 1 · Quiet Tree Hollow',
      caption:
        'As deep blue evening settled softly over the meadow, little Pippin Bunny climbed under a warm patchwork quilt stitched with tiny moons and stars.',
    },
    {
      heading: 'Scene 2 · A Gentle Golden Lantern',
      caption:
        'Outside the round window, a friendly firefly named Luma blinked a slow, peaceful rhythm—glowing bright, then resting dim—like a soft bedtime breath.',
    },
    {
      heading: 'Scene 3 · Wishing the Forest Goodnight',
      caption:
        'Goodnight sleepy leaves, goodnight quiet hills, goodnight bright crescent moon watching gently from above.',
    },
    {
      heading: 'Scene 4 · Sweet Dreams',
      caption:
        'Pippin Bunny closed both eyes with a happy sigh, safe and cozy until tomorrow’s sunny morning.',
    },
  ],
};

const BASE_TIME = Date.UTC(2026, 10, 15, 10, 0, 0);

export const SAMPLE_DEMO_VIDEOS: VideoItem[] = [
  {
    id: 'demo-clever-fox-well',
    title: 'The Clever Little Fox & The Moonlit Well',
    urduTitle: 'چالاک لومڑی اور چاندنی کنواں',
    description:
      'Join Pip the playful orange fox on a funny moonlit garden adventure when he spots the glowing crescent moon shimmering inside the village stone well. A lighthearted animal cartoon about curiosity and looking twice before leaping.',
    category: 'funny-cartoons',
    thumbnailUrl: '/src/assets/images/cartoon_clever_fox_1795274007721.jpg',
    videoSourceType: 'demo',
    videoUrl: '',
    duration: '3:40',
    ageRange: 'Ages 3–8',
    language: 'English',
    moralLesson: 'Pause, look closely, and laugh kindly at silly mistakes.',
    isFeatured: true,
    isPopular: true,
    isFunnyAnimal: true,
    isDemo: true,
    isPublished: true,
    rightsConfirmed: true,
    ownerUid: 'sample-demo',
    createdAtMs: BASE_TIME + 8000,
    updatedAtMs: BASE_TIME + 8000,
    demoScenes: DEMO_SCENES_BY_ID['demo-clever-fox-well'],
    storageOrigin: 'sample',
  },
  {
    id: 'demo-honest-woodcutter-urdu',
    title: 'Sacha Dost — The Honest Woodcutter',
    urduTitle: 'ایماندار لکڑہارا — اردو اخلاقی کہانی',
    description:
      'A classic family-favorite Urdu moral story following Karim, a kind-hearted village woodcutter who chooses truthfulness over golden treasures beside a forest stream. Includes gentle bilingual Urdu & English story captions.',
    category: 'urdu-stories',
    thumbnailUrl: '/src/assets/images/cartoon_honest_woodcutter_1795274009064.jpg',
    videoSourceType: 'demo',
    videoUrl: '',
    duration: '4:50',
    ageRange: 'Ages 4–10',
    language: 'Urdu & English',
    moralLesson: 'Honesty and truthfulness always earn lasting respect and peace.',
    isFeatured: false,
    isPopular: true,
    isFunnyAnimal: false,
    isDemo: true,
    isPublished: true,
    rightsConfirmed: true,
    ownerUid: 'sample-demo',
    createdAtMs: BASE_TIME + 7000,
    updatedAtMs: BASE_TIME + 7000,
    demoScenes: DEMO_SCENES_BY_ID['demo-honest-woodcutter-urdu'],
    storageOrigin: 'sample',
  },
  {
    id: 'demo-bongo-bear-pancakes',
    title: "Bongo Bear's Wobbly Pancake Morning",
    urduTitle: 'بونگو ریچھ کا مزے دار ناشتہ',
    description:
      'Bongo Bear tries to flip the tallest stack of honey pancakes in his cozy woodland kitchen while Rosie Squirrel cheers from the window. Full of cheerful giggles and warm friendship.',
    category: 'funny-cartoons',
    thumbnailUrl: '/src/assets/images/cartoon_bongo_bear_1795274009312.jpg',
    videoSourceType: 'demo',
    videoUrl: '',
    duration: '3:15',
    ageRange: 'Ages 3–7',
    language: 'English',
    moralLesson: 'Sharing breakfast and laughter makes every morning brighter.',
    isFeatured: false,
    isPopular: true,
    isFunnyAnimal: true,
    isDemo: true,
    isPublished: true,
    rightsConfirmed: true,
    ownerUid: 'sample-demo',
    createdAtMs: BASE_TIME + 6000,
    updatedAtMs: BASE_TIME + 6000,
    demoScenes: DEMO_SCENES_BY_ID['demo-bongo-bear-pancakes'],
    storageOrigin: 'sample',
  },
  {
    id: 'demo-captain-owl-shapes',
    title: 'Starry Shapes & Counting with Captain Owl',
    urduTitle: 'کیپٹن الو کے ساتھ اشکال اور گنتی',
    description:
      'Climb up to Captain Owl’s cozy treehouse observatory to discover triangles, rectangles, circles, and glowing five-pointed stars. Designed for early learners to count and recognize everyday shapes.',
    category: 'educational-videos',
    thumbnailUrl: '/src/assets/images/cartoon_captain_owl_1795274007717.jpg',
    videoSourceType: 'demo',
    videoUrl: '',
    duration: '4:10',
    ageRange: 'Ages 3–7',
    language: 'English',
    moralLesson: 'Learning shapes and numbers turns everyday places into an adventure.',
    isFeatured: false,
    isPopular: true,
    isFunnyAnimal: false,
    isDemo: true,
    isPublished: true,
    rightsConfirmed: true,
    ownerUid: 'sample-demo',
    createdAtMs: BASE_TIME + 5000,
    updatedAtMs: BASE_TIME + 5000,
    demoScenes: DEMO_SCENES_BY_ID['demo-captain-owl-shapes'],
    storageOrigin: 'sample',
  },
  {
    id: 'demo-patient-sparrow-urdu',
    title: 'Nanni Chiriya Ka Sabar — The Patient Sparrow',
    urduTitle: 'ننھی چڑیا کا صبر اور محنت',
    description:
      'Watch a gentle little brown sparrow gather twigs one by one to weave her cozy nest in a blooming courtyard tree. A heartwarming Urdu moral story teaching perseverance and patience.',
    category: 'urdu-stories',
    thumbnailUrl: '/src/assets/images/cartoon_patient_sparrow_1795274006162.jpg',
    videoSourceType: 'demo',
    videoUrl: '',
    duration: '4:20',
    ageRange: 'Ages 4–9',
    language: 'Urdu & English',
    moralLesson: 'Small, patient steps help us complete big, wonderful goals.',
    isFeatured: false,
    isPopular: false,
    isFunnyAnimal: false,
    isDemo: true,
    isPublished: true,
    rightsConfirmed: true,
    ownerUid: 'sample-demo',
    createdAtMs: BASE_TIME + 4000,
    updatedAtMs: BASE_TIME + 4000,
    demoScenes: DEMO_SCENES_BY_ID['demo-patient-sparrow-urdu'],
    storageOrigin: 'sample',
  },
  {
    id: 'demo-chintu-parrot-echo',
    title: "Chintu Parrot's Silly Courtyard Echo",
    urduTitle: 'چنٹو طوطے کا مزاحیہ کھیل',
    description:
      'Chintu the bright green parrot plays a musical copycat game with two tiny bluebirds in a sunny marigold garden—and discovers how fun it is to take turns listening.',
    category: 'funny-cartoons',
    thumbnailUrl: '/src/assets/images/cartoon_chintu_parrot_1795274008054.jpg',
    videoSourceType: 'demo',
    videoUrl: '',
    duration: '2:55',
    ageRange: 'Ages 2–7',
    language: 'English',
    moralLesson: 'Good friends take turns speaking and listening with kindness.',
    isFeatured: false,
    isPopular: false,
    isFunnyAnimal: true,
    isDemo: true,
    isPublished: true,
    rightsConfirmed: true,
    ownerUid: 'sample-demo',
    createdAtMs: BASE_TIME + 3000,
    updatedAtMs: BASE_TIME + 3000,
    demoScenes: DEMO_SCENES_BY_ID['demo-chintu-parrot-echo'],
    storageOrigin: 'sample',
  },
  {
    id: 'demo-rainbow-clouds-science',
    title: 'How Rainbows & Fluffy Clouds Are Made',
    urduTitle: 'بادل اور قوسِ قزح کیسے بنتے ہیں؟',
    description:
      'Follow cheerful clouds, sparkling raindrops, and golden sunbeams over sunlit hills to learn the simple science of rain and all seven colors of the rainbow.',
    category: 'educational-videos',
    thumbnailUrl: '/src/assets/images/cartoon_rainbow_clouds_1795274007952.jpg',
    videoSourceType: 'demo',
    videoUrl: '',
    duration: '3:50',
    ageRange: 'Ages 4–9',
    language: 'English',
    moralLesson: 'Nature works in amazing harmony when sunlight and rain meet.',
    isFeatured: false,
    isPopular: false,
    isFunnyAnimal: false,
    isDemo: true,
    isPublished: true,
    rightsConfirmed: true,
    ownerUid: 'sample-demo',
    createdAtMs: BASE_TIME + 2000,
    updatedAtMs: BASE_TIME + 2000,
    demoScenes: DEMO_SCENES_BY_ID['demo-rainbow-clouds-science'],
    storageOrigin: 'sample',
  },
  {
    id: 'demo-goodnight-firefly-bedtime',
    title: 'Goodnight Little Firefly — Lullaby Hollow',
    urduTitle: 'شب بخیر ننھے جگنو',
    description:
      'Settle in for a calm, soothing bedtime story inside Pippin Bunny’s lantern-lit tree hollow while a gentle firefly glows beneath the crescent moon.',
    category: 'bedtime-stories',
    thumbnailUrl: '/src/assets/images/cartoon_goodnight_firefly_1795274006787.jpg',
    videoSourceType: 'demo',
    videoUrl: '',
    duration: '5:10',
    ageRange: 'Ages 2–7',
    language: 'English',
    moralLesson: 'A calm mind and warm gratitude bring peaceful sleep.',
    isFeatured: false,
    isPopular: true,
    isFunnyAnimal: false,
    isDemo: true,
    isPublished: true,
    rightsConfirmed: true,
    ownerUid: 'sample-demo',
    createdAtMs: BASE_TIME + 1000,
    updatedAtMs: BASE_TIME + 1000,
    demoScenes: DEMO_SCENES_BY_ID['demo-goodnight-firefly-bedtime'],
    storageOrigin: 'sample',
  },
];

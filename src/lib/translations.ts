export interface MenuItemTranslation {
  nameEn: string;
  descriptionEn: string;
  editorialNoteEn?: string;
  highlightEn?: string;
  variantsEn?: { id: string; name: string; price: number }[];
}

export interface PlateTranslation {
  chapterTitleEn: string;
  titleEn: string;
  locationEn: string;
  descriptionEn: string;
}

export interface EventTranslation {
  titleEn: string;
  subtitleEn: string;
  dateOrScheduleEn: string;
  descriptionEn: string;
  badgeEn: string;
}

export const menuItemTranslations: Record<string, MenuItemTranslation> = {
  // 1. Cà phê (Coffee)
  'cf-01': {
    nameEn: 'Black Coffee / Milk Coffee',
    descriptionEn: 'Traditionally wood-roasted Dak Nong Robusta beans with rich botanical earthy aroma.',
    editorialNoteEn: 'Wood-roasted with authentic rich Dak Nong flavor',
    variantsEn: [
      { id: 'var-black', name: 'Black Coffee', price: 20000 },
      { id: 'var-milk', name: 'Milk Coffee', price: 25000 },
    ],
  },
  'cf-02': {
    nameEn: 'Saigon Style Iced Coffee',
    descriptionEn: 'Brewed in the generous Saigon style with creamy condensed milk for instant refreshment.',
    editorialNoteEn: 'Sweet, creamy, and deeply traditional',
  },
  'cf-03': {
    nameEn: 'Cẩm Cù Signature Salt Coffee',
    descriptionEn: 'A silky layer of delicate salted cream gently merges into concentrated Dak Nong Robusta.',
    editorialNoteEn: 'Our iconic signature beside the mountain stream',
    highlightEn: 'Best-seller',
  },
  'cf-04': {
    nameEn: 'Iced Coconut Coffee Slush',
    descriptionEn: 'Frosty Ben Tre coconut cream slush drizzled with piping hot fragrant espresso.',
    editorialNoteEn: 'Irresistibly luscious tropical aroma',
    highlightEn: 'Signature',
  },
  'cf-05': {
    nameEn: 'Egg Coffee',
    descriptionEn: 'Golden whipped farm egg cream gently torched with caramelized cane sugar on top.',
    editorialNoteEn: 'Decadently creamy with zero eggy aftertaste',
  },
  'cf-06': {
    nameEn: 'Bac Xiu (Triple-Layer Coffee)',
    descriptionEn: 'Gracefully layered with sweet condensed milk, fresh milk, and a crown of dark Robusta.',
    editorialNoteEn: 'Gentle, elegant brew for early mornings',
  },
  'cf-07': {
    nameEn: 'Pure Hot/Iced Milk Cacao',
    descriptionEn: 'Pure artisanal Dak Nong cocoa powder, rich in natural minerals with a warm velvety note.',
    editorialNoteEn: 'Mineral-rich 100% pure local cocoa',
  },
  'cf-08': {
    nameEn: 'Salt Cream Cacao',
    descriptionEn: 'A bold balance between dark bittersweet cocoa and a rich salted cream crown.',
    editorialNoteEn: 'Creative modern twist on artisan cocoa',
  },
  'cf-09': {
    nameEn: 'Egg Cream Cacao',
    descriptionEn: 'Specially crafted for dessert lovers seeking velvety whipped egg cream over warm cocoa.',
    editorialNoteEn: 'Warm, comforting, and energizing',
  },

  // 2. Trà & Thảo mộc (Tea & Botanicals)
  'tra-01': {
    nameEn: 'Ginger Honey Tea',
    descriptionEn: 'Spicy fresh native ginger paired with wild Dak Nong forest honey to warm your body beside the cool stream.',
    editorialNoteEn: 'Soothing warmth, beneficial for wellness',
  },
  'tra-02': {
    nameEn: 'Botanical Lipton Blend',
    descriptionEn: 'Amber Ceylon tea infused with dried orange slices, cinnamon bark, and star anise.',
    editorialNoteEn: 'Pure serenity and mindful relaxation',
  },
  'tra-03': {
    nameEn: 'Crisp Lychee Iced Tea',
    descriptionEn: 'Delicate jasmine green tea paired with plump, crunchy white lychees.',
    editorialNoteEn: 'Instant cooling for sunny afternoons',
  },
  'tra-04': {
    nameEn: 'Crispy Peach Iced Tea',
    descriptionEn: 'Sweet-scented brewed black tea topped with crisp, fragrant yellow peach slices.',
    editorialNoteEn: 'Familiar classic executed to perfection',
  },
  'tra-05': {
    nameEn: 'Peach Orange Lemongrass Tea',
    descriptionEn: 'Crushed highland lemongrass and juicy citrus orange wedges blended with crisp peach tea.',
    editorialNoteEn: 'The #1 favorite refreshment all weekend',
    highlightEn: 'Best-seller',
  },
  'tra-06': {
    nameEn: 'Thai Green Milk Tea',
    descriptionEn: 'Authentic Thai green tea leaves brewed to a silky, herbal, and creamy delight.',
    editorialNoteEn: 'Refreshing emerald botanical hue',
  },
  'tra-07': {
    nameEn: 'Classic Milk Tea',
    descriptionEn: 'Fragrant black tea harmoniously fused with creamy milk without overpowering sweetness.',
    editorialNoteEn: 'Nostalgic youth flavor by the brook',
  },
  'tra-08': {
    nameEn: 'Torched Egg Cream Milk Tea',
    descriptionEn: 'Bold Ceylon milk tea topped with flame-torched golden egg custard foam.',
    editorialNoteEn: 'Warm buttery decadence in every sip',
  },
  'tra-09': {
    nameEn: 'Matcha Milk Tea',
    descriptionEn: 'Fine Japanese green tea powder blended with rich fresh milk and cane sugar.',
    editorialNoteEn: 'Earthy matcha depth with mellow sweetness',
  },
  'tra-10': {
    nameEn: 'Strawberry Tea + Chewy Palm Seed',
    descriptionEn: 'Ruby red strawberry puree paired with soft chewy palm seeds slow-cooked in sugar.',
    editorialNoteEn: 'Delightfully chewy and fruity',
    highlightEn: 'Hạt đác rim dẻo giòn',
  },
  'tra-11': {
    nameEn: 'Lychee Tea + Chewy Palm Seed',
    descriptionEn: 'Jasmine green tea and sweet lychee topped with glistening honeyed palm seed.',
    editorialNoteEn: 'Crunchy tropical seed topping',
  },
  'tra-12': {
    nameEn: 'Pineapple Guava Tea + Palm Seed',
    descriptionEn: 'Pink guava and sweet mountain pineapple juice crowned with translucent palm seed.',
    editorialNoteEn: 'Zesty tropical island harmony',
  },
  'tra-13': {
    nameEn: 'Honeyed Papaya Flower Herbal Infusion',
    descriptionEn: 'Handpicked male papaya blossoms gently steamed with forest wildflower honey.',
    editorialNoteEn: 'Traditional herbal sanctuary tonic',
    highlightEn: 'Đặc sản thảo mộc xanh sạch',
  },
  'tra-14': {
    nameEn: 'Organic Dried Wax Flower Tea',
    descriptionEn: 'Rare sun-dried porcelain wax flower petals brewed into a sweet, crystal-clear golden nectar.',
    editorialNoteEn: 'Exclusive house specialty from our vines',
    highlightEn: 'Signature',
  },
  'tra-15': {
    nameEn: 'Cold-Brewed Hibiscus Berry Tea',
    descriptionEn: 'Highland hibiscus calyces slow cold-brewed with wild berries for a crisp tart balance.',
    editorialNoteEn: 'Vibrant ruby antioxidant infusion',
  },

  // 3. Sinh tố (Smoothies)
  'st-01': {
    nameEn: 'Dak Nong Butter Avocado Smoothie',
    descriptionEn: 'Renowned volcanic soil butter avocado blended thick, velvety, and naturally rich.',
    editorialNoteEn: 'Naturally creamy from local Gia Nghia orchards',
    highlightEn: 'Đăk Nông mùa bơ sáp',
  },
  'st-02': {
    nameEn: 'Avocado & Durian Supreme Smoothie',
    descriptionEn: 'Premium butter avocado blended with golden Ri6 durian flesh for ultimate decadence.',
    editorialNoteEn: 'A royal treat for true durian aficionados',
    highlightEn: 'Signature béo ngậy',
  },
  'st-03': {
    nameEn: 'Wild Strawberry Smoothie',
    descriptionEn: 'Sweet-tart Highland strawberries whipped smooth with creamy whole milk.',
    editorialNoteEn: 'Vibrant rosy pink full of vitamin C',
  },
  'st-04': {
    nameEn: 'Ripe Tropical Mango Smoothie',
    descriptionEn: 'Golden ripe mango puree blended into a luscious tropical nectar.',
    editorialNoteEn: 'Sunny natural mango goodness',
  },
  'st-05': {
    nameEn: 'Blueberry Cream Smoothie',
    descriptionEn: 'Antioxidant-packed blueberries whipped into a cooling violet smoothie.',
    editorialNoteEn: 'Deep berry aroma, gentle sweetness',
  },
  'st-06': {
    nameEn: 'Crisp Sapodilla Smoothie',
    descriptionEn: 'Honey-sweet brown sapodilla fruit blended into a nostalgic, caramel-toned smoothie.',
    editorialNoteEn: 'Earthy caramel sweetness from garden fruit',
  },
  'st-07': {
    nameEn: 'Creamy Custard Apple Smoothie',
    descriptionEn: 'Ripe de-seeded custard apple pulp whipped smooth with creamy condensed milk.',
    editorialNoteEn: 'Velvety tropical sweetness',
  },
  'st-08': {
    nameEn: 'Custom Dual-Fruit Smoothie',
    descriptionEn: 'Choose your favorite blend of two seasonal fruits (e.g., Avocado + Strawberry, Mango + Blueberry).',
    editorialNoteEn: 'Tell the barista your dream fruit pairing',
    variantsEn: [
      { id: 'mix-av-sb', name: 'Avocado + Strawberry', price: 40000 },
      { id: 'mix-mg-bb', name: 'Mango + Blueberry', price: 40000 },
    ],
  },
  'st-09': {
    nameEn: 'Custom Triple-Fruit Smoothie',
    descriptionEn: 'Wholesome three-fruit blend crafted to order from our fresh fruit counter.',
    editorialNoteEn: 'Vitamin-rich custom smoothie blend',
    variantsEn: [
      { id: 'mix-3-standard', name: 'Triple Fruit Blend', price: 45000 },
    ],
  },

  // 4. Nước ép (Fresh Juice)
  'ne-01': {
    nameEn: 'Fresh Orange Juice',
    descriptionEn: 'Slow cold-pressed from fresh green-skin oranges, bursting with vitamin C.',
    editorialNoteEn: 'Pure freshly squeezed citrus juice',
  },
  'ne-02': {
    nameEn: 'Crisp Green Apple Juice',
    descriptionEn: 'Cold-pressed crunchy green apples with a natural sweet-tangy finish.',
    editorialNoteEn: 'Crisp and pure without added sugar',
  },
  'ne-03': {
    nameEn: 'Sweet Red Watermelon Juice',
    descriptionEn: 'Freshly pressed seedless red watermelon, deeply refreshing on warm days.',
    editorialNoteEn: 'Pure red streamside refresher',
  },
  'ne-04': {
    nameEn: 'Highland Golden Pineapple Juice',
    descriptionEn: 'Sun-ripened mountain pineapples cold-pressed to retain zesty tropical vitality.',
    editorialNoteEn: 'Bright tropical citrus energy',
  },
  'ne-05': {
    nameEn: 'Organic Dak Nong Carrot Juice',
    descriptionEn: 'Freshly harvested sweet carrots rich in beta-carotene for radiant skin.',
    editorialNoteEn: 'Earthy sweetness packed with minerals',
  },
  'ne-06': {
    nameEn: 'Fresh Pink Guava Juice',
    descriptionEn: 'Fragrant pink guava pressed with pure cane sugar and crushed ice.',
    editorialNoteEn: 'Heady tropical perfume, high vitamin C',
  },
  'ne-07': {
    nameEn: 'Wholesome Tomato Juice',
    descriptionEn: 'Sun-ripened vine tomatoes cold-pressed with a hint of sea salt.',
    editorialNoteEn: 'Clean botanical skin nutrition',
  },
  'ne-08': {
    nameEn: 'Crisp Green Celery Juice',
    descriptionEn: 'Crisp water celery cold-pressed for optimal cellular detox and hydration.',
    editorialNoteEn: 'Pure green cleanse for your body',
    highlightEn: 'Green Detox xanh sạch',
  },
  'ne-09': {
    nameEn: 'Custom Dual-Cold Pressed Juice',
    descriptionEn: 'Mix any two fresh fruits or botanicals (e.g., Orange + Carrot, Apple + Celery).',
    editorialNoteEn: 'Custom freshly cold-pressed pairing',
    variantsEn: [
      { id: 'mix-or-cr', name: 'Orange + Carrot', price: 35000 },
      { id: 'mix-ap-cl', name: 'Apple + Celery', price: 35000 },
    ],
  },
  'ne-10': {
    nameEn: 'Custom Triple-Cold Pressed Juice',
    descriptionEn: 'Craft your signature healthy trio blend from our daily organic harvest.',
    editorialNoteEn: 'Ultimate antioxidant cold-pressed formula',
    variantsEn: [
      { id: 'mix-3-detox', name: 'Triple Detox Cold Press', price: 40000 },
    ],
  },

  // 5. Soda & Sữa chua (Soda & Yogurt)
  'sd-01': {
    nameEn: 'Blueberry Sparking Soda',
    descriptionEn: 'Bubbly Italian sparkling water layered with rich wild blueberry syrup and mint.',
    editorialNoteEn: 'Vibrant indigo blue fizz',
  },
  'sd-02': {
    nameEn: 'Highland Strawberry Soda',
    descriptionEn: 'Sparkling mineral water infused with crushed ripe strawberries and fresh lime.',
    editorialNoteEn: 'Effervescent sweet strawberry refreshment',
  },
  'sd-03': {
    nameEn: 'Kiwi Garden Soda',
    descriptionEn: 'Emerald kiwi puree sparkling with ice and mint leaves.',
    editorialNoteEn: 'Bright zesty sweet-tart fizz',
  },
  'sd-04': {
    nameEn: 'Blue Ocean Curacao Soda',
    descriptionEn: 'Deep turquoise citrus curacao soda evoking clear mountain streams.',
    editorialNoteEn: 'Cool oceanic blue aesthetic',
  },
  'sd-05': {
    nameEn: 'Tropical Passion Fruit Soda',
    descriptionEn: 'Fresh tart passion fruit seeds dancing in bubbly soda water.',
    editorialNoteEn: 'Zesty aroma that awakens your senses',
  },
  'sd-06': {
    nameEn: 'Homemade Iced Sweet Yogurt',
    descriptionEn: 'Fermented artisanal yogurt stirred over crushed ice with sweet condensed milk.',
    editorialNoteEn: 'Smooth digestive comfort',
  },
  'sd-07': {
    nameEn: 'Berry Fruit Yogurt Glass',
    descriptionEn: 'Silky homemade yogurt drizzled with blueberry or strawberry fruit coulis.',
    editorialNoteEn: 'Creamy tart harmony',
    variantsEn: [
      { id: 'sc-bb', name: 'Wild Blueberry', price: 30000 },
      { id: 'sc-sb', name: 'Highland Strawberry', price: 30000 },
    ],
  },
  'sd-08': {
    nameEn: 'Matcha Yogurt Glass',
    descriptionEn: 'Silky Greek yogurt topped with a concentrated shot of pure Japanese matcha.',
    editorialNoteEn: 'Botanical fusion of tart and bittersweet',
  },

  // 6. Thức uống khác (Other Drinks)
  'ot-01': {
    nameEn: 'Fresh Kumquat Tea',
    descriptionEn: 'Highland black tea shaken vigorously with aromatic tart green kumquats.',
    editorialNoteEn: 'Traditional Vietnamese citrus refresher',
  },
  'ot-02': {
    nameEn: 'Iced Fresh Lemonade',
    descriptionEn: 'Freshly squeezed limes with mineral water and natural cane sugar.',
    editorialNoteEn: 'Cooling classic by the water',
  },
  'ot-03': {
    nameEn: 'Sparkling Lemonade Soda',
    descriptionEn: 'Pungent fresh lime juice charged with crisp fizzy soda water.',
    editorialNoteEn: 'Fizzy citrus rejuvenation',
  },
  'ot-04': {
    nameEn: 'Warm Honey Lime Tea',
    descriptionEn: 'Pure forest honey melted with freshly squeezed lime into warm mountain water.',
    editorialNoteEn: 'Pure Dak Nong wild forest honey',
  },
  'ot-05': {
    nameEn: 'Preserved Salted Lemon Drink',
    descriptionEn: 'Traditional crock-pot aged salted lemons with warm cane sugar water.',
    editorialNoteEn: 'Slowly fermented artisanal throat remedy',
  },
  'ot-06': {
    nameEn: 'Crushed Watermelon & Calamansi Slush',
    descriptionEn: 'Juicy red watermelon pulp crushed with aromatic calamansi essential oils.',
    editorialNoteEn: 'House creative signature streamside cooler',
    highlightEn: 'Giải nhiệt bên suối',
  },
  'ot-07': {
    nameEn: 'Artisan Matcha Latte',
    descriptionEn: 'High-grade Uji green tea whisked with bamboo Chasen into velvety steamed milk.',
    editorialNoteEn: 'Noble, refined Japanese green tea notes',
  },
  'ot-08': {
    nameEn: 'Matcha & Sweet Red Bean Latte',
    descriptionEn: 'Slow-simmered tender sweet azuki beans layered under frosty emerald matcha latte.',
    editorialNoteEn: 'Timeless Japanese cafe classic',
  },
  'ot-09': {
    nameEn: 'Oreo Cookie Ice Blended',
    descriptionEn: 'Crunchy chocolate Oreo cookies blended with whole milk and crowned with whipping cream.',
    editorialNoteEn: 'Decadent sweet favorite for the young at heart',
  },

  // 7. Đồ ăn no & Ăn vặt (Food & Snacks)
  'fd-01': {
    nameEn: 'Sunny-Side Eggs & German Sausage',
    descriptionEn: 'Two golden farm eggs sunny-side up, grilled sausage, and warm crusty French baguette.',
    editorialNoteEn: 'Warm morning breakfast',
  },
  'fd-02': {
    nameEn: 'Classic Spaghetti Bolognese',
    descriptionEn: 'Al dente Italian pasta smothered in slow-cooked minced beef tomato ragù and shaved cheese.',
    editorialNoteEn: 'Hearty warm lunch full of vitality',
  },
  'fd-03': {
    nameEn: 'Tender Beef Stew with Crusty Baguette',
    descriptionEn: 'Slow-braised beef brisket and tendon infused with cinnamon, star anise, and fresh coconut water.',
    editorialNoteEn: 'Traditional comforting recipe beside the stream',
    highlightEn: 'Điểm tâm đậm đà',
  },
  'fd-04': {
    nameEn: 'Aromatic Chicken Curry with Baguette',
    descriptionEn: 'Tender free-range chicken simmered with sweet yams and rich coconut milk broth.',
    editorialNoteEn: 'Fragrant and comforting hearty meal',
  },
  'fd-05': {
    nameEn: 'Dew-Drying Rice Paper Wrap',
    descriptionEn: 'Chewy artisan dew-dried rice paper rolled with crispy shallots, rich butter, and dipping sauce.',
    editorialNoteEn: 'Beloved Vietnamese street snack for gathering',
    variantsEn: [
      { id: 'bt-sate', name: '+ Fragrant Spicy Sate', price: 25000 },
      { id: 'bt-cay', name: '+ Fiery Chili Pepper', price: 25000 },
    ],
  },
  'fd-06': {
    nameEn: 'Golden Mozzarella Cheese Sticks',
    descriptionEn: 'Crispy panko-breaded crust encasing gooey, pull-apart melted mozzarella cheese.',
    editorialNoteEn: 'Crispy golden pull-apart cheese sticks',
  },
  'fd-07': {
    nameEn: 'Crispy French Fries with Butter Salt',
    descriptionEn: 'Golden crinkle-cut potatoes, crispy on the outside and tender inside, tossed in butter salt.',
    editorialNoteEn: 'Crispy and savory snack with chili dip',
  },
  'fd-08': {
    nameEn: 'Crispy Fried Fish Balls',
    descriptionEn: 'Springy bouncy basa fish balls deep-fried to golden perfection with spicy hoisin dip.',
    editorialNoteEn: 'Authentic popular street snack',
  },
  'fd-09': {
    nameEn: 'Savory Fried Beef Meatballs',
    descriptionEn: 'Juicy spiced beef meatballs fried crisp on skewers with sweet chili dip.',
    editorialNoteEn: 'Savory, juicy, and satisfying',
  },
  'fd-10': {
    nameEn: 'Crispy Green Rice Fish Cakes',
    descriptionEn: 'Fragrant young sticky green rice flakes coated over springy sweet fish cakes.',
    editorialNoteEn: 'Delicate aroma of young autumn rice',
  },
  'fd-11': {
    nameEn: 'Grilled / Fried Savory Meat Gourds',
    descriptionEn: 'Bite-sized seasoned pork gourds with crushed black pepper on convenient bamboo skewers.',
    editorialNoteEn: 'Juicy, savory spiced skewered bites',
  },
  'fd-12': {
    nameEn: 'Oak-Smoked German Sausage',
    descriptionEn: 'Premium oak-smoked German sausage with taut crispy casing and juicy seasoned meat.',
    editorialNoteEn: 'Authentic oak-smoked snap and savor',
  },
};

export const spatialPlateTranslations: Record<string, PlateTranslation> = {
  'FIG. 01': {
    chapterTitleEn: 'Chapter I — The Wax Flower Path',
    titleEn: 'Entrance Alley Down to Cẩm Cù House',
    locationEn: 'Alley 437 Hung Vuong Gate',
    descriptionEn: 'A gentle slope shaded by native trees leading from the bustling avenue down into our quiet streamside sanctuary.',
  },
  'FIG. 02': {
    chapterTitleEn: 'Chapter I — The Wax Flower Path',
    titleEn: 'Rustic Wood Plaque & Basalt Stepping Stones',
    locationEn: 'Main Entrance Arch',
    descriptionEn: 'Rough-hewn wooden plaque bearing Cẩm Cù House, welcoming guests onto weathered basalt stepping stones.',
  },
  'FIG. 03': {
    chapterTitleEn: 'Chapter I — The Wax Flower Path',
    titleEn: 'Blooming Porcelain Wax Flower Vine Pergola',
    locationEn: 'Sanctuary Front Garden',
    descriptionEn: 'Clusters of star-shaped ivory flowers blooming along the canopy, gently diffusing delicate natural perfume into the air.',
  },
  'FIG. 04': {
    chapterTitleEn: 'Chapter I — The Wax Flower Path',
    titleEn: 'Open Wooden Bar & Forest-Facing Counter',
    locationEn: 'Central Order Bar',
    descriptionEn: 'Crafted from warm local pinewood where baristas handcraft wood-roasted Robusta coffee beneath natural forest daylight.',
  },
  'FIG. 05': {
    chapterTitleEn: 'Chapter I — The Wax Flower Path',
    titleEn: 'Natural Skylight & Fresh Mountain Air',
    locationEn: 'Main Covered Lounge',
    descriptionEn: 'An open-air architectural design inviting mountain breezes and sunlight without any stifling air conditioning.',
  },
  'FIG. 06': {
    chapterTitleEn: 'Chapter I — The Wax Flower Path',
    titleEn: 'Handmade Ceramic Planters on Rough Basalt',
    locationEn: 'Garden Walkway Edge',
    descriptionEn: 'Terracotta pots filled with lush ferns and moss-covered stones lining the rustic stone pathways.',
  },
  'FIG. 07': {
    chapterTitleEn: 'Chapter I — The Wax Flower Path',
    titleEn: 'Terraced Wooden Decks Down to the Water',
    locationEn: 'Middle Hillside Terrace',
    descriptionEn: 'Cascading natural wooden platforms following the hillside slope down toward the gentle murmuring stream.',
  },
  'FIG. 08': {
    chapterTitleEn: 'Chapter I — The Wax Flower Path',
    titleEn: 'Morning Sunlight Filtering Through Ferns',
    locationEn: 'Botanical Greenhouse Corner',
    descriptionEn: 'Dappled golden morning sun filtering through lush tropical fiddle-leaf figs and fern fronds.',
  },
  'FIG. 09': {
    chapterTitleEn: 'Chapter II — Beside the Cool Stream',
    titleEn: 'Perpetual Natural Mountain Stream',
    locationEn: 'Main Brook Section',
    descriptionEn: 'Crystal-clear freshwater flowing gently over ancient river stones, providing natural year-round cool air.',
  },
  'FIG. 10': {
    chapterTitleEn: 'Chapter II — Beside the Cool Stream',
    titleEn: 'Waterfront Tables Dipping into the Water',
    locationEn: 'Stream Tables 01 - 04',
    descriptionEn: 'Sit directly beside the running brook, dip your bare feet into the crystal water and sip your ice-cold coffee.',
  },
  'FIG. 11': {
    chapterTitleEn: 'Chapter II — Beside the Cool Stream',
    titleEn: 'Centuries-Old Weathered River Boulders',
    locationEn: 'Central Stream Rapid',
    descriptionEn: 'Smooth river stones sculpted over centuries by gentle water currents, cushioned with green moss.',
  },
  'FIG. 12': {
    chapterTitleEn: 'Chapter II — Beside the Cool Stream',
    titleEn: 'Rustic Wood Round Tables & Rattan Chairs',
    locationEn: 'Stream Table 06',
    descriptionEn: 'Handcrafted rattan and solid natural wood furnishings blending seamlessly into the streamside forest.',
  },
  'FIG. 13': {
    chapterTitleEn: 'Chapter II — Beside the Cool Stream',
    titleEn: 'Schools of Little Stream Fish in Clear Water',
    locationEn: 'Pebbled Riverbed',
    descriptionEn: 'Playful native river fish swimming freely through the pure, transparent cool mountain currents.',
  },
  'FIG. 14': {
    chapterTitleEn: 'Chapter II — Beside the Cool Stream',
    titleEn: 'Quiet Streamside Corner for the Soul',
    locationEn: 'Solo Streamside Reading Table',
    descriptionEn: 'A tranquil nook with only yourself, your favorite novel, and a rich cup of salted cream coffee.',
  },
  'FIG. 15': {
    chapterTitleEn: 'Chapter II — Beside the Cool Stream',
    titleEn: 'Early Morning Water Mist Over the Stream',
    locationEn: 'Panoramic Stream View',
    descriptionEn: 'Soft mist hovering above the stream bed at 7:00 AM, painting an ethereal, poetic highland canvas.',
  },
  'FIG. 16': {
    chapterTitleEn: 'Chapter II — Beside the Cool Stream',
    titleEn: 'Symphony of Babbling Water & Pine Winds',
    locationEn: 'Shallow Brook Crossing',
    descriptionEn: 'The therapeutic acoustic resonance of flowing water and gentle breeze slowing your heartbeat.',
  },
  'FIG. 17': {
    chapterTitleEn: 'Chapter III — Wholesome Pure Flavors',
    titleEn: 'Cẩm Cù Signature Salt Cream Coffee',
    locationEn: 'Open Bar Preparation Area',
    descriptionEn: 'Rich velvety cream with a sprinkle of pink sea salt slowly fusing into dark Dak Nong Robusta.',
  },
  'FIG. 18': {
    chapterTitleEn: 'Chapter III — Wholesome Pure Flavors',
    titleEn: 'Fresh Peach Orange Lemongrass Tea',
    locationEn: 'Outdoor Garden Serving Table',
    descriptionEn: 'Crushed highland lemongrass, juicy citrus slices, and crisp peach wedges for vibrant midday energy.',
  },
  'FIG. 19': {
    chapterTitleEn: 'Chapter III — Wholesome Pure Flavors',
    titleEn: 'Creamy Dak Nong Butter Avocado Smoothie',
    locationEn: 'Streamside Wooden Table',
    descriptionEn: 'Prized volcanic soil butter avocados whipped into a rich, luscious green velvet smoothie without excess sugar.',
  },
  'FIG. 20': {
    chapterTitleEn: 'Chapter III — Wholesome Pure Flavors',
    titleEn: 'Steamed Papaya Blossoms with Wild Forest Honey',
    locationEn: 'Elevated Wooden Veranda',
    descriptionEn: 'Valuable restorative herbal tonic combining bitter-sweet male papaya flowers and wildflower honey.',
  },
  'FIG. 21': {
    chapterTitleEn: 'Chapter III — Wholesome Pure Flavors',
    titleEn: 'Frosty Iced Coconut Coffee Slush',
    locationEn: 'Garden Table 02',
    descriptionEn: 'Pure Ben Tre coconut snow slush crowned with an aromatic shot of concentrated espresso.',
  },
  'FIG. 22': {
    chapterTitleEn: 'Chapter III — Wholesome Pure Flavors',
    titleEn: 'Organic Kale Pure Green Detox Juice',
    locationEn: 'Covered Garden Lounge',
    descriptionEn: 'Vibrant emerald cold-pressed kale juice delivering clean cellular energy and vitality.',
  },
  'FIG. 23': {
    chapterTitleEn: 'Chapter III — Wholesome Pure Flavors',
    titleEn: 'Hearty Beef Stew & Warm French Baguette',
    locationEn: 'Morning Dining Area',
    descriptionEn: 'Tender braised beef brisket simmered with cinnamon and star anise beside the murmuring water.',
  },
  'FIG. 24': {
    chapterTitleEn: 'Chapter IV — Twilight & Weekend Nights',
    titleEn: 'Golden Sunset Reflected on the Stream',
    locationEn: 'Sunset Observation Deck',
    descriptionEn: 'The afternoon sun dipping behind Gia Nghia pine hills, gilding the brook with shimmering golden light.',
  },
  'FIG. 25': {
    chapterTitleEn: 'Chapter IV — Twilight & Weekend Nights',
    titleEn: 'Warm Fairy Lights Glowing in the Canopy',
    locationEn: 'Wax Flower Garden Patio',
    descriptionEn: 'As dusk settles over the valley, hundreds of soft amber lanterns turn the sanctuary into a fairytale forest.',
  },
  'FIG. 26': {
    chapterTitleEn: 'Chapter IV — Twilight & Weekend Nights',
    titleEn: 'Saturday Acoustic Live Night by the Water',
    locationEn: 'Streamside Wood Stage',
    descriptionEn: 'Acoustic guitar melodies and heartfelt vocals echoing alongside flowing water to warm cool highland nights.',
  },
  'FIG. 27': {
    chapterTitleEn: 'Chapter IV — Twilight & Weekend Nights',
    titleEn: 'Romantic Candlelit Corner Under the Stars',
    locationEn: 'Stream Table 04 at Night',
    descriptionEn: 'Intimate streamside dining for couples beneath a glittering star-studded mountain sky.',
  },
  'FIG. 28': {
    chapterTitleEn: 'Chapter IV — Twilight & Weekend Nights',
    titleEn: 'Nocturnal Wax Flower Perfume in the Air',
    locationEn: 'Cẩm Cù Vines by Night',
    descriptionEn: 'Clusters of wax flowers release their sweetest, most intoxicating natural perfume after nightfall.',
  },
  'FIG. 29': {
    chapterTitleEn: 'Chapter IV — Twilight & Weekend Nights',
    titleEn: 'Sipping Hot Cocoa on Chilly Evenings',
    locationEn: 'Cozy Fireplace Veranda',
    descriptionEn: 'Holding a warm mug of artisanal cocoa while gazing at illuminated water reflections (open until 22:00 on weekends).',
  },
  'FIG. 30': {
    chapterTitleEn: 'Chapter IV — Twilight & Weekend Nights',
    titleEn: 'Farewell Until Tomorrow by the Stream',
    locationEn: 'Evening Farewell Gate',
    descriptionEn: 'A fulfilling day concludes with deep peace; Cẩm Cù House whispers goodnight and looks forward to your return.',
  },
  'FIG. 31': {
    chapterTitleEn: 'Chapter IV — Twilight & Weekend Nights',
    titleEn: 'Serene Evening by the Streamside',
    locationEn: 'Streamside at Cẩm Cù House, Dong Gia Nghia',
    descriptionEn: 'The gentle transition between dusk and twilight, where warm lantern light reflects on the flowing water.',
  },
};

export const eventTranslations: Record<string, EventTranslation> = {
  'evt-01': {
    titleEn: 'Streamside Acoustic Live Night',
    subtitleEn: 'Every Saturday • 19:30 – 21:30',
    dateOrScheduleEn: 'Every Saturday evening',
    descriptionEn: 'Listen to rustic acoustic melodies by the campfire and glittering nocturnal stream.',
    badgeEn: 'Weekly Event',
  },
  'evt-02': {
    titleEn: 'Dak Nong Butter Avocado Season 2026',
    subtitleEn: 'Celebrated local specialty from Gia Nghia orchards',
    dateOrScheduleEn: 'Ongoing Season',
    descriptionEn: 'Enjoy luscious avocado and durian smoothies freshly crafted from selected local organic orchards.',
    badgeEn: 'Seasonal Harvest',
  },
  'evt-03': {
    titleEn: 'Morning Sunrise Happy Hour',
    subtitleEn: '07:00 – 09:00 Daily',
    dateOrScheduleEn: 'Daily (07:00 – 09:00)',
    descriptionEn: 'Welcome the fresh new morning beside the cool stream with traditional wood-roasted Robusta coffee.',
    badgeEn: 'Daily Special',
  },
};

export const defaultSettingsEn = {
  taglineEn: 'Botanical Eco-Coffee & Streamside Sanctuary — Fresh, serene, and harmonized with rainforest nature in the heart of Dong Gia Nghia, Lam Dong.',
  addressEn: 'Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong',
  hoursWeekdayEn: 'Mon – Thu: 07:00 – 18:00',
  hoursWeekendEn: 'Fri – Sun: 07:00 – 22:00',
  socialProofEn: '100% Recommended (Based on 8/8 customer reviews)',
  announcementEn: 'Acoustic live music by the stream every Saturday evening (19:30 - 21:30)',
  footerDescEn: 'Eco-coffee sanctuary nestled beside a natural stream in Dong Gia Nghia, Lam Dong. Wood-roasted coffee, fresh herbal teas, and tranquil rainforest canopy.',
  defaultLanguage: 'vi' as const,
  defaultTheme: 'light' as const,
  lightBgHex: '#F6F3EC',
  lightAccentHex: '#2E5A3C',
  darkBgHex: '#111915',
  darkAccentHex: '#4C9A67',
};

export const defaultContentEn = {
  heroEyebrowEn: 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY',
  heroTitleEn: 'CẨM CÙ HOUSE',
  heroSubtitleEn: 'Beside Fresh Mountain Stream • Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong',
  heroTaglineEn: 'Eco-coffee sanctuary beside a natural stream — Fresh, serene, and harmonized with rainforest nature in the heart of Dong Gia Nghia, Lam Dong.',
  heroDescriptionEn: 'Experience year-round cool streamside breezes, natural waterfall views, authentic wood-roasted Dak Nong basalt coffee, and wholesome botanical herbal drinks for peace of mind.',
  philosophyEyebrowEn: 'ABOUT OUR STREAMSIDE SANCTUARY',
  philosophyTitleEn: 'Where Your Breath Slows Down by the Gentle Stream',
  philosophyLeadEn: 'In the heart of Dong Gia Nghia, Lam Dong, Cẩm Cù House is nestled down a tree-shaded slope at Alley 437 Hung Vuong, sitting peacefully along a gentle natural stream flowing year-round.',
  philosophyStoryEn: 'We preserve the pristine basalt rocks, rainforest canopy, and cool water mists to create a truly pure, serene haven for you and your loved ones.',
  philosophyCardsEn: [
    {
      title: 'Dòng Suối Tự Nhiên Mát Lành',
      titleEn: 'Cool Natural Mountain Stream',
      desc: 'Bờ suối uốn lượn róc rách suốt 4 mùa mang đến hơi sương tinh khôi, xua tan cái oi bức và mệt mỏi.',
      descEn: 'A winding brook flowing gently year-round brings pure fresh mist, washing away all worldly heat and exhaustion.',
      iconName: 'Droplets',
    },
    {
      title: 'Hương Vị Bazan Đăk Nông',
      titleEn: 'Dak Nong Basalt Soil Flavors',
      desc: 'Hạt cà phê Robusta tuyển chọn chín mọng trên vùng đất đỏ núi lửa, rang mộc giữ trọn hương nồng đậm đà.',
      descEn: 'Sun-ripened Robusta beans harvested from volcanic red soils, wood-roasted to preserve rich botanical depth.',
      iconName: 'Coffee',
    },
    {
      title: 'Vòm Lá & Hoa Lan Cẩm Cù',
      titleEn: 'Wax Flower Vines & Canopy',
      desc: 'Không gian ngập tràn sắc xanh sinh thái, nơi những chùm hoa Cẩm Cù bung nở dịu dàng trong nắng sớm.',
      descEn: 'A lush ecological canopy where porcelain wax flower clusters bloom gracefully in the morning sun.',
      iconName: 'Sprout',
    },
  ],
  brandStoryTitleEn: 'The Awakening Journey Beneath the Wax Plant Vines',
  brandStorySubtitleEn: 'A Story of Basalt Soil, Gentle Streams & Pure Wood-Roasted Coffee',
  brandStoryContentEn: 'Dong Gia Nghia, Lam Dong is blessed not only with waterfalls and boundless greenery, but also serene green valleys. Cẩm Cù House was born from our profound love for nature and a dream to preserve an untamed green haven in Dong Gia Nghia. Star-shaped porcelain wax flowers bloom gracefully over the crystal-clear streams.',
  brandStoryPhilosophyEn: 'Our philosophy is simple: "Green - Wholesome - Pure". Every cup of wood-roasted coffee carries the volcanic richness of basalt soil; every herbal teapot is carefully harvested from home garden botanicals. No noisy air conditioners or traffic honks—only mountain breeze, babbling water, and warm laughter.',
};


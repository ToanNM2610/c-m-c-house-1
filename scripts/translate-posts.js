const fs = require('fs');
const path = require('path');

const postsPath = path.join(__dirname, '../src/data/posts.json');
const data = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

const translations = {
  "post-1": {
    titleEn: "A misty morning by the stream",
    summaryEn: "Morning dew drops on the leaves, the babbling stream brings a strangely peaceful feeling.",
    contentEn: "Early morning in Dak Nong has a very unique beauty. When the morning mist had not yet melted, we woke up to prepare the first batches of rustic roasted coffee of the day. The chirping of birds mixed with the babbling stream creates a wonderful symphony of nature.\n\nCome visit Cam Cu House, take a sip of warm coffee and feel the breath of the Central Highlands mountains and forests.",
    categoryEn: "Space"
  },
  "post-2": {
    titleEn: "The original coffee flavor of Dak Nong",
    summaryEn: "Every coffee bean at Cam Cu House is carefully selected from green ecological coffee farms.",
    contentEn: "To get a standard cup of coffee, we have to go through a long process from caring for seedlings, manual harvesting to meticulous roasting.\n\nRustic coffee without marination, preserving the original flavor of heaven and earth. When enjoying it, you will feel a slight bitterness, mild sourness and a deep sweet aftertaste lingering in your throat. That is the essence of the fertile basalt land.",
    categoryEn: "Coffee"
  },
  "post-3": {
    titleEn: "The Hoya flower corner is blooming this season",
    summaryEn: "Hoya flower - the symbol of luck and strong vitality has begun to bloom brilliantly in the small garden corner.",
    contentEn: "Hoya is a climbing plant with beautiful five-pointed star-shaped flower clusters, formed into a sphere. The name of the shop - Cam Cu House - also originated from our special love for this rustic but full-of-vitality flower.\n\nThis season, the Hoya flower trellises around the porch are blooming, emitting a gentle, sweet fragrance, attracting small butterflies flying around, creating a truly poetic scene.",
    categoryEn: "Stories"
  }
};

const updatedData = data.map(item => {
  const trans = translations[item.id] || {};
  return {
    ...item,
    titleEn: trans.titleEn || item.title,
    summaryEn: trans.summaryEn || item.summary,
    contentEn: trans.contentEn || item.content,
    categoryEn: trans.categoryEn || item.category
  };
});

fs.writeFileSync(postsPath, JSON.stringify(updatedData, null, 2), 'utf8');
console.log('Posts translated successfully.');

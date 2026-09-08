const fs = require('fs');
let content = fs.readFileSync('src/data/menu.ts', 'utf8');

const images = {
  'Cà Phê': 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&q=80',
  'Trà': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80',
  'Sinh Tố': 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=800&q=80',
  'Nước Ép': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80',
  'Soda & Sữa Chua': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
  'Khác': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
  'Món Ăn': 'https://images.unsplash.com/photo-1548943487-a2e4f43b4850?w=800&q=80'
};

content = content.replace(/category:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"/g, (match, cat, img) => {
    return match.replace(img, images[cat] || images['Khác']);
});

fs.writeFileSync('src/data/menu.ts', content);

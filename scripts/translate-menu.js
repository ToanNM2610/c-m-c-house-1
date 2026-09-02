const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, '../src/data/menu.json');
const data = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

const translations = {
  "Cà phê đen/sữa": "Black/Milk Coffee",
  "Cà phê sài gòn": "Saigon Coffee",
  "Cà phê muối": "Salted Coffee",
  "Cà phê dừa xay": "Coconut Blended Coffee",
  "Cà phê kem trứng": "Egg Cream Coffee",
  "Bạc xỉu": "Bac Xiu (White Coffee)",
  "Cacao sữa": "Milk Cocoa",
  "Cacao kem muối": "Salted Cream Cocoa",
  "Cacao kem trứng": "Egg Cream Cocoa",
  "Trà gừng mật ong": "Honey Ginger Tea",
  "Trà Lipton thảo mộc": "Herbal Lipton Tea",
  "Trà vải": "Lychee Tea",
  "Trà đào": "Peach Tea",
  "Trà đào cam sả": "Peach Orange Lemongrass Tea",
  "Trà chanh dây": "Passion Fruit Tea",
  "Trà dâu tây": "Strawberry Tea",
  "Trà lài kem muối": "Salted Cream Jasmine Tea",
  "Trà lài trái cây": "Fruit Jasmine Tea",
  "Trà ổi hồng": "Pink Guava Tea",
  "Trà sen vải": "Lychee Lotus Tea",
  "Olong sữa": "Milk Oolong",
  "Sữa tươi trân châu đường đen": "Fresh Milk Brown Sugar Boba",
  "Sữa tươi kem trứng trân châu đường đen": "Egg Cream Fresh Milk Brown Sugar Boba",
  "Trà sữa truyền thống": "Traditional Milk Tea",
  "Trà sữa trân châu trắng": "White Boba Milk Tea",
  "Trà sữa kem trứng": "Egg Cream Milk Tea",
  "Matcha sữa": "Matcha Milk",
  "Nước ép dứa thơm": "Pineapple Juice",
  "Nước ép dưa hấu": "Watermelon Juice",
  "Nước ép cà rốt": "Carrot Juice",
  "Nước ép ổi": "Guava Juice",
  "Nước ép cam": "Orange Juice",
  "Nước ép táo": "Apple Juice",
  "Cam vắt mật ong": "Honey Squeezed Orange",
  "Đá chanh": "Lime Ice",
  "Chanh dây đá": "Passion Fruit Ice",
  "Sinh tố bơ": "Avocado Smoothie",
  "Sinh tố mãng cầu": "Soursop Smoothie",
  "Sinh tố dâu tây": "Strawberry Smoothie",
  "Sinh tố dừa": "Coconut Smoothie",
  "Chanh tuyết": "Snow Lemon",
  "Đá xay socola": "Chocolate Frappe",
  "Đá xay matcha": "Matcha Frappe",
  "Sữa chua đá": "Ice Yogurt",
  "Sữa chua đánh đá cafe": "Coffee Beaten Ice Yogurt",
  "Sữa chua trái cây": "Fruit Yogurt",
  "Sữa chua dâu tây": "Strawberry Yogurt",
  "Hạt hướng dương": "Sunflower Seeds",
  "Bánh quy": "Cookies"
};

const catTranslations = {
  "CÀ PHÊ": "COFFEE",
  "TRÀ": "TEA",
  "NƯỚC ÉP": "JUICE",
  "SINH TỐ": "SMOOTHIE",
  "SỮA CHUA": "YOGURT",
  "ĐỒ ĂN NHẸ": "SNACKS",
  "ĐÁ XAY": "FRAPPE",
  "TRÀ SỮA": "MILK TEA",
  "TRÁI CÂY": "FRUIT"
};

const updatedData = data.map(item => {
  return {
    ...item,
    nameEn: translations[item.name] || item.name,
    categoryEn: catTranslations[item.category] || item.category
  };
});

fs.writeFileSync(menuPath, JSON.stringify(updatedData, null, 2), 'utf8');
console.log('Menu translated successfully.');

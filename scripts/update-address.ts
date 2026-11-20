import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Executing live SQLite address update to Đông Gia Nghĩa, Lâm Đồng...');

  // 1. Update StoreSettings
  const updatedSettings = await prisma.storeSettings.update({
    where: { id: 'default' },
    data: {
      address: 'Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng',
      addressEn: 'Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong',
      tagline: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng.',
      taglineEn: 'Botanical Eco-Coffee & Streamside Sanctuary — Fresh, serene, and harmonized with rainforest nature in the heart of Dong Gia Nghia, Lam Dong.',
      introEyebrowVi: 'ĐÔNG GIA NGHĨA • LÂM ĐỒNG • HẺM 437 HÙNG VƯƠNG',
      introEyebrowEn: 'DONG GIA NGHIA • LAM DONG • ALLEY 437 HUNG VUONG',
      footerDesc: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng. Thức uống thảo mộc và cà phê rang mộc.',
      footerDescEn: 'Eco-coffee sanctuary nestled beside a natural stream in Dong Gia Nghia, Lam Dong. Wood-roasted coffee, fresh herbal teas, and tranquil rainforest canopy.',
    },
  });
  console.log('✓ StoreSettings updated:', updatedSettings.address, '|', updatedSettings.addressEn);

  // 2. Update SiteContent
  const updatedContent = await prisma.siteContent.update({
    where: { id: 'default' },
    data: {
      heroSubtitle: 'Bên Dòng Suối Mát • Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng',
      heroSubtitleEn: 'Beside Fresh Mountain Stream • Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong',
      heroTagline: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng.',
      heroTaglineEn: 'Eco-coffee sanctuary beside a natural stream — Fresh, serene, and harmonized with rainforest nature in the heart of Dong Gia Nghia, Lam Dong.',
      philosophyLead: 'Giữa lòng Đông Gia Nghĩa, Lâm Đồng, Cẩm Cù House ẩn mình dưới con dốc rợp bóng cây tại Hẻm 437 Hùng Vương, nép mình bên dòng suối nhỏ chảy róc rách bốn mùa.',
      philosophyLeadEn: 'In the heart of Dong Gia Nghia, Lam Dong, Cẩm Cù House is nestled down a tree-shaded slope at Alley 437 Hung Vuong, sitting peacefully along a gentle natural stream flowing year-round.',
      brandStoryContent: 'Đông Gia Nghĩa, Lâm Đồng không chỉ có thiên nhiên xanh mát mà còn có những thung lũng xanh tĩnh lặng ẩn mình. Cẩm Cù House được sinh ra từ chính niềm say mê thiên nhiên và khát khao gìn giữ một khoảng trời xanh trong lành giữa lòng Đông Gia Nghĩa. Từng giàn lan Cẩm Cù bung nở những chùm hoa hình ngôi sao sáp dịu dàng soi bóng xuống dòng nước suối trong veo.',
      brandStoryContentEn: 'Dong Gia Nghia, Lam Dong is blessed with pristine waterfalls and serene green valleys. Cẩm Cù House was born from our profound love for nature and a dream to preserve an untamed green haven in Dong Gia Nghia. Star-shaped porcelain wax flowers bloom gracefully over the crystal-clear streams.',
      visionDesc: 'Trở thành điểm hẹn sinh thái biểu trưng của Đông Gia Nghĩa, Lâm Đồng — nơi gìn giữ vẻ đẹp nguyên bản của dòng suối rừng và tôn vinh nông sản thảo mộc tự nhiên.',
      visionDescEn: 'To be the premier ecological destination of Dong Gia Nghia, Lam Dong — preserving the pristine beauty of natural forest streams and celebrating wholesome organic botanicals.',
    },
  });
  console.log('✓ SiteContent updated:', updatedContent.heroSubtitle);

  // 3. Update PageSeo Records
  const seoUpdates = [
    {
      route: '/',
      metaTitleVi: 'Cẩm Cù House — Cà Phê Sinh Thái Bên Bờ Suối Đông Gia Nghĩa, Lâm Đồng',
      metaTitleEn: 'Cẩm Cù House — Streamside Ecological Cafe in Dong Gia Nghia, Lam Dong',
      metaDescVi: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, 18 bàn view suối mát rượi tại Đông Gia Nghĩa, Lâm Đồng. Cà phê muối rang mộc bazan và thức uống thảo mộc.',
      metaDescEn: 'Streamside ecological cafe in Dong Gia Nghia, Lam Dong. 18 natural stream tables, wood-roasted basalt coffee, and fresh organic herbal tonics.',
      h1Vi: 'CẨM CÙ HOUSE — Cà Phê Sinh Thái Bên Bờ Suối Đông Gia Nghĩa, Lâm Đồng',
    },
    {
      route: '/gioi-thieu',
      metaDescVi: 'Hành trình khởi sinh dưới vòm hoa Cẩm Cù, đội ngũ tâm huyết và triết lý Xanh - Lành - Thuần khiết của Cẩm Cù House tại Đông Gia Nghĩa, Lâm Đồng.',
    },
    {
      route: '/khong-gian',
      metaTitleVi: 'Không Gian Quán Bên Bờ Suối — 31 Bản Khắc Thị Giác Cẩm Cù House',
      metaDescVi: 'Khám phá 31 góc ảnh không gian sinh thái bên suối mát tại Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng. Bàn ngắm suối tự nhiên, vòm hoa cẩm cù và acoustic cuối tuần.',
      metaDescEn: 'Explore 31 visual frames of Cẩm Cù House eco-coffee sanctuary in Dong Gia Nghia, Lam Dong. Streamside seats, natural boulders, and wax flower gardens.',
    },
    {
      route: '/khach-hang',
      metaDescVi: 'Dấu ấn nhịp sống bên suối, những cột mốc đáng nhớ và cảm nhận chân thực từ thực khách ghé thăm Cẩm Cù House Đông Gia Nghĩa, Lâm Đồng.',
    },
    {
      route: '/lien-he',
      metaTitleVi: 'Liên Hệ & Chỉ Đường — Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng',
      metaTitleEn: 'Contact & Directions — Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong',
      metaDescVi: 'Địa chỉ Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng; hotline 0382 851 688, giờ mở cửa GMT+7 và bản đồ Google Maps chỉ đường đến tận cổng Cẩm Cù House.',
      metaDescEn: 'Address at Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong; hotlines, GMT+7 hours, and Google Maps directions straight to Cẩm Cù House gate.',
    },
  ];

  for (const item of seoUpdates) {
    const { route, ...data } = item;
    await prisma.pageSeo.updateMany({
      where: { route },
      data,
    });
  }
  console.log('✓ PageSeo updated for core routes');

  // 4. Update Static Legal Pages
  await prisma.staticPage.updateMany({
    where: { slug: 'chinh-sach-bao-mat' },
    data: {
      metaDescription: 'Cam kết bảo mật thông tin khách hàng tuyệt đối tại Cẩm Cù House Đông Gia Nghĩa, Lâm Đồng.',
    },
  });

  await prisma.staticPage.updateMany({
    where: { slug: 'dieu-khoan-su-dung' },
    data: {
      content: `### 1. Giới thiệu chung\nWebsite camcuhouse.vn là trang thông tin chính thức của Cẩm Cù House — Cà phê sinh thái bên bờ suối Đông Gia Nghĩa, Lâm Đồng. Mọi nội dung, hình ảnh thực đơn và bài viết đều thuộc quyền sở hữu của Cẩm Cù House.\n\n### 2. Quyền sở hữu trí tuệ\nMọi hình ảnh 31 góc không gian (FIG. 01 – FIG. 31), hình ảnh hoa Cẩm Cù và tư liệu sự kiện không được sao chép cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản của chúng tôi.\n\n### 3. Giá cả & Thực đơn\nBảng giá và danh mục thực đơn được cập nhật trực tiếp theo thời gian thực từ hệ thống quản lý quán. Giá hiển thị bằng Việt Nam Đồng (VND) đã bao gồm thuế và không có bất kỳ phí ẩn nào.`,
      contentEn: `### 1. General Terms\nOfficial website of Cam Cu House ecological cafe in Dong Gia Nghia, Lam Dong. All media and text are protected.\n\n### 2. Intellectual Property\n31 Spatial plates (FIG. 01 - 31) and branding media cannot be duplicated for commercial intent without prior consent.\n\n### 3. Pricing Transparency\nTransparent VND prices directly synchronized from our live headless CMS without hidden surcharges.`,
    },
  });

  await prisma.staticPage.updateMany({
    where: { slug: 'noi-quy-khong-gian' },
    data: {
      metaDescription: 'Nội quy giữ gìn vệ sinh sinh thái và an toàn bên bờ suối tại Cẩm Cù House Đông Gia Nghĩa, Lâm Đồng.',
    },
  });
  console.log('✓ Static legal pages updated');

  // 5. Update Spatial Figures locations
  await prisma.spatialFigure.updateMany({
    where: { id: 'FIG. 01' },
    data: {
      locationVi: 'Cổng vào Cẩm Cù House, Đông Gia Nghĩa',
    },
  });
  await prisma.spatialFigure.updateMany({
    where: { id: 'FIG. 31' },
    data: {
      locationVi: 'Bờ suối Cẩm Cù House, Đông Gia Nghĩa',
      locationEn: 'Streamside at Cẩm Cù House, Dong Gia Nghia',
    },
  });
  console.log('✓ SpatialFigure location strings updated');

  // 6. Record SystemLog
  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      category: 'CMS',
      action: 'UPDATE_OFFICIAL_ADDRESS',
      details: 'Cập nhật địa chỉ hành chính chính thức sang Đông Gia Nghĩa, Lâm Đồng theo xác thực Google Maps.',
      adminUsername: 'admin',
    },
  });
  console.log('✓ SystemLog recorded');

  console.log('🎉 Live SQLite database address update completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error updating live database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


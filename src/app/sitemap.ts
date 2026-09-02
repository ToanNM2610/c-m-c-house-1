import { MetadataRoute } from 'next';
import { promises as fs } from "fs";
import path from "path";

const BASE_URL = 'https://camcuhouse.vercel.app';

interface Post {
  id: string;
  date: string;
  status: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/menu`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/space`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const filePath = path.join(process.cwd(), "src/data/posts.json");
    const data = await fs.readFile(filePath, "utf8");
    const posts: Post[] = JSON.parse(data);

    const publishPosts = posts.filter(p => !p.status || p.status === 'publish');

    publishPosts.forEach(post => {
      sitemapEntries.push({
        url: `${BASE_URL}/posts/${post.id}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Lỗi tạo sitemap cho posts:", error);
  }

  return sitemapEntries;
}

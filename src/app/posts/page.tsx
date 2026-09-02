import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Metadata } from "next";
import PostsClient from "./PostsClient";

export const metadata: Metadata = {
  title: "Chuyện Nhà | Cẩm Cù House",
  description: "Góc nhỏ kể những câu chuyện bình yên bên bờ suối.",
};

interface Post {
  id: string;
  title: string;
  titleEn?: string;
  coverImage: string;
  date: string;
  summary: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  category?: string;
  categoryEn?: string;
  status?: string;
  author?: string;
}

async function getPosts(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), "src/data/posts.json");
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Lỗi đọc posts.json:", error);
    return [];
  }
}

export default async function PostsPage() {
  const allPosts = await getPosts();
  const posts = allPosts.filter(p => p.status === undefined || p.status === 'publish');

  return (
    <PostsClient posts={posts} />
  );
}

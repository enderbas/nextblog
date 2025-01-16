import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  title: string;
  date: string;
  contentHtml?: string;
  excerpt?: string;
  tags?: string[];
}

export interface BlogStats {
  totalPosts: number;
  tagDistribution: Map<string, number>;
  popularTags: string[];
}

export interface ArchiveData {
  [year: string]: {
    [month: string]: PostData[];
  };
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
}

function formatTags(tags: string | string[] | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return tags
    .split(/[,\s]+/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

export async function getSortedPostsData(): Promise<PostData[]> {
  // Get file names under /posts
  const fileNames = await fs.readdir(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName: string) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Format the date
      const date = formatDate(matterResult.data.date);

      // Get tags from frontmatter and format them
      const tags = formatTags(matterResult.data.tags);

      // Get preview from content
      const excerpt = matterResult.content
        .trim()
        .split('\n')[0]
        .toLowerCase();

      // Get title from frontmatter
      const title = matterResult.data.title || '';

      // Combine the data with the id
      return {
        id,
        date,
        tags,
        title,
        excerpt,
      };
    })
  );

  // Sort posts by date
  return allPostsData.sort((a: PostData, b: PostData) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getAllPostIds() {
  const fileNames = await fs.readdir(postsDirectory);
  return fileNames.map((fileName) => ({
    id: fileName.replace(/\.md$/, ''),
  }));
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = await fs.readFile(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Format the date
  const date = formatDate(matterResult.data.date);

  // Get tags from frontmatter and format them
  const tags = formatTags(matterResult.data.tags);

  // Get preview from content
  const excerpt = matterResult.content
    .trim()
    .split('\n')[0]
    .toLowerCase();

  // Get title from frontmatter
  const title = matterResult.data.title || '';

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    date,
    tags,
    title,
    excerpt,
    contentHtml,
  };
}

export async function getBlogStats(): Promise<BlogStats> {
  const posts = await getSortedPostsData();
  const tagDistribution = new Map<string, number>();

  // Tag dağılımını hesapla
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      tagDistribution.set(tag, (tagDistribution.get(tag) || 0) + 1);
    });
  });

  // En popüler tag'leri bul (en çok kullanılan 5 tag)
  const popularTags = Array.from(tagDistribution.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    totalPosts: posts.length,
    tagDistribution,
    popularTags,
  };
}

export async function getRelatedPosts(currentPostId: string, tags: string[]): Promise<PostData[]> {
  if (!tags || tags.length === 0) return [];

  const allPosts = await getSortedPostsData();
  
  // İlgili yazıları puanla
  const scoredPosts = allPosts
    .filter(post => post.id !== currentPostId) // Mevcut yazıyı hariç tut
    .map(post => {
      const commonTags = post.tags?.filter(tag => tags.includes(tag)) || [];
      return {
        post,
        score: commonTags.length,
      };
    })
    .filter(({ score }) => score > 0) // En az bir ortak tag'i olan yazıları al
    .sort((a, b) => b.score - a.score); // Puana göre sırala

  // En alakalı 3 yazıyı döndür
  return scoredPosts.slice(0, 3).map(({ post }) => post);
}

export async function getArchiveData(): Promise<ArchiveData> {
  const posts = await getSortedPostsData();
  const archive: ArchiveData = {};

  posts.forEach(post => {
    const [year, month] = post.date.split('-');
    
    if (!archive[year]) {
      archive[year] = {};
    }
    
    if (!archive[year][month]) {
      archive[year][month] = [];
    }

    archive[year][month].push(post);
  });

  return archive;
} 
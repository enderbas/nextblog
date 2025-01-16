import { getSortedPostsData, getBlogStats } from '../lib/posts';
import BlogList from '../components/BlogList';

export default async function Home() {
  const posts = await getSortedPostsData();
  const stats = await getBlogStats();
  
  // Map'i diziye dönüştür
  const tagDistribution = Array.from(stats.tagDistribution.entries());

  return (
    <BlogList 
      initialPosts={posts} 
      stats={{
        totalPosts: stats.totalPosts,
        tagDistribution,
        popularTags: stats.popularTags,
      }}
    />
  );
}

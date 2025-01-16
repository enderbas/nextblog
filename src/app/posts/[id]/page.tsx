import { getAllPostIds, getPostData, getRelatedPosts } from '../../../lib/posts';
import BlogPost from '../../../components/BlogPost';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Record<string, string>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id.toString();
  const postData = await getPostData(id);
  return {
    title: postData.title,
    description: postData.excerpt,
  };
}

export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths.map((path) => ({
    id: path.id,
  }));
}

export default async function Post({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id.toString();
  const postData = await getPostData(id);
  
  // İlgili yazıları al
  const relatedPosts = await getRelatedPosts(id, postData.tags || []);

  return (
    <BlogPost 
      post={postData} 
      relatedPosts={relatedPosts}
    />
  );
} 
import { getArchiveData } from '../../lib/posts';
import ArchiveList from '../../components/ArchiveList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Arşivi',
  description: 'Tüm blog yazılarının yıl ve ay bazında arşivi',
};

export default async function ArchivePage() {
  const archiveData = await getArchiveData();
  return <ArchiveList archiveData={archiveData} />;
} 
import { notFound } from 'next/navigation';
import { getPostsByTag, getTag } from '@/app/actions/actions';

const page = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  const tag = await getTag(id);
  if (!tag) {
    return notFound();
  }
  const posts = await getPostsByTag(id);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Tag: {tag.title}</h1>
      {posts &&
        posts.map(post => (
          <div key={post.id} className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
    </div>
  );
};

export default page;

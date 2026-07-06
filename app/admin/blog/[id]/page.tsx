import { getBlogPost } from '@/lib/data';
import { notFound } from 'next/navigation';
import BlogForm from '@/components/BlogForm';
import { updatePost } from './actions';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <div className="topbar-admin">
        <h2>Edit Post</h2>
        <a href="/admin/blog" className="btn btn-sm btn-secondary">← Back</a>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <BlogForm
              postId={post.id}
              defaultTitle={post.title}
              defaultDescription={post.description}
              defaultContent={post.content}
              defaultCategory={post.category}
              defaultTags={post.tags.join(', ')}
              defaultPublished={post.published}
              slug={post.slug}
              date={post.date}
              formAction={updatePost}
            />
          </div>
        </div>
      </div>
    </>
  );
}

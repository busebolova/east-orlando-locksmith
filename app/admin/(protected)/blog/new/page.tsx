import BlogForm from '@/components/BlogForm';
import { createPost } from '../actions';

export default function NewBlogPostPage() {
  return (
    <>
      <div className="topbar-admin">
        <h2>New Blog Post</h2>
        <a href="/admin/blog" className="btn btn-sm btn-secondary">← Back</a>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <BlogForm formAction={createPost} />
          </div>
        </div>
      </div>
    </>
  );
}

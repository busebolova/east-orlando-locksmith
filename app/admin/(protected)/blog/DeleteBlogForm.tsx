'use client';

import { useRef } from 'react';

interface Props {
  postId: string;
  formAction: (formData: FormData) => void;
}

export default function DeleteBlogForm({ postId, formAction }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} onSubmit={() => {
      if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
        formRef.current?.addEventListener('submit', (e) => e.preventDefault(), { once: true });
      }
    }}>
      <input type="hidden" name="slug" value={postId} />
      <button type="submit" className="btn btn-sm btn-danger">Delete</button>
    </form>
  );
}

import { Heart, Image, MessageCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { addComment, createPost, deletePost, listenComments, listenPosts, toggleLike } from '../services/social.js';
import { formatDate } from '../utils/format.js';

function CommentList({ post, profile }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => listenComments(post.id, setComments), [post.id]);

  async function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    await addComment(post, profile, text.trim());
    setText('');
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-md bg-surface p-3 text-sm">
            <p className="font-bold">{comment.authorName}</p>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={submit}>
        <input className="field" value={text} onChange={(event) => setText(event.target.value)} placeholder="Comentar" />
        <button className="btn-secondary"><MessageCircle size={16} /></button>
      </form>
    </div>
  );
}

export default function Feed() {
  const { profile, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => listenPosts(setPosts), []);

  async function submit(event) {
    event.preventDefault();
    if (!text.trim() && !imageFile) return;
    setSaving(true);
    try {
      await createPost({ user: profile, text, imageFile });
      setText('');
      setImageFile(null);
      event.currentTarget.reset();
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page space-y-6">
      <div>
        <h1 className="text-2xl font-black">Feed social</h1>
        <p className="text-sm text-slate-600">Publicaciones, imágenes, likes y comentarios en tiempo real.</p>
      </div>
      <form className="panel space-y-3" onSubmit={submit}>
        <textarea className="field min-h-24" value={text} onChange={(event) => setText(event.target.value)} placeholder="Compartí una actualización profesional" />
        <label className="btn-secondary w-fit cursor-pointer">
          <Image size={16} />
          Imagen
          <input className="hidden" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
        </label>
        <button className="btn-primary" disabled={saving}>{saving ? 'Publicando...' : 'Publicar'}</button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="panel">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{post.authorName}</p>
                <p className="text-xs text-slate-500">{formatDate(post.createdAt)}</p>
              </div>
              {(post.authorId === profile.id || isAdmin) && (
                <button className="btn-secondary" onClick={() => deletePost(post.id)} aria-label="Eliminar publicación">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            {post.text && <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{post.text}</p>}
            {post.imageUrl && <img className="mt-4 max-h-[520px] w-full rounded-md object-cover" src={post.imageUrl} alt="Publicación" />}
            <div className="mt-4 flex gap-2">
              <button className="btn-secondary" onClick={() => toggleLike(post, profile)}>
                <Heart size={16} /> {post.likeCount || 0}
              </button>
              <span className="btn-secondary cursor-default">
                <MessageCircle size={16} /> {post.commentCount || 0}
              </span>
            </div>
            <CommentList post={post} profile={profile} />
          </article>
        ))}
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Idea } from '../types';
import { Plus, Trash2, Edit2, Archive, ArchiveRestore, Tag } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';

interface IdeasProps {
  ideas: Idea[];
  setIdeas: (ideas: Idea[] | ((prev: Idea[]) => Idea[])) => void;
}

export default function Ideas({ ideas, setIdeas }: IdeasProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });

  const displayedIdeas = ideas.filter(i => showArchived ? i.isArchived : !i.isArchived);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    
    if (editingId) {
      setIdeas((prev: Idea[]) => prev.map(i => i.id === editingId ? { ...i, ...form } : i));
      setEditingId(null);
    } else {
      const newIdea: Idea = {
        id: uuidv4(),
        ...form,
        isArchived: false,
        createdAt: new Date().toISOString(),
      };
      setIdeas((prev: Idea[]) => [newIdea, ...prev]);
    }
    setForm({ title: '', content: '', tags: [] });
    setShowForm(false);
  };

  const handleEdit = (idea: Idea) => {
    setForm({
      title: idea.title,
      content: idea.content,
      tags: idea.tags,
    });
    setEditingId(idea.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setIdeas((prev: Idea[]) => prev.filter(i => i.id !== id));
  };

  const toggleArchive = (id: string) => {
    setIdeas((prev: Idea[]) => prev.map(i => i.id === id ? { ...i, isArchived: !i.isArchived } : i));
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ideas</h1>
          <p className="text-slate-400 mt-1">Capture your sudden ideas and inspirations</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', content: '', tags: [] }); }}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Capture Idea</span>
        </button>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowArchived(false)}
          className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
            !showArchived ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Active ({ideas.filter(i => !i.isArchived).length})
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
            showArchived ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Archived ({ideas.filter(i => i.isArchived).length})
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingId ? 'Edit Idea' : '💡 New Idea'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                  placeholder="Quick title..."
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                  rows={4}
                  placeholder="Describe your idea..."
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Tags</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-slate-500 hover:text-white">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedIdeas.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-slate-500">{showArchived ? 'No archived ideas.' : 'No ideas yet. Capture your first idea!'}</p>
          </div>
        ) : (
          displayedIdeas.map(idea => (
            <div key={idea.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all">
              <div className="flex items-start justify-between">
                <h3 className="text-white font-medium flex-1">{idea.title}</h3>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => toggleArchive(idea.id)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    title={idea.isArchived ? 'Restore' : 'Archive'}
                  >
                    {idea.isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                  </button>
                  <button
                    onClick={() => handleEdit(idea)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2 whitespace-pre-wrap">{idea.content}</p>
              {idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {idea.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-slate-600 text-xs mt-3">
                {format(parseISO(idea.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

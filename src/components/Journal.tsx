import { useState } from 'react';
import { JournalEntry } from '../types';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';

interface JournalProps {
  journals: JournalEntry[];
  setJournals: (journals: JournalEntry[] | ((prev: JournalEntry[]) => JournalEntry[])) => void;
}

const moods = [
  { value: 'great' as const, emoji: '😄', label: 'Great' },
  { value: 'good' as const, emoji: '😊', label: 'Good' },
  { value: 'neutral' as const, emoji: '😐', label: 'Neutral' },
  { value: 'bad' as const, emoji: '😔', label: 'Bad' },
  { value: 'terrible' as const, emoji: '😢', label: 'Terrible' },
];

export default function Journal({ journals, setJournals }: JournalProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    mood: 'good' as JournalEntry['mood'],
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    
    if (editingId) {
      setJournals((prev: JournalEntry[]) => prev.map(j => j.id === editingId ? { ...j, ...form } : j));
      setEditingId(null);
    } else {
      const newEntry: JournalEntry = {
        id: uuidv4(),
        ...form,
        createdAt: new Date().toISOString(),
      };
      setJournals((prev: JournalEntry[]) => [newEntry, ...prev]);
    }
    setForm({ title: '', content: '', mood: 'good', date: format(new Date(), 'yyyy-MM-dd') });
    setShowForm(false);
  };

  const handleEdit = (entry: JournalEntry) => {
    setForm({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      date: entry.date,
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setJournals((prev: JournalEntry[]) => prev.filter(j => j.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Journal</h1>
          <p className="text-slate-400 mt-1">Capture your thoughts and reflect on your day</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', content: '', mood: 'good', date: format(new Date(), 'yyyy-MM-dd') }); }}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingId ? 'Edit Entry' : 'New Journal Entry'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-400">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Mood</label>
                  <div className="flex gap-1 mt-1">
                    {moods.map(mood => (
                      <button
                        key={mood.value}
                        onClick={() => setForm({ ...form, mood: mood.value })}
                        className={`flex-1 text-center py-1.5 rounded-lg text-lg transition-all ${
                          form.mood === mood.value ? 'bg-violet-600/30 ring-1 ring-violet-500' : 'hover:bg-slate-700'
                        }`}
                        title={mood.label}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                  placeholder="What's on your mind..."
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                  rows={6}
                  placeholder="Write your thoughts here..."
                />
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

      {/* Journal Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {journals.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-slate-500">No journal entries yet. Start writing!</p>
          </div>
        ) : (
          journals.map(entry => (
            <div key={entry.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {moods.find(m => m.value === entry.mood)?.emoji}
                  </span>
                  <div>
                    <h3 className="text-white font-medium">{entry.title}</h3>
                    <p className="text-slate-500 text-xs">{format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-3 whitespace-pre-wrap leading-relaxed">
                {entry.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

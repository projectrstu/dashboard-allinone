import { useState } from 'react';
import { Plan, Category, Milestone } from '../types';
import { Plus, Trash2, Edit2, Check, Circle, Target } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';

interface PlansProps {
  plans: Plan[];
  setPlans: (plans: Plan[] | ((prev: Plan[]) => Plan[])) => void;
}

export default function Plans({ plans, setPlans }: PlansProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [milestoneInput, setMilestoneInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'project' as Category,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    milestones: [] as Milestone[],
  });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    
    if (editingId) {
      setPlans((prev: Plan[]) => prev.map(p => p.id === editingId ? { ...p, ...form } : p));
      setEditingId(null);
    } else {
      const newPlan: Plan = {
        id: uuidv4(),
        ...form,
        createdAt: new Date().toISOString(),
      };
      setPlans((prev: Plan[]) => [newPlan, ...prev]);
    }
    setForm({ title: '', description: '', category: 'project', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: '', milestones: [] });
    setShowForm(false);
  };

  const handleEdit = (plan: Plan) => {
    setForm({
      title: plan.title,
      description: plan.description,
      category: plan.category,
      startDate: plan.startDate,
      endDate: plan.endDate || '',
      milestones: [...plan.milestones],
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPlans((prev: Plan[]) => prev.filter(p => p.id !== id));
  };

  const toggleMilestone = (planId: string, milestoneId: string) => {
    setPlans((prev: Plan[]) => prev.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        milestones: p.milestones.map(m => m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m),
      };
    }));
  };

  const addMilestone = () => {
    if (milestoneInput.trim()) {
      setForm({
        ...form,
        milestones: [...form.milestones, { id: uuidv4(), title: milestoneInput.trim(), isCompleted: false }],
      });
      setMilestoneInput('');
    }
  };

  const removeMilestone = (id: string) => {
    setForm({ ...form, milestones: form.milestones.filter(m => m.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Plans</h1>
          <p className="text-slate-400 mt-1">Track your goals and milestones</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', description: '', category: 'project', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: '', milestones: [] }); }}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>New Plan</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700 my-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingId ? 'Edit Plan' : 'New Plan'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                  placeholder="Plan title..."
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                  rows={3}
                  placeholder="What's this plan about..."
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-slate-400">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                    className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Milestones</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={milestoneInput}
                    onChange={(e) => setMilestoneInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                    placeholder="Add milestone..."
                  />
                  <button
                    onClick={addMilestone}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.milestones.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {form.milestones.map((m, i) => (
                      <div key={m.id} className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2">
                        <span className="text-slate-500 text-xs w-5">{i + 1}.</span>
                        <span className="text-slate-300 text-sm flex-1">{m.title}</span>
                        <button
                          onClick={() => removeMilestone(m.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
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
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans List */}
      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No plans yet. Create your first plan!</p>
          </div>
        ) : (
          plans.map(plan => {
            const completed = plan.milestones.filter(m => m.isCompleted).length;
            const total = plan.milestones.length;
            const progress = total > 0 ? (completed / total) * 100 : 0;

            return (
              <div key={plan.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        plan.category === 'work' ? 'bg-blue-500/20 text-blue-300' :
                        plan.category === 'personal' ? 'bg-green-500/20 text-green-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {plan.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>Start: {format(parseISO(plan.startDate), 'MMM d, yyyy')}</span>
                      {plan.endDate && <span>End: {format(parseISO(plan.endDate), 'MMM d, yyyy')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                {total > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-slate-300">{completed}/{total} milestones ({Math.round(progress)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {plan.milestones.length > 0 && (
                  <div className="mt-4 space-y-1.5">
                    {plan.milestones.map(milestone => (
                      <button
                        key={milestone.id}
                        onClick={() => toggleMilestone(plan.id, milestone.id)}
                        className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        {milestone.isCompleted ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Circle size={16} className="text-slate-500" />
                        )}
                        <span className={`text-sm ${milestone.isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                          {milestone.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

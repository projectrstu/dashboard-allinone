import { Task, CalendarEvent, JournalEntry, Idea, Plan } from '../types';
import { CheckSquare, Calendar, BookOpen, Lightbulb, Target, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

interface DashboardProps {
  tasks: Task[];
  events: CalendarEvent[];
  journals: JournalEntry[];
  ideas: Idea[];
  plans: Plan[];
}

export default function Dashboard({ tasks, events, journals, ideas, plans }: DashboardProps) {
  const todayTasks = tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate)));
  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  const recentIdeas = ideas.filter(i => !i.isArchived).slice(0, 3);
  const activePlans = plans.slice(0, 3);

  const stats = [
    { label: 'Pending Tasks', value: pendingTasks.length, icon: <CheckSquare size={24} />, color: 'from-blue-500 to-blue-600' },
    { label: 'Today\'s Tasks', value: todayTasks.length, icon: <Clock size={24} />, color: 'from-amber-500 to-amber-600' },
    { label: 'Upcoming Events', value: upcomingEvents.length, icon: <Calendar size={24} />, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Active Ideas', value: ideas.filter(i => !i.isArchived).length, icon: <Lightbulb size={24} />, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} 👋
        </h1>
        <p className="text-slate-400 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Today's Tasks</h2>
          </div>
          {todayTasks.length === 0 ? (
            <p className="text-slate-500 text-sm">No tasks due today. Enjoy your day!</p>
          ) : (
            <div className="space-y-2">
              {todayTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                  }`} />
                  <span className="text-slate-200 text-sm flex-1">{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.category === 'work' ? 'bg-blue-500/20 text-blue-300' :
                    task.category === 'personal' ? 'bg-green-500/20 text-green-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Upcoming Events</h2>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-slate-500 text-sm">No upcoming events.</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-center min-w-[40px]">
                    <p className="text-xs text-slate-400">{format(parseISO(event.date), 'MMM')}</p>
                    <p className="text-lg font-bold text-white">{format(parseISO(event.date), 'd')}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 text-sm">{event.title}</p>
                    {event.time && <p className="text-slate-500 text-xs">{event.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Ideas */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Recent Ideas</h2>
          </div>
          {recentIdeas.length === 0 ? (
            <p className="text-slate-500 text-sm">No ideas captured yet.</p>
          ) : (
            <div className="space-y-2">
              {recentIdeas.map(idea => (
                <div key={idea.id} className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-200 text-sm font-medium">{idea.title}</p>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">{idea.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Plans */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Active Plans</h2>
          </div>
          {activePlans.length === 0 ? (
            <p className="text-slate-500 text-sm">No active plans.</p>
          ) : (
            <div className="space-y-2">
              {activePlans.map(plan => {
                const completed = plan.milestones.filter(m => m.isCompleted).length;
                const total = plan.milestones.length;
                const progress = total > 0 ? (completed / total) * 100 : 0;
                return (
                  <div key={plan.id} className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-200 text-sm font-medium">{plan.title}</p>
                      <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Journal Preview */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-rose-400" />
          <h2 className="text-lg font-semibold text-white">Recent Journal</h2>
        </div>
        {journals.length === 0 ? (
          <p className="text-slate-500 text-sm">No journal entries yet. Start writing your thoughts!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {journals.slice(0, 3).map(entry => (
              <div key={entry.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{format(parseISO(entry.date), 'MMM d, yyyy')}</span>
                  <span className="text-lg">
                    {entry.mood === 'great' ? '😄' : entry.mood === 'good' ? '😊' : entry.mood === 'neutral' ? '😐' : entry.mood === 'bad' ? '😔' : '😢'}
                  </span>
                </div>
                <p className="text-slate-200 text-sm font-medium">{entry.title}</p>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

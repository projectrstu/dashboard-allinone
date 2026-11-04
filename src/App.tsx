import { useState } from 'react';
import { Page, Task, CalendarEvent, JournalEntry, Idea, Plan } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import CalendarView from './components/CalendarView';
import Journal from './components/Journal';
import Ideas from './components/Ideas';
import Plans from './components/Plans';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [tasks, setTasks] = useLocalStorage<Task[]>('lifeos-tasks', []);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('lifeos-events', []);
  const [journals, setJournals] = useLocalStorage<JournalEntry[]>('lifeos-journals', []);
  const [ideas, setIdeas] = useLocalStorage<Idea[]>('lifeos-ideas', []);
  const [plans, setPlans] = useLocalStorage<Plan[]>('lifeos-plans', []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard tasks={tasks} events={events} journals={journals} ideas={ideas} plans={plans} />;
      case 'tasks':
        return <Tasks tasks={tasks} setTasks={setTasks} />;
      case 'calendar':
        return <CalendarView events={events} setEvents={setEvents} />;
      case 'journal':
        return <Journal journals={journals} setJournals={setJournals} />;
      case 'ideas':
        return <Ideas ideas={ideas} setIdeas={setIdeas} />;
      case 'plans':
        return <Plans plans={plans} setPlans={setPlans} />;
      default:
        return <Dashboard tasks={tasks} events={events} journals={journals} ideas={ideas} plans={plans} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="lg:ml-64 min-h-screen p-4 lg:p-8 pt-16 lg:pt-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

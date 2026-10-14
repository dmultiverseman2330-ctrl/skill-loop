import React, { useState } from 'react';
import { X, GraduationCap, BookOpen, Clock } from 'lucide-react';
import { SkillCategory, ExperienceLevel, ExchangeFormat } from '../types';

interface AddSkillModalProps {
  type: 'teaching' | 'learning';
  onClose: () => void;
  onAddTeaching: (skill: {
    title: string;
    category: Exclude<SkillCategory, 'All'>;
    level: ExperienceLevel;
    format: ExchangeFormat;
    description: string;
    sessionDuration: string;
  }) => void;
  onAddLearning: (wish: {
    title: string;
    category: Exclude<SkillCategory, 'All'>;
    targetLevel: string;
    notes: string;
  }) => void;
}

const CATEGORIES: Exclude<SkillCategory, 'All'>[] = [
  'Crafts & Arts',
  'Tech & Coding',
  'Culinary & Baking',
  'Music & Audio',
  'Languages',
  'Gardening & DIY',
  'Fitness & Wellness',
  'Business & Writing',
];

export const AddSkillModal: React.FC<AddSkillModalProps> = ({
  type,
  onClose,
  onAddTeaching,
  onAddLearning,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<SkillCategory, 'All'>>('Crafts & Arts');
  const [level, setLevel] = useState<ExperienceLevel>('Beginner Friendly');
  const [format, setFormat] = useState<ExchangeFormat>('Both');
  const [sessionDuration, setSessionDuration] = useState('60 min session');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (type === 'teaching') {
      onAddTeaching({
        title: title.trim(),
        category,
        level,
        format,
        description: description.trim() || 'Excited to share this skill with neighbors!',
        sessionDuration,
      });
    } else {
      onAddLearning({
        title: title.trim(),
        category,
        targetLevel: level,
        notes: notes.trim(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              type === 'teaching' ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'
            }`}>
              {type === 'teaching' ? <GraduationCap className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-lg">
                {type === 'teaching' ? 'Add Skill You Can Teach' : 'Add Skill You Want to Learn'}
              </h3>
              <p className="text-xs text-stone-500">
                {type === 'teaching' 
                  ? 'List a talent or hobby you can share with local neighbors' 
                  : 'Add a topic or skill to your learning wishlist'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
              Skill Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'teaching' ? 'e.g. Sourdough Starter & Artisan Loaves' : 'e.g. Classical Guitar Fingerpicking'}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                {type === 'teaching' ? 'Audience Level' : 'Target Level'}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Beginner Friendly">Beginner Friendly</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced / Expert">Advanced / Expert</option>
              </select>
            </div>
          </div>

          {type === 'teaching' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="In-person">In-person</option>
                    <option value="Online">Online</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Session Duration
                  </label>
                  <input
                    type="text"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    placeholder="e.g. 60 min session"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  What You Will Teach (Description)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what tools/techniques you'll cover, what you supply, and what the student will take away..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Learning Goals & Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What specific projects or concepts do you want help with?"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              Save to Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

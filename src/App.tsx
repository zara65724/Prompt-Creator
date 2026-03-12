/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  BookOpen, 
  Share2, 
  Search, 
  Copy, 
  Check,
  Loader2,
  ArrowRight,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateCreatorPrompts } from './services/geminiService';
import { CreatorPrompts, CategoryKey } from './types';

export default function App() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CreatorPrompts | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('chatGPT');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const data = await generateCreatorPrompts(topic);
      setResults(data);
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    const id = `${activeCategory}-${index}`;
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const categories: { key: CategoryKey; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'chatGPT', label: 'ChatGPT', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-emerald-500' },
    { key: 'midjourney', label: 'Midjourney', icon: <ImageIcon className="w-5 h-5" />, color: 'bg-indigo-500' },
    { key: 'videoContent', label: 'Video Ideas', icon: <Video className="w-5 h-5" />, color: 'bg-rose-500' },
    { key: 'blogPosts', label: 'Blog Posts', icon: <BookOpen className="w-5 h-5" />, color: 'bg-amber-500' },
    { key: 'socialMedia', label: 'Social Media', icon: <Share2 className="w-5 h-5" />, color: 'bg-sky-500' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">CreatorPrompt <span className="text-indigo-600">AI</span></h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-zinc-500">
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-amber-500" /> Instant Ideas</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-emerald-500" /> Multi-Platform</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight"
          >
            Spark Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Viral Idea</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg max-w-2xl mx-auto"
          >
            Enter your niche or topic and get a complete content strategy with AI-powered prompts for every platform.
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Sustainable Fashion, AI in Healthcare, Solo Travel..."
              className="block w-full pl-11 pr-32 py-4 bg-white border border-zinc-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-lg"
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md shadow-indigo-200"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Generate
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Digital Nomad', 'Vegan Recipes', 'Tech Reviews', 'Fitness Tips'].map((tag) => (
              <button
                key={tag}
                onClick={() => setTopic(tag)}
                className="text-xs font-medium px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-full hover:bg-zinc-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Sidebar Navigation */}
              <div className="lg:col-span-4 space-y-2">
                <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm mb-4">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Topic</p>
                  <p className="text-xl font-bold text-indigo-600">🎯 {results.topic}</p>
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all border ${
                      activeCategory === cat.key
                        ? 'bg-white border-indigo-200 shadow-md text-indigo-600'
                        : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${activeCategory === cat.key ? cat.color + ' text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                      {cat.icon}
                    </div>
                    <span className="font-bold">{cat.label}</span>
                    {activeCategory === cat.key && (
                      <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="lg:col-span-8">
                <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
                  <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${categories.find(c => c.key === activeCategory)?.color} text-white`}>
                        {categories.find(c => c.key === activeCategory)?.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{categories.find(c => c.key === activeCategory)?.label}</h3>
                        <p className="text-xs text-zinc-400 font-medium">5 Ready-to-use prompts</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {results[activeCategory].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative p-5 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-indigo-200 hover:bg-white transition-all"
                      >
                        <div className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-400">
                            {idx + 1}
                          </span>
                          <p className="text-zinc-700 leading-relaxed pr-10">{item}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item, idx)}
                          className="absolute top-4 right-4 p-2 rounded-lg bg-white border border-zinc-200 text-zinc-400 hover:text-indigo-600 hover:border-indigo-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          {copiedIndex === `${activeCategory}-${idx}` ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center text-zinc-300 mb-6">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-zinc-400">Ready to create?</h3>
              <p className="text-zinc-400 max-w-xs mx-auto mt-2">
                Enter a topic above to generate your multi-platform content strategy.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-200 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">CreatorPrompt AI</span>
          </div>
          <p className="text-sm text-zinc-400">Powered by Gemini AI • Built for Content Creators</p>
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-indigo-600 transition-colors"><Share2 className="w-5 h-5" /></button>
          </div>
        </div>
      </footer>
    </div>
  );
}

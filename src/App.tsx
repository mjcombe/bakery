import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calculator, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  ChevronRight, 
  Scale, 
  TrendingUp,
  CreditCard,
  Menu,
  X,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// --- Types ---
interface Ingredient {
  id?: number;
  name: string;
  weight: number;
  is_flour: boolean;
  baker_percent?: number;
}

interface Recipe {
  id: number;
  name: string;
  base_batch_weight: number;
  method?: string;
  ingredients: Ingredient[];
  created_at: string;
}

// --- Mock Auth Hook ---
const useAuth = () => {
  const [user, setUser] = useState<{ email: string; plan: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('bakery_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    localStorage.setItem('bakery_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('bakery_user');
    setUser(null);
  };

  return { user, login, logout, loading };
};

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, logout, user }: any) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recipes', label: 'Recipe Library', icon: BookOpen },
    { id: 'calculator', label: 'Quick Scale', icon: Calculator },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (user?.email === 'admin@ssbakery.com') {
    menuItems.push({ id: 'admin', label: 'Admin', icon: Settings });
  }

  return (
    <div className="w-64 bg-white border-right border-zinc-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-bottom border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">SS</div>
          <span className="font-bold text-xl tracking-tight text-zinc-900">SS Bakery</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-emerald-50 text-emerald-700 font-medium' 
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-top border-zinc-100">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

const MarketingPage = ({ onLogin }: { onLogin: () => void }) => {
  const [sampleRecipes, setSampleRecipes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/recipes/public')
      .then(res => res.json())
      .then(data => setSampleRecipes(data));
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">SS</div>
          <span className="font-bold text-xl tracking-tight text-zinc-900">SS Bakery</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <button 
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-emerald-600 transition-colors"
          >
            Demo
          </button>
          <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          <button onClick={onLogin} className="px-5 py-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 max-w-4xl mx-auto leading-[1.1]">
            Scale recipes instantly. <br />
            <span className="text-emerald-600">Bake with precision.</span>
          </h1>
          <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto">
            The professional recipe scaling platform for artisan bakeries. Automatically calculate baker's percentages and batch sizes in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight size={20} />
            </button>
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-full font-semibold text-lg hover:bg-zinc-50 transition-all"
            >
              View Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-zinc-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">Built for real kitchens</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Everything you need to move from complex spreadsheets to a clean, production-ready system.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Auto Percentages', desc: 'Baker\'s percentages calculated automatically based on total flour weight.', icon: Scale },
              { title: 'Batch Scaling', desc: 'Scale by final dough weight or product quantity (e.g., 50 loaves at 800g).', icon: Calculator },
              { title: 'Recipe Library', desc: 'Save, duplicate, and version your recipes for consistent production.', icon: BookOpen },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-200 hover:border-emerald-200 transition-all group">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Recipes */}
      <section id="demo" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">Sample Recipe Library</h2>
            <p className="text-zinc-500">Preview our professional formulas. Sign in to view full baker's percentages and scale for production.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleRecipes.map((recipe) => (
              <button 
                key={recipe.id}
                onClick={onLogin}
                className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 text-left hover:border-emerald-300 transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-zinc-400 mb-6 group-hover:text-emerald-600 transition-all shadow-sm">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{recipe.name}</h3>
                <p className="text-zinc-500 text-sm mb-4">Base: {(recipe.base_batch_weight / 1000).toFixed(2)} kg</p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                  Login to view <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-zinc-900 mb-6">From spreadsheet to production in seconds</h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Input your base recipe', desc: 'Enter your ingredients and weights. We automatically calculate the baker\'s percentages based on your flour weight.' },
                  { step: '02', title: 'Choose your scaling mode', desc: 'Scale by total batch weight or by product quantity (e.g. 24 loaves at 750g each).' },
                  { step: '03', title: 'Get instant production weights', desc: 'Our engine calculates every ingredient weight with precision. Print or export your production sheet.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-emerald-600 font-bold text-xl font-mono">{s.step}</span>
                    <div>
                      <h4 className="text-lg font-bold text-zinc-900 mb-1">{s.title}</h4>
                      <p className="text-zinc-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-100 rounded-3xl aspect-square flex items-center justify-center p-12">
              <div className="bg-white w-full h-full rounded-2xl shadow-2xl border border-zinc-200 p-6 space-y-4 overflow-hidden">
                <div className="h-4 w-1/3 bg-zinc-100 rounded-full" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-full bg-zinc-50 rounded-lg border border-zinc-100 flex items-center px-3 justify-between">
                      <div className="h-2 w-20 bg-zinc-200 rounded-full" />
                      <div className="h-2 w-10 bg-emerald-200 rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-zinc-100 flex justify-between">
                  <div className="h-8 w-24 bg-emerald-600 rounded-lg" />
                  <div className="h-8 w-16 bg-zinc-100 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-500">Choose the plan that fits your bakery's production needs.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-10 rounded-3xl border border-zinc-200 relative overflow-hidden">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-zinc-500 mb-6">For individual bakers</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">£15</span>
                <span className="text-zinc-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-10">
                {['Up to 20 saved recipes', 'Recipe scaling', 'Baker\'s percentages', 'Basic support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-600">
                    <CheckCircle2 size={18} className="text-emerald-600" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={onLogin} className="w-full py-4 rounded-2xl border border-zinc-200 font-semibold hover:bg-zinc-50 transition-all">
                Get Started
              </button>
            </div>
            <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 relative overflow-hidden text-white">
              <div className="absolute top-4 right-4 bg-emerald-600 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">Popular</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-zinc-400 mb-6">For busy production teams</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">£25</span>
                <span className="text-zinc-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-10">
                {['Unlimited recipes', 'Recipe versions', 'Usage history', 'Priority support', 'Export PDF sheets'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 size={18} className="text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={onLogin} className="w-full py-4 rounded-2xl bg-emerald-600 font-semibold hover:bg-emerald-500 transition-all">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-zinc-50 py-32">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'How does the baker\'s percentage calculation work?', a: 'We use the standard professional formula: (Ingredient Weight / Total Flour Weight) * 100. Total flour weight is always treated as 100%.' },
              { q: 'Can I export my scaled recipes?', a: 'Yes, Pro users can export production sheets as PDFs or print them directly from the browser.' },
              { q: 'Is there a limit on how many recipes I can save?', a: 'Starter plans include up to 20 recipes. Pro plans offer unlimited recipe storage and versioning.' },
              { q: 'Can I cancel my subscription anytime?', a: 'Absolutely. You can manage your subscription directly from your account settings and cancel at any time.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-2">{item.q}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-xs">SS</div>
            <span className="font-bold text-lg tracking-tight text-zinc-900">Bakery</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-900">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-900">Terms of Service</a>
            <a href="#" className="hover:text-zinc-900">Contact Support</a>
          </div>
          <p className="text-zinc-400 text-sm">© 2026 SS Bakery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const RecipeScaler = ({ recipe }: { recipe: Recipe }) => {
  const [mode, setMode] = useState<'weight' | 'quantity'>('weight');
  const [targetWeight, setTargetWeight] = useState(recipe.base_batch_weight);
  const [quantity, setQuantity] = useState(10);
  const [unitWeight, setUnitWeight] = useState(800);

  useEffect(() => {
    if (mode === 'quantity') {
      setTargetWeight(quantity * unitWeight);
    }
  }, [quantity, unitWeight, mode]);

  if (!recipe.ingredients) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-zinc-200">
        <p className="text-zinc-500">Loading recipe details...</p>
      </div>
    );
  }

  const totalFlour = recipe.ingredients.filter(i => i.is_flour).reduce((acc, i) => acc + i.weight, 0);
  const scaleFactor = targetWeight / recipe.base_batch_weight;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">{recipe.name}</h2>
          <p className="text-zinc-500">Scaling Engine</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl font-semibold hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            Print Sheet
          </button>
          <div className="flex bg-zinc-100 p-1 rounded-xl">
          <button 
            onClick={() => setMode('weight')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'weight' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
          >
            By Weight
          </button>
          <button 
            onClick={() => setMode('quantity')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'quantity' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
          >
            By Quantity
          </button>
        </div>
      </div>
    </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Target Output</label>
            {mode === 'weight' ? (
              <div className="space-y-4">
                <input 
                  type="number" 
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                  className="w-full text-4xl font-bold border-none focus:ring-0 p-0"
                />
                <p className="text-zinc-400 font-medium">Total grams (g)</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs text-zinc-500 mb-2">Number of items</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full text-2xl font-bold bg-zinc-50 p-3 rounded-2xl border border-zinc-100 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-2">Weight per item (g)</label>
                  <input 
                    type="number" 
                    value={unitWeight}
                    onChange={(e) => setUnitWeight(parseFloat(e.target.value) || 0)}
                    className="w-full text-2xl font-bold bg-zinc-50 p-3 rounded-2xl border border-zinc-100 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-100">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">Production Summary</p>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold">{(targetWeight / 1000).toFixed(2)} kg</p>
                <p className="text-emerald-200 text-sm">Total Batch Weight</p>
              </div>
              <div className="pt-4 border-t border-emerald-500/50">
                <p className="text-xl font-bold">{(scaleFactor * 100).toFixed(0)}%</p>
                <p className="text-emerald-200 text-sm">Scale Factor</p>
              </div>
            </div>
          </div>
        </div>

        {recipe.method && (
          <div className="md:col-span-3">
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Production Method</h3>
              <div className="text-zinc-600 text-sm leading-relaxed whitespace-pre-wrap">
                {recipe.method}
              </div>
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ingredient</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Baker %</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Base (g)</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-900 text-right bg-emerald-50/50">Scaled (g)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {recipe.ingredients.map((ing, idx) => {
                  const bakerPercent = (ing.weight / totalFlour) * 100;
                  const scaledWeight = ing.weight * scaleFactor;
                  return (
                    <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-900">{ing.name}</td>
                      <td className="px-6 py-4 text-right font-mono text-zinc-500">{bakerPercent.toFixed(1)}%</td>
                      <td className="px-6 py-4 text-right font-mono text-zinc-400">{ing.weight.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">
                        {scaledWeight >= 1000 
                          ? `${(scaledWeight / 1000).toFixed(3)} kg` 
                          : `${scaledWeight.toFixed(0)} g`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ recipes, onSelectRecipe }: any) => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Welcome back, Baker</h2>
          <p className="text-zinc-500">Here's what's happening in your kitchen today.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={20} />
          </div>
          <p className="text-3xl font-bold text-zinc-900">{recipes.length}</p>
          <p className="text-zinc-500 text-sm">Saved Recipes</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl font-bold text-zinc-900">12</p>
          <p className="text-zinc-500 text-sm">Scales this week</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <CreditCard size={20} />
          </div>
          <p className="text-xl font-bold text-zinc-900">Starter Plan</p>
          <p className="text-zinc-500 text-sm">£15/month</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-zinc-900">Recent Recipes</h3>
          <button className="text-emerald-600 font-semibold text-sm hover:underline">View All</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.slice(0, 6).map((recipe: Recipe) => (
            <button 
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="bg-white p-6 rounded-3xl border border-zinc-200 text-left hover:border-emerald-300 transition-all group shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                  <BookOpen size={24} />
                </div>
                <ChevronRight size={20} className="text-zinc-300 group-hover:text-emerald-600 transition-all" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-1">{recipe.name}</h4>
              <p className="text-zinc-500 text-sm mb-4">Base: {(recipe.base_batch_weight / 1000).toFixed(2)} kg</p>
              <div className="flex gap-2">
                {recipe.ingredients?.filter(i => i.is_flour).map((i, idx) => (
                  <span key={idx} className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-500 px-2 py-1 rounded-md">
                    {i.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            </button>
          ))}
          {recipes.length === 0 && (
            <div className="col-span-full py-20 text-center bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
              <p className="text-zinc-400 font-medium">Your recipe library is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { user, login, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user]);

  const fetchRecipes = async () => {
    const res = await fetch('/api/recipes');
    const data = await res.json();
    setRecipes(data);
  };

  if (loading) return null;

  if (!user) {
    return <MarketingPage onLogin={() => login('demo@ssbakery.com')} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} user={user} />
      
      <main className="ml-64 p-10 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedRecipe?.id || '')}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {selectedRecipe ? (
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-medium mb-4"
                >
                  <ChevronRight size={20} className="rotate-180" /> Back to Library
                </button>
                <RecipeScaler recipe={selectedRecipe} />
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    recipes={recipes} 
                    onSelectRecipe={setSelectedRecipe}
                  />
                )}
                {activeTab === 'recipes' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold tracking-tight">Recipe Library</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.map(recipe => (
                        <button 
                          key={recipe.id}
                          onClick={() => setSelectedRecipe(recipe)}
                          className="bg-white p-6 rounded-3xl border border-zinc-200 text-left hover:border-emerald-300 transition-all group shadow-sm"
                        >
                          <h4 className="text-lg font-bold text-zinc-900 mb-1">{recipe.name}</h4>
                          <p className="text-zinc-500 text-sm">Base: {(recipe.base_batch_weight / 1000).toFixed(2)} kg</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'calculator' && (
                  <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
                      <Calculator size={40} />
                    </div>
                    <h2 className="text-3xl font-bold">Quick Scaling Tool</h2>
                    <p className="text-zinc-500">Select a recipe from your library to start scaling instantly without modifying the base version.</p>
                    <button 
                      onClick={() => setActiveTab('recipes')}
                      className="px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-all"
                    >
                      Browse Library
                    </button>
                  </div>
                )}
                {activeTab === 'billing' && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm max-w-2xl">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-zinc-500 text-sm mb-1">Current Plan</p>
                          <p className="text-2xl font-bold text-zinc-900">Starter Plan</p>
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold">Active</div>
                      </div>
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Monthly cost</span>
                          <span className="font-bold">£15.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Next renewal</span>
                          <span className="font-bold">April 4, 2026</span>
                        </div>
                      </div>
                      <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-all">
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm max-w-2xl space-y-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Email Address</label>
                        <input type="email" value={user.email} disabled className="w-full bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-zinc-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Bakery Name</label>
                        <input type="text" placeholder="e.g. SS Bakery London" className="w-full bg-white p-3 rounded-xl border border-zinc-200 focus:ring-emerald-500" />
                      </div>
                      <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === 'admin' && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight">Admin Control Panel</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                        <p className="text-zinc-500 text-sm mb-1">Total Users</p>
                        <p className="text-2xl font-bold">1,240</p>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                        <p className="text-zinc-500 text-sm mb-1">Active Subscriptions</p>
                        <p className="text-2xl font-bold text-emerald-600">892</p>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                        <p className="text-zinc-500 text-sm mb-1">Monthly Revenue</p>
                        <p className="text-2xl font-bold">£18,450</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-100">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">User</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Plan</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                          {[
                            { email: 'john@bakery.com', plan: 'Pro', status: 'Active' },
                            { email: 'sarah@pastry.io', plan: 'Starter', status: 'Active' },
                            { email: 'mike@flour.co', plan: 'Starter', status: 'Trial' },
                          ].map((u, i) => (
                            <tr key={i}>
                              <td className="px-6 py-4 font-medium">{u.email}</td>
                              <td className="px-6 py-4">{u.plan}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                  {u.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button className="text-zinc-400 hover:text-zinc-900 font-medium text-sm">Manage</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

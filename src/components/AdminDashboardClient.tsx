'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/seed-data';

export default function AdminDashboardClient({
  initialItems,
  initialSettings,
  initialUsers,
  currentUser,
}: {
  initialItems: any[];
  initialSettings: any;
  initialUsers: any[];
  currentUser: any;
}) {
  const [activeTab, setActiveTab] = useState<'flavors' | 'ordering' | 'staff'>('flavors');
  const [items, setItems] = useState(initialItems);
  const [settings, setSettings] = useState(initialSettings);
  const [users, setUsers] = useState(initialUsers);

  // Flavor Form State (Create or Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [price, setPrice] = useState('6.50');
  const [sizes, setSizes] = useState('24oz, 32oz');
  const [customizationAddons, setCustomizationAddons] = useState('');
  const [orderableOnline, setOrderableOnline] = useState(true);
  const [filterCat, setFilterCat] = useState('All');

  // New Staff Member Form State
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState('STAFF');
  const [statusMsg, setStatusMsg] = useState('');

  const resetFlavorForm = () => {
    setEditingId(null);
    setName('');
    setCategory(CATEGORIES[0]);
    setIngredients('');
    setDescription('');
    setFeatured(false);
    setInStock(true);
    setPrice('6.50');
    setSizes('24oz, 32oz');
    setCustomizationAddons('');
    setOrderableOnline(true);
  };

  const startEditItem = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setIngredients(item.ingredients);
    setDescription(item.description || '');
    setFeatured(Boolean(item.featured));
    setInStock(Boolean(item.inStock));
    setPrice(String(item.price ?? 6.5));
    setSizes(item.sizes || '24oz, 32oz');
    setCustomizationAddons(item.customizationAddons || '');
    setOrderableOnline(Boolean(item.orderableOnline));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveFlavor = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      ingredients,
      description,
      featured,
      inStock,
      price: parseFloat(price) || 6.5,
      sizes,
      customizationAddons,
      orderableOnline,
    };

    if (editingId) {
      const res = await fetch(`/api/menu/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editingId ? updated : i)));
        resetFlavorForm();
        setStatusMsg('Flavor updated successfully!');
      }
    } else {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setItems([created, ...items]);
        resetFlavorForm();
        setStatusMsg('New flavor added to menu!');
      }
    }
  };

  const handleDeleteFlavor = async (id: string) => {
    const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      const updated = await res.json();
      setSettings(updated);
      setStatusMsg('Store & Online Ordering settings saved!');
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: staffName,
        email: staffEmail,
        password: staffPassword,
        role: staffRole,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setUsers([...users, created]);
      setStaffName('');
      setStaffEmail('');
      setStaffPassword('');
      setStatusMsg(`Added ${created.email} to team access!`);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const displayedItems = items.filter(
    (i) => filterCat === 'All' || i.category === filterCat
  );

  return (
    <div className="min-h-screen bg-[#fdf8ff] dark:bg-[#12071f] text-purple-950 dark:text-white p-6 md:p-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full border-2 border-pink-500" />
            <div>
              <h1 className="text-2xl font-extrabold text-purple-950 dark:text-white">Appalachian Nutrition Portal</h1>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Signed in as <strong className="text-lime-700 dark:text-lime-400">{currentUser?.email}</strong> ({currentUser?.role || 'STAFF'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-white hover:bg-purple-50 dark:bg-purple-900/70 dark:hover:bg-purple-800 border border-purple-300 dark:border-purple-700 text-xs font-bold shadow-sm"
            >
              ← View Public Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-lime-100 dark:bg-lime-500/15 border border-lime-400 dark:border-lime-500/40 text-lime-800 dark:text-lime-300 text-xs font-bold flex justify-between items-center">
            <span>✅ {statusMsg}</span>
            <button onClick={() => setStatusMsg('')}>✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveTab('flavors')}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition ${
              activeTab === 'flavors'
                ? 'bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
            }`}
          >
            🥤 Flavors & Online Menu ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('ordering')}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition ${
              activeTab === 'ordering'
                ? 'bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
            }`}
          >
            ⚡ Online Ordering & Store Info
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition ${
              activeTab === 'staff'
                ? 'bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
            }`}
          >
            👥 Team & Multi-User Access ({users.length})
          </button>
        </div>

        {/* TAB 1: FLAVORS & MENU MANAGEMENT */}
        {activeTab === 'flavors' && (
          <div className="grid lg:grid-cols-5 gap-8">
            <form
              onSubmit={handleSaveFlavor}
              className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 shadow-sm space-y-4 h-fit"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-purple-950 dark:text-white">
                  {editingId ? 'Edit Drink / Flavor' : 'Add New Drink / Flavor'}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetFlavorForm}
                    className="text-xs text-pink-600 dark:text-pink-400 hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">Drink Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bora Bora"
                  className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">
                  Flavors / Ingredients *
                </label>
                <textarea
                  rows={2}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. Lime boost, Strawberry, Pineapple, Coconut"
                  className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">
                  Short Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Tropical lime and coconut refresher"
                  className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                />
              </div>

              {/* Online Ordering Preparation Fields */}
              <div className="p-4 rounded-xl bg-lime-50/70 dark:bg-[#12071f]/90 border border-lime-400/60 dark:border-lime-500/30 space-y-3">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-lime-800 dark:text-lime-400">
                  🛒 Online Ordering Settings (Future-Ready)
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-purple-800 dark:text-purple-300 mb-1">Base Price ($)</label>
                    <input
                      type="number"
                      step="0.25"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-white dark:bg-purple-950 border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-purple-800 dark:text-purple-300 mb-1">Available Sizes</label>
                    <input
                      type="text"
                      value={sizes}
                      onChange={(e) => setSizes(e.target.value)}
                      placeholder="24oz, 32oz"
                      className="w-full px-3 py-1.5 rounded bg-white dark:bg-purple-950 border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-purple-800 dark:text-purple-300 mb-1">
                    Custom Add-Ons (Boosters, Cold Foam, Protein)
                  </label>
                  <input
                    type="text"
                    value={customizationAddons}
                    onChange={(e) => setCustomizationAddons(e.target.value)}
                    placeholder="Extra Lift (+$1), Whipped Cream, Aloe Shot"
                    className="w-full px-3 py-1.5 rounded bg-white dark:bg-purple-950 border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                  />
                </div>

                <div className="flex flex-wrap gap-4 pt-1 text-xs text-purple-900 dark:text-purple-200">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    Featured / Popular
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                    />
                    In Stock
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={orderableOnline}
                      onChange={(e) => setOrderableOnline(e.target.checked)}
                    />
                    Eligible for Online Order
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 font-extrabold text-sm shadow-md"
              >
                {editingId ? 'Save Changes to Flavor' : '+ Add Flavor to Menu'}
              </button>
            </form>

            {/* Existing Flavors List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold text-purple-950 dark:text-white">
                  Current Menu Flavors ({displayedItems.length})
                </h2>
                <select
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-purple-950 border border-purple-300 dark:border-purple-700 text-xs text-purple-950 dark:text-white"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {displayedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-100 text-lime-800 dark:bg-purple-900 dark:text-lime-300">
                          {item.category}
                        </span>
                        <h3 className="font-bold text-purple-950 dark:text-white">{item.name}</h3>
                        <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                          ${Number(item.price || 6.5).toFixed(2)}
                        </span>
                        {!item.inStock && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-800 dark:text-purple-200 mt-1">{item.ingredients}</p>
                      {item.customizationAddons && (
                        <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5">
                          Add-ons: {item.customizationAddons}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEditItem(item)}
                        className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 text-xs font-bold text-purple-950 dark:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFlavor(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-500/15 dark:hover:bg-red-500/30 text-xs font-bold text-red-700 dark:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STORE SETTINGS & FUTURE ONLINE ORDERING TOGGLE */}
        {activeTab === 'ordering' && (
          <form
            onSubmit={handleSaveSettings}
            className="max-w-2xl p-6 rounded-2xl bg-white dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 shadow-sm space-y-5"
          >
            <h2 className="text-xl font-extrabold text-purple-950 dark:text-white">
              Online Ordering & Store Information
            </h2>

            <div className="p-4 rounded-xl bg-lime-50 dark:bg-[#12071f] border border-lime-400 dark:border-lime-500/40 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lime-800 dark:text-lime-400 text-sm">
                  Enable Live Online Ordering on Public Site
                </h3>
                <p className="text-xs text-purple-800 dark:text-purple-200 mt-0.5">
                  Keep this OFF while operating as an information-only site. Flip it ON whenever you are ready for customers to add drinks to a pickup order!
                </p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(settings.onlineOrderingEnabled)}
                onChange={(e) =>
                  setSettings({ ...settings, onlineOrderingEnabled: e.target.checked })
                }
                className="w-6 h-6 accent-lime-500 shrink-0"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">
                Business Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">
                Store Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">
                Store Hours
              </label>
              <input
                type="text"
                value={settings.hours}
                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">
                Top Banner Announcement
              </label>
              <input
                type="text"
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 font-extrabold text-sm shadow-md"
            >
              Save Store Settings
            </button>
          </form>
        )}

        {/* TAB 3: MULTI-USER STAFF ACCOUNTS */}
        {activeTab === 'staff' && (
          <div className="grid lg:grid-cols-5 gap-8">
            <form
              onSubmit={handleAddStaff}
              className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 shadow-sm space-y-4 h-fit"
            >
              <h2 className="text-lg font-extrabold text-purple-950 dark:text-white">Add Staff / Manager Account</h2>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Create an email & password login for team members so they can update flavors and manage online ordering items.
              </p>

              <div>
                <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">Name *</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="sarah@appalachiannutrition.com"
                  className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">Password *</label>
                <input
                  type="password"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">Role</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-purple-50/70 dark:bg-[#12071f] border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
                >
                  <option value="STAFF">STAFF (Edit Flavors & Menu)</option>
                  <option value="OWNER">OWNER (Full Access)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 font-extrabold text-sm shadow-md"
              >
                + Create Team Account
              </button>
            </form>

            <div className="lg:col-span-3 space-y-3">
              <h2 className="text-lg font-extrabold text-purple-950 dark:text-white">Authorized Team Accounts ({users.length})</h2>
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-xl bg-white dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-950 dark:text-white">{u.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-100 text-lime-800 dark:bg-purple-900 dark:text-lime-300">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-purple-700 dark:text-purple-300">{u.email}</p>
                  </div>
                  {users.length > 1 && (
                    <button
                      onClick={() => handleDeleteStaff(u.id)}
                      className="px-3 py-1.5 rounded bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300 text-xs font-bold hover:opacity-80"
                    >
                      Remove Access
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

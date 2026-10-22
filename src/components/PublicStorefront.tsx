'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/seed-data';

export default function PublicStorefront({
  initialItems,
  settings,
}: {
  initialItems: any[];
  settings: any;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ item: any; size: string; notes: string }[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState('24oz');
  const [customNotes, setCustomNotes] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const filteredItems = initialItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenOrderModal = (item: any) => {
    const firstSize = (item.sizes || '24oz, 32oz').split(',')[0].trim();
    setSelectedSize(firstSize);
    setCustomNotes('');
    setActiveModalItem(item);
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalItem) return;
    setCart([...cart, { item: activeModalItem, size: selectedSize, notes: customNotes }]);
    setActiveModalItem(null);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50/70 via-[#fdf8ff] to-lime-50/40 dark:from-[#160826] dark:via-[#12071f] dark:to-[#0c0414] text-purple-950 dark:text-white transition-colors duration-200">
      {/* Top Announcement Bar */}
      {settings.announcement && (
        <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-lime-600 text-white text-xs md:text-sm font-semibold py-2 px-4 text-center shadow-sm">
          ✨ {settings.announcement}
        </div>
      )}

      {/* Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-[#160826]/85 border-b border-pink-200/80 dark:border-purple-900/60 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Appalachian Nutrition Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-pink-500 shadow-lg shadow-pink-500/20"
            />
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 via-pink-500 to-lime-600 dark:from-pink-400 dark:via-pink-300 dark:to-lime-400 bg-clip-text text-transparent block leading-none">
                Appalachian
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-lime-600 dark:text-lime-400">
                Nutrition
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-purple-900 dark:text-purple-100">
            <a href="#menu" className="hover:text-pink-600 dark:hover:text-pink-400 transition">Drinks & Flavors</a>
            <a href="#categories" className="hover:text-pink-600 dark:hover:text-pink-400 transition">Categories</a>
            <a href="#location" className="hover:text-pink-600 dark:hover:text-pink-400 transition">Find Us</a>
            <a href="#contact" className="hover:text-pink-600 dark:hover:text-pink-400 transition">Contact</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {settings.onlineOrderingEnabled ? (
              <button
                onClick={() => setCartOpen(true)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 font-bold text-xs md:text-sm shadow-lg shadow-pink-500/20 hover:opacity-95 transition"
              >
                🛒 Order Pickup ({cart.length})
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-purple-950/90 border border-pink-300 dark:border-pink-500/30 text-pink-700 dark:text-pink-300 text-xs font-semibold">
                ⚡ Online Ordering Coming Soon
              </span>
            )}
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-full bg-lime-100 hover:bg-lime-200 dark:bg-purple-950/80 dark:hover:bg-purple-900 border border-lime-400 dark:border-purple-700/70 text-xs font-bold text-lime-900 dark:text-lime-400 transition"
            >
              🔒 Staff Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-pink-200/60 dark:border-purple-900/40">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 dark:bg-pink-500/15 border border-pink-300 dark:border-pink-500/30 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider mb-6">
              📍 851 W Elk Ave • Elizabethton, TN
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-purple-950 dark:text-white leading-tight mb-6">
              Loaded Teas.{' '}
              <span className="bg-gradient-to-r from-pink-600 to-lime-600 dark:from-pink-400 dark:to-lime-400 bg-clip-text text-transparent">
                Great Nutrition.
              </span>{' '}
              More You.
            </h1>
            <p className="text-base md:text-lg text-purple-800/85 dark:text-purple-200/80 leading-relaxed mb-8 max-w-xl">
              Your local mountain-town energy & nutrition bar in Elizabethton! Explore our handcrafted Loaded Teas, Specialty Teas, Protein Shakes, Iced Coffees, Dirty Sodas, and Dirty Alanis.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#menu"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-pink-500/25 transition"
              >
                Explore Drink Menu
              </a>
              <a
                href="#location"
                className="px-7 py-3.5 rounded-full bg-white hover:bg-lime-50 dark:bg-purple-950/80 dark:hover:bg-purple-900 border-2 border-lime-500 dark:border-lime-500/40 text-lime-700 dark:text-lime-300 font-bold shadow-sm transition"
              >
                Get Directions
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative p-3 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-600 to-lime-400 shadow-2xl shadow-pink-500/20">
              <img
                src="/logo.png"
                alt="Appalachian Nutrition"
                className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Drink Category Highlights */}
      <section id="categories" className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-purple-950 dark:text-white mb-3">What We Pour</h2>
          <p className="text-purple-700/80 dark:text-purple-200/70 text-sm">
            Six signature drink lines crafted fresh to boost your energy, protein, and mood.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { name: 'Loaded Tea', badge: 'Clean Energy + Vitamins', desc: 'Zero-sugar, vitamin-packed energy teas with bold fruit combinations.', color: 'from-pink-100/90 to-purple-50 border-pink-300 dark:from-pink-500/20 dark:to-purple-900/40 dark:border-pink-500/40' },
            { name: 'Specialty Tea', badge: 'Layered & Topped', desc: 'Extra-loaded layered teas with cream caps, fruit purees, and fun toppings.', color: 'from-lime-100/90 to-emerald-50 border-lime-300 dark:from-lime-500/20 dark:to-purple-900/40 dark:border-lime-500/40' },
            { name: 'Coffee', badge: 'Iced & Cold Foam', desc: 'House iced coffees, chai lattes, cookie butter swirls, and cold foams.', color: 'from-amber-100/90 to-orange-50 border-amber-300 dark:from-amber-500/20 dark:to-purple-900/40 dark:border-amber-500/40' },
            { name: 'Shakes', badge: '24g+ Protein Meal', desc: 'Thick, dessert-inspired protein shakes blended to fuel your day.', color: 'from-purple-100/90 to-fuchsia-50 border-purple-300 dark:from-purple-500/20 dark:to-purple-900/40 dark:border-purple-400/40' },
            { name: 'Dirty Soda', badge: 'Swirled & Creamy', desc: 'Your favorite sodas remixed with gourmet fruit syrups, purees, and sweet cream.', color: 'from-cyan-100/90 to-sky-50 border-cyan-300 dark:from-cyan-500/20 dark:to-purple-900/40 dark:border-cyan-400/40' },
            { name: 'Dirty Alani', badge: '200mg Alani Nu Remix', desc: 'Alani Nu energy flavors elevated with coconut, fruit, and sweet cream swirls.', color: 'from-rose-100/90 to-pink-50 border-rose-300 dark:from-rose-500/20 dark:to-purple-900/40 dark:border-rose-400/40' },
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-left p-6 rounded-2xl bg-gradient-to-br ${cat.color} border hover:scale-[1.01] shadow-sm transition`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-purple-950 dark:text-white">{cat.name}</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-lime-300 dark:bg-black/40 dark:text-lime-300">
                  {cat.badge}
                </span>
              </div>
              <p className="text-xs text-purple-900/80 dark:text-purple-100/80 leading-relaxed">{cat.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Flavor Menu */}
      <section id="menu" className="py-16 bg-purple-100/40 dark:bg-[#180a29]/70 border-y border-purple-200/80 dark:border-purple-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-purple-950 dark:text-white mb-2">Our Flavor Menu</h2>
              <p className="text-sm text-purple-800/80 dark:text-purple-200/75">
                Filter by category or search for your favorite fruit, candy, or protein flavor.
              </p>
            </div>

            <div className="w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flavors or ingredients (e.g. Coconut, Peach)..."
                className="w-full px-4 py-2.5 rounded-full bg-white dark:bg-purple-950/90 border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white placeholder:text-purple-400 focus:outline-none focus:border-pink-500 shadow-sm"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 shadow-md'
                    : 'bg-white dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 hover:border-pink-500/50 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id || item.name}
                className="rounded-2xl bg-white dark:bg-[#120620] border border-purple-200/90 dark:border-purple-800/80 hover:border-pink-500/60 transition p-6 flex flex-col justify-between shadow-md dark:shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-lime-100 text-lime-800 border border-lime-300 dark:bg-purple-900/80 dark:text-lime-300 dark:border-lime-500/20">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.featured && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-pink-100 text-pink-700 border border-pink-300 dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-500/30">
                          ★ Popular
                        </span>
                      )}
                      {!item.inStock && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-purple-950 dark:text-white mt-2 mb-1">{item.name}</h3>
                  {item.description && (
                    <p className="text-xs text-purple-700 dark:text-purple-200/80 mb-3">{item.description}</p>
                  )}

                  <div className="p-3 rounded-xl bg-fdf8ff bg-purple-50/80 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-900/70 mb-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-1">
                      Flavor Profile & Ingredients
                    </span>
                    <p className="text-xs text-purple-950 dark:text-purple-100 leading-relaxed">{item.ingredients}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-100 dark:border-purple-900/60 flex items-center justify-between">
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    <span className="font-semibold text-purple-950 dark:text-white">{item.sizes || '24oz, 32oz'}</span>
                    {settings.onlineOrderingEnabled && item.price && (
                      <span className="ml-2 text-lime-700 dark:text-lime-400 font-bold">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {settings.onlineOrderingEnabled && item.orderableOnline && item.inStock && (
                    <button
                      onClick={() => handleOpenOrderModal(item)}
                      className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 font-bold text-xs hover:opacity-90 transition"
                    >
                      + Add to Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Integrated Map Section */}
      <section id="location" className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
                Visit Us in Elizabethton
              </span>
              <h2 className="text-3xl font-extrabold text-purple-950 dark:text-white mt-1">Location & Hours</h2>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 shadow-md space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Address</h3>
                <p className="text-base font-bold text-purple-950 dark:text-white mt-0.5">{settings.address}</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=851+W+Elk+Ave+Elizabethton+TN"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-xs font-bold text-lime-700 dark:text-lime-400 hover:underline"
                >
                  Open in Google Maps ↗
                </a>
              </div>

              <div className="pt-4 border-t border-purple-100 dark:border-purple-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Store Hours</h3>
                <p className="text-sm text-purple-900 dark:text-purple-100 mt-1 leading-relaxed">{settings.hours}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 rounded-2xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-2xl h-80 md:h-96">
            <iframe
              title="Appalachian Nutrition Map - 851 W Elk Ave Elizabethton TN"
              src="https://maps.google.com/maps?q=851%20W%20Elk%20Ave,%20Elizabethton,%20TN&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 border-t border-purple-200/70 dark:border-purple-900/50 bg-pink-50/60 dark:bg-[#160828] transition-colors">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-purple-950 dark:text-white mb-3">Get in Touch</h2>
          <p className="text-sm text-purple-800/80 dark:text-purple-200/80 mb-8 max-w-xl mx-auto">
            Have questions about our nutrition facts, catering/office drink drops, or custom flavor combinations? Give us a call or stop by!
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href={`tel:${settings.phone}`}
              className="p-6 rounded-2xl bg-white dark:bg-purple-950/70 border border-pink-300 dark:border-pink-500/40 hover:border-pink-500 shadow-md transition flex flex-col items-center"
            >
              <span className="text-2xl mb-2">📞</span>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Call the Shop</span>
              <span className="text-xl font-extrabold text-purple-950 dark:text-white mt-1">{settings.phone}</span>
            </a>

            <a
              href="https://maps.google.com/?q=851+W+Elk+Ave+Elizabethton+TN"
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-2xl bg-white dark:bg-purple-950/70 border border-lime-400 dark:border-lime-500/40 hover:border-lime-500 shadow-md transition flex flex-col items-center"
            >
              <span className="text-2xl mb-2">📍</span>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400">Stop By</span>
              <span className="text-base font-extrabold text-purple-950 dark:text-white mt-1">851 W Elk Ave, Elizabethton, TN</span>
            </a>
          </div>
        </div>
      </section>

      {/* Future-Ready Online Ordering Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddToCart}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1a0a2e] border border-pink-400 dark:border-pink-500/50 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-lime-600 dark:text-lime-400">{activeModalItem.category}</span>
                <h3 className="text-xl font-bold text-purple-950 dark:text-white">{activeModalItem.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="text-purple-500 dark:text-purple-300 hover:opacity-75 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-purple-800 dark:text-purple-200">{activeModalItem.ingredients}</p>

            <div>
              <label className="block text-xs font-bold uppercase text-pink-600 dark:text-pink-400 mb-1">Select Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
              >
                {(activeModalItem.sizes || '24oz, 32oz').split(',').map((s: string) => (
                  <option key={s.trim()} value={s.trim()}>
                    {s.trim()}
                  </option>
                ))}
              </select>
            </div>

            {activeModalItem.customizationAddons && (
              <div className="text-xs text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                <strong className="text-lime-700 dark:text-lime-400 block mb-0.5">Available Add-ons:</strong>
                {activeModalItem.customizationAddons}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-pink-600 dark:text-pink-400 mb-1">
                Customizations / Add-On Notes
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Add Whip, Extra Boost, Easy Ice..."
                className="w-full px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-300 dark:border-purple-700 text-sm text-purple-950 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 font-extrabold text-sm"
            >
              Add to Pickup Order (${Number(activeModalItem.price || 6.5).toFixed(2)})
            </button>
          </form>
        </div>
      )}

      {/* Future-Ready Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-[#160826] border-l border-purple-200 dark:border-purple-800 h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-extrabold text-purple-950 dark:text-white">Your Pickup Order</h3>
                <button onClick={() => setCartOpen(false)} className="text-sm text-purple-600 dark:text-purple-300">
                  Close ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-purple-600 dark:text-purple-300 py-8 text-center">Your pickup bag is empty.</p>
              ) : (
                <div className="space-y-3 my-4 max-h-[60vh] overflow-y-auto">
                  {cart.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-purple-950 dark:text-white">
                          {c.item.name} ({c.size})
                        </h4>
                        {c.notes && <p className="text-xs text-lime-700 dark:text-lime-300">Notes: {c.notes}</p>}
                        <span className="text-xs text-pink-600 dark:text-pink-400 font-bold">
                          ${Number(c.item.price || 6.5).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => setCart(cart.filter((_, idx) => idx !== i))}
                        className="text-xs text-red-500 dark:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex justify-between font-bold text-purple-950 dark:text-white">
                  <span>Estimated Total</span>
                  <span>
                    ${cart.reduce((sum, c) => sum + (Number(c.item.price) || 6.5), 0).toFixed(2)}
                  </span>
                </div>
                {orderSubmitted ? (
                  <div className="p-3 rounded-xl bg-lime-500/20 border border-lime-500 text-lime-800 dark:text-lime-300 text-xs font-bold text-center">
                    🎉 Order received for 851 W Elk Ave! See you soon!
                  </div>
                ) : (
                  <button
                    onClick={() => setOrderSubmitted(true)}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-lime-500 text-slate-950 font-extrabold text-sm"
                  >
                    Submit In-Store Pickup Order
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-purple-200/70 dark:border-purple-900/50 text-center text-xs text-purple-700/70 dark:text-purple-300/70">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Appalachian Nutrition • 851 W Elk Ave, Elizabethton, TN</p>
          <p>Loaded Teas • Great Nutrition • More You</p>
        </div>
      </footer>
    </div>
  );
}

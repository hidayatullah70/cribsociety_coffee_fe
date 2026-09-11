import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Coffee,
  ArrowRight,
  ArrowUp,
  Clock,
  MapPin,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { apiClient } from '../../api';
import { Product, ProductCategory } from '../../types';
import { formatIDR } from '../../utils/currency';

export const LandingPage: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const fetchMenu = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catList, prodList] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getProducts(),
      ]);
      setCategories(catList);
      setProducts(prodList);
    } catch (err: any) {
      setError(err?.message || 'Failed to load menu items.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col selection:bg-brand-red selection:text-white">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 bg-brand-black/90 backdrop-blur-md border-b border-brand-black-muted px-4 sm:px-6 md:px-10 lg:px-12 py-3.5 transition-all">
        <div className="w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <img
              src="/logo.png"
              alt="cribsociety_coffee"
              className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-extrabold text-base sm:text-lg md:text-xl tracking-tight text-white lowercase">
              cribsociety_coffee
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-brand-white/80">
            <a href="#featured-menu" className="hover:text-brand-red transition-colors">
              Menu
            </a>
            <a href="#brand-story" className="hover:text-brand-red transition-colors">
              Brand Story
            </a>
            <a href="#store-info" className="hover:text-brand-red transition-colors">
              Store Info
            </a>
            <a href="#highlights" className="hover:text-brand-red transition-colors">
              Community
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex border-brand-black-muted hover:border-brand-red">
                Staff Portal
              </Button>
            </Link>
            <Link to="/pos">
              <Button variant="primary" size="sm" className="flex items-center gap-2 font-bold shadow-md shadow-brand-red/20">
                <span>Order at Counter</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-10 lg:px-12 border-b border-brand-black-muted bg-gradient-to-b from-brand-black via-brand-black-soft to-brand-black">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-brand-red-soft text-brand-red px-3.5 py-1.5 rounded-full border border-brand-red/30 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-red" />
              <span>Modern Micro-Roastery & Counter POS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.05]">
              FOR ALL HOMIES, <br />
              <span className="text-brand-red inline-block">FOR ALL PEOPLE,</span> <br />
              FOR US.
            </h1>

            <p className="text-base sm:text-lg text-brand-white/70 max-w-xl font-normal leading-relaxed">
              We pull single-origin espresso and slow-fermented roasts tailored for the new generation of coffee purists. Built with a hyper-responsive counter workflow.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link to="/pos">
                <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 text-base px-8 py-4 font-bold shadow-xl shadow-brand-red/30 hover:shadow-brand-red/50">
                  <span>Open POS / Order Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#store-info">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-brand-black-muted text-white hover:bg-brand-black-card hover:border-brand-red">
                  Visit Coffee Shop
                </Button>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-brand-black-muted max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">92+</div>
                <div className="text-xs font-semibold text-brand-white/50 uppercase">Cup Score Beans</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-brand-red">&lt; 90s</div>
                <div className="text-xs font-semibold text-brand-white/50 uppercase">Counter Service</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
                <div className="text-xs font-semibold text-brand-white/50 uppercase">Direct Trade</div>
              </div>
            </div>
          </div>

          {/* Hero Image Card */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative rounded-3xl overflow-hidden border border-brand-black-muted shadow-2xl bg-brand-black-card w-full max-w-sm sm:max-w-md lg:max-w-md xl:max-w-lg p-2 group hover:border-brand-red/50 transition-all duration-500">
              <img
                src="/hero-crib.png"
                alt="A Place to Gather — Crib Society Coffee"
                className="w-full h-auto object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.01] block shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Menu Section */}
      <section id="featured-menu" className="py-16 px-4 sm:px-6 md:px-10 lg:px-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-red text-xs font-black uppercase tracking-wider mb-2">
              <Coffee className="w-4 h-4 text-brand-red" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              FEATURED CRAFT MENU
            </h2>
            <p className="text-sm text-brand-white/60 mt-1">
              Roasted in-house weekly. Prepared fresh with precision dial-in.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] border ${activeCategory === 'all'
                ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20'
                : 'bg-brand-black-card border-brand-black-muted text-brand-white/80 hover:bg-brand-black-soft hover:text-white'
                }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] border ${activeCategory === cat.id
                  ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20'
                  : 'bg-brand-black-card border-brand-black-muted text-brand-white/80 hover:bg-brand-black-soft hover:text-white'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid States */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-4 space-y-4">
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="w-2/3 h-5" />
                <Skeleton className="w-full h-10" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="w-20 h-6" />
                  <Skeleton className="w-24 h-9" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            type="error"
            title="Unable to load menu"
            description={error}
            actionLabel="Try Reloading Menu"
            onAction={fetchMenu}
          />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            type="empty"
            title="No items found in this category"
            description="Try selecting a different craft category or view all items."
            actionLabel="View All Items"
            onAction={() => setActiveCategory('all')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group relative overflow-hidden flex flex-col justify-between border border-brand-black-muted bg-brand-black-card hover:border-brand-red hover:shadow-2xl transition-all duration-300 p-0"
              >
                {/* Image & Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-black-soft">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-red">
                      <Coffee className="w-12 h-12 text-brand-red" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    {product.available ? (
                      <Badge variant="brand" size="sm" className="bg-brand-black/80 backdrop-blur-sm">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="danger" size="sm" className="bg-brand-black/80 backdrop-blur-sm">
                        Sold Out
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-brand-red transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="font-black text-sm text-white shrink-0">
                        {formatIDR(product.price)}
                      </span>
                    </div>
                    <p className="text-xs text-brand-white/60 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-brand-black-muted flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-brand-white/50">
                      {product.variants.length > 0
                        ? `${product.variants.length} Sizes/Options`
                        : 'Standard Size'}
                    </span>
                    <Link to="/pos">
                      <Button
                        size="sm"
                        disabled={!product.available}
                        className="text-xs px-3 py-1.5 font-bold shadow-sm"
                      >
                        Order in POS
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 4. Brand Story Section */}
      <section id="brand-story" className="py-16 bg-brand-black-soft text-white px-4 sm:px-6 md:px-10 lg:px-12 border-y border-brand-black-muted">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden border border-brand-black-muted shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800"
                alt="Coffee roasting process"
                className="w-full h-[400px] object-cover opacity-90"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-brand-red-soft text-brand-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-red/30">
              <Award className="w-3.5 h-3.5 text-brand-red" />
              <span>The Crib Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              COMMUNITY-FOCUSED. <br />
              OBSESSIVELY ROASTED.
            </h2>

            <p className="text-brand-white/70 text-sm sm:text-base leading-relaxed">
              Crib Society Coffee was founded on a simple premise: elevate everyday coffee without the pretension. We source directly from ethical farmers in Aceh, Java, and Latin America, roasting in micro-batches to preserve authentic terroir notes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-brand-black-card border border-brand-black-muted">
                <CheckCircle2 className="w-5 h-5 text-brand-red mb-2" />
                <h4 className="font-bold text-sm text-white">Micro-Batch Roasting</h4>
                <p className="text-xs text-brand-white/60 mt-1">
                  Small 5kg drum batches for optimum sugar caramelization and clarity.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-black-card border border-brand-black-muted">
                <ShieldCheck className="w-5 h-5 text-brand-red mb-2" />
                <h4 className="font-bold text-sm text-white">Zero Artificial Flavors</h4>
                <p className="text-xs text-brand-white/60 mt-1">
                  100% natural bean extracts, organic palm nectar, and clean dairy substitutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Store Information Section */}
      <section id="store-info" className="py-16 px-4 sm:px-6 md:px-10 lg:px-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="brand" className="mb-2">Visit Us</Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            STORE LOCATION & HOURS
          </h2>
          <p className="text-sm text-brand-white/60 mt-1">
            Drop by for a quick counter pickup or chill at our communal bar workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col items-start p-6 space-y-3 border-brand-black-muted bg-brand-black-card">
            <div className="w-12 h-12 rounded-xl bg-brand-red-soft text-brand-red flex items-center justify-center font-bold border border-brand-red/30">
              <MapPin className="w-6 h-6 text-brand-red" />
            </div>
            <h3 className="font-extrabold text-lg text-white">Flagship Store</h3>
            <p className="text-xs text-brand-white/70 leading-relaxed">
              Jl. RHM Noeradji No.44, RT02/RW02<br />
              Sumur Pacing, Kec. Karawaci, Kota Tangerang, Banten 15114
            </p>
            <a
              href="https://www.google.com/maps/place/CRIB+SOCIETY/@-6.17717,106.6207015,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69ff327e90061f:0xbca2cbbfe9520f88!8m2!3d-6.17717!4d106.6207015!16s%2Fg%2F11vl4j8t4x"
              target="_blank"
              rel="noreferrer"
              title="Open CRIB SOCIETY in Google Maps"
              className="text-[11px] font-bold text-brand-red pt-2 inline-flex items-center gap-1 hover:underline hover:text-brand-red-hover group/map transition-all"
            >
              <span>Counter Service & Dine-in</span>
              <ChevronRight className="w-3.5 h-3.5 text-brand-red group-hover/map:translate-x-1 transition-transform" />
            </a>
          </Card>

          <Card className="flex flex-col items-start p-6 space-y-3 border-brand-black-muted bg-brand-black-card">
            <div className="w-12 h-12 rounded-xl bg-brand-black-soft text-brand-red flex items-center justify-center font-bold border border-brand-black-muted">
              <Clock className="w-6 h-6 text-brand-red" />
            </div>
            <h3 className="font-extrabold text-lg text-white">Operating Hours</h3>
            <div className="text-xs text-brand-white/70 space-y-1 w-full">
              <div className="flex justify-between w-full gap-4">
                <span className="font-medium">WE’RE OPEN EVERYDAY</span>
                <span className="font-bold text-white">15:00 – 00:00 (WEEKDAYS)</span>
              </div>
              <div className="flex justify-between w-full gap-4">
                <span className="font-medium">(WEDNESYDAY OFF)</span>
                <span className="font-bold text-white">15:00 – 01:00 (WEEKEND)</span>
              </div>
            </div>
            <Badge variant="success" size="sm" className="mt-2">Open Now</Badge>
          </Card>

          <Card className="flex flex-col items-start p-6 space-y-3 border-brand-black-muted bg-brand-black-card">
            <div className="w-12 h-12 rounded-xl bg-brand-red text-white flex items-center justify-center font-bold">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-extrabold text-lg text-white">Direct Contacts</h3>
            <p className="text-xs text-brand-white/70 leading-relaxed">
              WhatsApp Counter: +62 812-9054-4235<br />
              Email: hello@cribsociety.com
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://www.instagram.com/cribsociety_coffee/"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-brand-black-soft hover:bg-brand-black-muted text-brand-red transition-colors border border-brand-black-muted"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current text-brand-red" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. Selected Highlights / Social Proof */}
      <section id="highlights" className="py-16 bg-brand-black-soft border-y border-brand-black-muted px-4 sm:px-6 md:px-10 lg:px-12 w-full">
        <div className="w-full">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-white">COMMUNITY HIGHLIGHTS</h3>
            <p className="text-xs text-brand-white/60 mt-1">What our regulars say about the crib experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-brand-black-card border border-brand-black-muted shadow-xl space-y-3">
              <div className="flex text-brand-red font-bold">★★★★★</div>
              <p className="text-xs text-brand-white/80 italic leading-relaxed">
                "The Crib Signature Latte is by far the cleanest iced coffee in Senopati. The sea salt cold foam balance is incredible."
              </p>
              <div className="text-xs font-bold text-white">— Reza A., Product Designer</div>
            </div>

            <div className="p-5 rounded-2xl bg-brand-black-card border border-brand-black-muted shadow-xl space-y-3">
              <div className="flex text-brand-red font-bold">★★★★★</div>
              <p className="text-xs text-brand-white/80 italic leading-relaxed">
                "Super fast counter POS ordering. I get my morning pour-over within 2 minutes of walking through the door."
              </p>
              <div className="text-xs font-bold text-white">— Nadia K., Founder</div>
            </div>

            <div className="p-5 rounded-2xl bg-brand-black-card border border-brand-black-muted shadow-xl space-y-3">
              <div className="flex text-brand-red font-bold">★★★★★</div>
              <p className="text-xs text-brand-white/80 italic leading-relaxed">
                "Ethiopia Yirgacheffe on V60 has outstanding floral clarity. Baristas really know their brew parameters."
              </p>
              <div className="text-xs font-bold text-white">— Tommy W., Specialty Coffee Enthusiast</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-brand-black text-white pt-12 pb-8 px-4 sm:px-6 md:px-10 lg:px-12 mt-auto border-t border-brand-black-muted">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-brand-black-muted">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="cribsociety_coffee"
                className="h-8 w-auto object-contain"
              />
              <span className="font-black text-base sm:text-lg tracking-tight text-white lowercase">cribsociety_coffee</span>
            </div>
            <p className="text-xs text-brand-white/60 max-w-sm leading-relaxed">
              Craft coffee roastery and modern counter POS experience. Designed for seamless interactions from landing to espresso pull.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-brand-white/40 mb-3">
              Explore
            </h5>
            <ul className="space-y-2 text-xs font-medium text-brand-white/70">
              <li><a href="#featured-menu" className="hover:text-brand-red">Curated Menu</a></li>
              <li><a href="#brand-story" className="hover:text-brand-red">Brand Story</a></li>
              <li><a href="#store-info" className="hover:text-brand-red">Store Location</a></li>
              <li><Link to="/pos" className="hover:text-brand-red">Counter POS</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-brand-white/40 mb-3">
              Operations
            </h5>
            <ul className="space-y-2 text-xs font-medium text-brand-white/70">
              <li><Link to="/login" className="hover:text-brand-red font-semibold">Staff & Owner Sign-In</Link></li>
              <li><Link to="/dashboard/staff" className="hover:text-brand-red">Shift Overview</Link></li>
              <li><Link to="/dashboard/owner" className="hover:text-brand-red">Owner Analytics</Link></li>
              <li><Link to="/dashboard/guest" className="hover:text-brand-red">Guest Order Board</Link></li>
            </ul>
          </div>
        </div>

        <div className="w-full pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-white/40 gap-2">
          <div>© {new Date().getFullYear()} Crib Society Coffee. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>SOT-Compliant MVP</span>
            <span>•</span>
            <Link to="/login" className="hover:underline text-brand-white/70">Operational Portal</Link>
          </div>
        </div>
      </footer>

      {/* Back to Top Floating Button */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to Top"
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 p-3 sm:p-3.5 rounded-full bg-brand-red text-white shadow-2xl shadow-brand-red/50 hover:bg-brand-red-hover hover:scale-110 active:scale-95 transition-all duration-300 border border-brand-red/60 backdrop-blur-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-red/80 ${showBackToTop
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
      >
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:-translate-y-0.5 transition-transform duration-300 stroke-[2.5]" />
      </button>
    </div>
  );
};

import { CATEGORY_LIST } from '../types/video';
import type { AppRoute } from './Navbar';

interface FooterProps {
  onNavigate: (next: AppRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand & Family Safety Note */}
          <div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'home' })}
              className="font-display text-xl font-extrabold text-slate-900 hover:text-sky-700 transition-colors"
            >
              Kids Cartoon World
            </button>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm">
              A safe, colorful storytelling home for children and families featuring funny animal
              cartoons, Urdu moral stories, educational videos, and calm bedtime tales.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              No child accounts required · No comments from strangers · Family-first design
            </p>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h2 className="font-display text-sm font-bold text-slate-900">Categories</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {CATEGORY_LIST.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'category', category: cat.id })}
                    className="hover:text-sky-700 transition-colors py-1"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Family & Legal Pages */}
          <div>
            <h2 className="font-display text-sm font-bold text-slate-900">Information & Policies</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'about' })}
                  className="hover:text-sky-700 transition-colors py-1"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'contact' })}
                  className="hover:text-sky-700 transition-colors py-1"
                >
                  Contact Us (Parents & Guardians)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'privacy' })}
                  className="hover:text-sky-700 transition-colors py-1"
                >
                  Privacy Policy & Child Safety
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'terms' })}
                  className="hover:text-sky-700 transition-colors py-1"
                >
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Bar with discreet owner studio entry (not exposed as visitor control) */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Kids Cartoon World. Designed for children and families.</p>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'admin' })}
            className="text-slate-400 hover:text-slate-700 transition-colors py-1"
          >
            Owner Sign In
          </button>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Terminal, 
  ShieldCheck, 
  Cloud, 
  FileCode, 
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DevGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevGuideModal: React.FC<DevGuideModalProps> = ({ isOpen, onClose }) => {
  const { simulateProduction, setSimulateProduction } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900">Build & Deployment Diagnostics</h2>
              <p className="text-xs text-stone-500">Repairs, Vercel readiness, and demo phone security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* Production Simulation Toggle */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-stone-900">Production Mode Security Simulator</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Test the security rule: Demo mobile numbers (9990003331 & 8880002221) are strictly blocked in production.
              </p>
            </div>
            <button
              onClick={() => setSimulateProduction(!simulateProduction)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                simulateProduction
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {simulateProduction ? 'Exit Production Mode' : 'Simulate Production Mode'}
            </button>
          </div>

          {/* Section 1: ERESOLVE Dependency Repair */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-700">
              <Terminal className="w-4 h-4" />
              <span>1. ERESOLVE Conflict Resolved</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
              <p>
                <strong>Root Cause:</strong> <code>package.json</code> declared an explicit devDependency on <code>"esbuild": "^0.25.0"</code>, while Vite 8 requires peerOptional esbuild <code>^0.27.0 || ^0.28.0</code>.
              </p>
              <p>
                <strong>Fix Applied:</strong> Removed the redundant direct <code>esbuild</code> declaration from <code>devDependencies</code>. Vite bundles and manages its compatible internal esbuild release without conflict.
              </p>
              <p>
                <strong>Verification:</strong> Regenerated <code>package-lock.json</code> cleanly with <code>npm install --package-lock-only</code> (0 vulnerabilities, 0 peer conflicts).
              </p>
            </div>
          </div>

          {/* Section 2: Unknown env config cache-dir */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-700">
              <AlertTriangle className="w-4 h-4" />
              <span>2. Cache Configuration Warning Explained</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
              <p>
                <strong>Origin:</strong> <code>npm WARN Unknown env config "cache-dir"</code> occurs when an external environment variable like <code>npm_config_cache_dir</code> is set in a CI container, shell profile, or Bun/Yarn wrapper.
              </p>
              <p>
                <strong>Explanation:</strong> In npm, the valid configuration property is <code>cache</code> (not <code>cache-dir</code>). The repository contains no invalid <code>.npmrc</code> entries. In standard Vercel and GitHub Actions environments, npm will run without this warning.
              </p>
            </div>
          </div>

          {/* Section 3: Vercel SPA Routing Configuration */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-700">
              <Cloud className="w-4 h-4" />
              <span>3. Vercel Deployment Configuration</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
              <p>
                <strong>Created <code>vercel.json</code>:</strong> Configured framework as <code>vite</code> and added SPA rewrite rule:
              </p>
              <pre className="p-2 bg-stone-900 text-stone-100 rounded-lg text-[11px] overflow-x-auto font-mono">
{`{
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}`}
              </pre>
              <p>
                This guarantees direct links, client navigation, and page refreshes on Vercel do not yield 404 or "Page unavailable" errors.
              </p>
            </div>
          </div>

          {/* Section 4: Demo Phone Accounts */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-700">
              <Smartphone className="w-4 h-4" />
              <span>4. Demo Mobile Accounts Restricted to Dev</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
              <p>
                • <strong>Sarah Chen:</strong> <code>9990003331</code> (Pottery, French, Sourdough)
              </p>
              <p>
                • <strong>Marcus Vance:</strong> <code>8880002221</code> (React Web Dev, Woodworking, Espresso)
              </p>
              <p className="text-stone-500">
                Guarded in <code>AuthContext.tsx</code>: if not in development or if <code>simulateProduction</code> is on, bypass login is rejected immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};

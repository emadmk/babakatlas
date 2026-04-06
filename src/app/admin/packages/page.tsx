'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Save, Trash2, Loader2, AlertCircle, Check } from 'lucide-react';

interface TintPackage {
  id: string;
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  coverage: string;
  metersUsed: Record<string, number>;
  applicableTintTypes: string[];
  order: number;
  active: boolean;
}

const COVERAGE_OPTIONS = [
  { value: 'windshield', label: 'Windshield Only' },
  { value: 'half', label: 'Half Unit (WS + Front Windows)' },
  { value: 'semi-full', label: 'Semi Full (All except Front WS)' },
  { value: 'full-wrap', label: 'Full Wrap' },
  { value: 'combo', label: 'Combo (Adaptive + Ceramic)' },
];

const SIZE_GROUPS = ['small', 'medium', 'large'];
const SIZE_GROUP_LABELS: Record<string, string> = {
  small: 'Small (Coupe/Sedan/Pickup)',
  medium: 'Medium (MPV/SUV)',
  large: 'Large (Van)',
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<TintPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch('/api/products/packages');
      const data = await res.json();
      if (data.success) {
        setPackages(data.data);
      }
      setLoading(false);
    } catch {
      setError('Failed to load packages');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleUpdate = async (pkg: TintPackage) => {
    setSaving(pkg.id);
    setError(null);
    try {
      const res = await fetch('/api/products/packages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkg),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Updated "${pkg.name.en}"`);
        setTimeout(() => setSuccess(null), 2000);
        fetchPackages();
      } else {
        setError(data.error || 'Failed to update');
      }
    } catch {
      setError('Failed to update package');
    }
    setSaving(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(`/api/products/packages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccess('Package deleted');
        setTimeout(() => setSuccess(null), 2000);
        fetchPackages();
      } else {
        setError(data.error || 'Failed to delete');
      }
    } catch {
      setError('Failed to delete package');
    }
  };

  const handleCreate = async () => {
    const newPkg: Omit<TintPackage, 'id'> = {
      name: { en: 'New Package', tl: 'Bagong Package' },
      description: { en: 'Description', tl: 'Paglalarawan' },
      coverage: 'windshield',
      metersUsed: { small: 1, medium: 1.5, large: 2 },
      applicableTintTypes: ['nano-ceramic', 'adaptive'],
      order: packages.length + 1,
      active: true,
    };

    try {
      const res = await fetch('/api/products/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPkg),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Package created');
        setTimeout(() => setSuccess(null), 2000);
        fetchPackages();
      } else {
        setError(data.error || 'Failed to create');
      }
    } catch {
      setError('Failed to create package');
    }
  };

  const updateField = (id: string, field: string, value: unknown) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const updateMeters = (id: string, sizeGroup: string, value: number) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, metersUsed: { ...p.metersUsed, [sizeGroup]: value } }
          : p
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tint Packages</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage coverage packages and meters-per-vehicle-size pricing
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0071E3] text-white text-sm font-medium hover:bg-[#0071E3]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm ring-1 ring-red-500/20">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm ring-1 ring-emerald-500/20">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Package list */}
      <div className="space-y-4">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 p-5 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-white/30" />
                <div>
                  <input
                    type="text"
                    value={pkg.name.en}
                    onChange={(e) => updateField(pkg.id, 'name', { ...pkg.name, en: e.target.value })}
                    className="bg-transparent text-white font-semibold text-sm border-b border-transparent hover:border-white/20 focus:border-[#0071E3] outline-none transition-colors"
                  />
                  <div className="text-[10px] text-white/30 mt-0.5">ID: {pkg.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pkg.active}
                    onChange={(e) => updateField(pkg.id, 'active', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs text-white/40">Active</span>
                </label>
                <button
                  onClick={() => handleUpdate(pkg)}
                  disabled={saving === pkg.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071E3]/10 text-[#0071E3] text-xs font-medium ring-1 ring-[#0071E3]/30 hover:bg-[#0071E3]/20 transition-all disabled:opacity-50"
                >
                  {saving === pkg.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                  Save
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Coverage & order */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Coverage</label>
                <select
                  value={pkg.coverage}
                  onChange={(e) => updateField(pkg.id, 'coverage', e.target.value)}
                  className="w-full bg-white/5 text-white text-sm rounded-lg px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-[#0071E3]"
                >
                  {COVERAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Order</label>
                <input
                  type="number"
                  value={pkg.order}
                  onChange={(e) => updateField(pkg.id, 'order', parseInt(e.target.value) || 0)}
                  className="w-full bg-white/5 text-white text-sm rounded-lg px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-[#0071E3]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Applicable Types</label>
                <div className="flex gap-2">
                  {['nano-ceramic', 'adaptive'].map((type) => (
                    <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pkg.applicableTintTypes.includes(type)}
                        onChange={(e) => {
                          const types = e.target.checked
                            ? [...pkg.applicableTintTypes, type]
                            : pkg.applicableTintTypes.filter((t) => t !== type);
                          updateField(pkg.id, 'applicableTintTypes', types);
                        }}
                        className="rounded"
                      />
                      <span className="text-xs text-white/60 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Meters per size group */}
            <div>
              <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-2">
                Meters Used per Vehicle Size Group
              </label>
              <div className="grid grid-cols-3 gap-3">
                {SIZE_GROUPS.map((sg) => (
                  <div key={sg}>
                    <label className="text-[10px] text-white/20 block mb-1">
                      {SIZE_GROUP_LABELS[sg]}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={0.5}
                        min={0}
                        value={pkg.metersUsed[sg] || 0}
                        onChange={(e) =>
                          updateMeters(pkg.id, sg, parseFloat(e.target.value) || 0)
                        }
                        className="w-full bg-white/5 text-white text-sm rounded-lg px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-[#0071E3]"
                      />
                      <span className="text-xs text-white/30">m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No packages yet. Click &ldquo;Add Package&rdquo; to create one.</p>
        </div>
      )}
    </div>
  );
}

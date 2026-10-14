import React, { useState } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Camera, 
  Upload, 
  Link, 
  Check, 
  Sparkles,
  Phone,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
];

const COIMBATORE_NEIGHBORHOODS = [
  'Ganapathy',
  'Saravanampatti',
  'Kalapatti Pirivu',
  'Vilankurichi',
  'RS Puram',
  'Peelamedu',
  'Saibaba Colony',
  'Gandhipuram',
  'Race Course',
  'Vadavalli',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [neighborhood, setNeighborhood] = useState(currentUser?.neighborhood || 'Ganapathy');
  const [city, setCity] = useState(currentUser?.city || 'Coimbatore, Tamil Nadu');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [tagline, setTagline] = useState(currentUser?.tagline || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      setAvatar(customAvatarUrl.trim());
      setShowUrlInput(false);
      setCustomAvatarUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      avatar,
      tagline: tagline.trim(),
      bio: bio.trim(),
      phone: phone.trim(),
    });

    onSuccess('Profile details, location, and photo updated successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900">Edit Profile & Location</h2>
              <p className="text-xs text-stone-500">Update your name, profile photo, and Coimbatore location</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Profile Picture Update Section */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Profile Picture</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md"
                />
                <label 
                  htmlFor="photo-upload-input"
                  className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Upload from device"
                >
                  <Camera className="w-5 h-5" />
                </label>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap gap-2">
                  <label 
                    htmlFor="photo-upload-input"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-bold transition cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload from Device</span>
                  </label>
                  <input
                    id="photo-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition shadow-2xs"
                  >
                    <Link className="w-3.5 h-3.5 text-stone-500" />
                    <span>Paste Image URL</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="url"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                    >
                      Apply
                    </button>
                  </div>
                )}
                <p className="text-[11px] text-stone-400">
                  Select an avatar below, upload from your device, or paste a photo link.
                </p>
              </div>
            </div>

            {/* Avatar Preset Grid */}
            <div>
              <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                Or Pick Preset Avatar:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_AVATARS.map((picUrl, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAvatar(picUrl)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition ${
                      avatar === picUrl 
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-105 shadow-xs' 
                        : 'border-transparent hover:border-stone-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={picUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    {avatar === picUrl && (
                      <span className="absolute bottom-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dharani, Sivaraj"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Location / Neighborhood Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Coimbatore Location / Neighborhood</span>
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="e.g. Ganapathy, Saravanampatti, Kalapatti Pirivu"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
              required
            />
            
            {/* Quick Coimbatore neighborhood pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-stone-400 font-bold uppercase mr-1">Quick Select:</span>
              {COIMBATORE_NEIGHBORHOODS.map((nh) => (
                <button
                  type="button"
                  key={nh}
                  onClick={() => setNeighborhood(nh)}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border transition ${
                    neighborhood === nh
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  {nh}
                </button>
              ))}
            </div>
          </div>

          {/* City & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Coimbatore, Tamil Nadu"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Contact Phone</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9990003331"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Tagline / Headline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Terracotta Ceramicist & French Coach"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>About Me / Bio</span>
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Introduce your skills, local studio or workshop location, and what you're excited to learn..."
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

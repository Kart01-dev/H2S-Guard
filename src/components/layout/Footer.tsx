import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 py-10 px-6 sm:px-10 mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Branding & Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-corp-primary text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">
              H₂S Guard
            </h2>
          </div>
          <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
            Advanced industrial safety telemetry and compliance monitoring platform for high-risk energy sectors.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-display">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#" className="hover:text-corp-primary transition-colors flex items-center gap-2">
                Safety Guidelines <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-corp-primary transition-colors flex items-center gap-2">
                Compliance Reports <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-corp-primary transition-colors flex items-center gap-2">
                Worker Training Portal <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-corp-primary transition-colors flex items-center gap-2">
                Emergency Protocols <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-display">Contact & Support</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-corp-primary shrink-0 mt-0.5" />
              <span>MRPL Refinery Complex, Kuthethoor, Mangaluru, Karnataka 575030, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-corp-primary shrink-0" />
              <span>+91 824 288 2000 (24x7 Control Room)</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-corp-primary shrink-0" />
              <span>hse-alerts@mrpl.co.in</span>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© {new Date().getFullYear()} Mangalore Refinery and Petrochemicals Limited. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

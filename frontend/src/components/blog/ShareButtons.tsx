'use client';
import { useState } from 'react';
import { Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttons = [
    {
      label: 'Twitter', icon: Twitter, color: '#1da1f2',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'LinkedIn', icon: Linkedin, color: '#0077b5',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-sm text-muted-foreground">Share:</span>
      {buttons.map((btn) => (
        <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{ backgroundColor: btn.color + '15', color: btn.color }}>
          <btn.icon className="w-4 h-4" />
        </a>
      ))}
      <motion.button onClick={handleCopy}
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors text-muted-foreground">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={copied ? 'check' : 'link'}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

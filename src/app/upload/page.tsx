'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon, FileVideo, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { submitProject } from '@/app/actions';
import { MediaType } from '@/types/project';

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const result = await submitProject(formData);

    if (result.success) {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } else {
      setLoading(false);
      setError(result.error || 'Failed to submit project');
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-surface p-6 md:p-10 variant-transition"
          >
            {success ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Upload Successful!</h2>
                <p className="mt-2 text-secondary">Your project is now live in the gallery.</p>
                <p className="mt-4 text-xs text-secondary/60 italic">Redirecting to homepage...</p>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h1 className="text-3xl font-bold tracking-tight">Upload Project</h1>
                  <p className="mt-2 text-secondary">Share your work with the class.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Title</label>
                    <input
                      required
                      name="title"
                      type="text"
                      placeholder="Give your project a name"
                      className="input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="What is this project about?"
                      className="input resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Content Type</label>
                    <input type="hidden" name="mediaType" value={mediaType} />
                    <div className="grid grid-cols-3 gap-3">
                      {(['image', 'video', 'link'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setMediaType(type)}
                          className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all ${
                            mediaType === type
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'hover:bg-foreground/5'
                          }`}
                        >
                          {type === 'image' && <ImageIcon size={18} />}
                          {type === 'video' && <FileVideo size={18} />}
                          {type === 'link' && <LinkIcon size={18} />}
                          <span className="text-[11px] font-bold capitalize">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {mediaType === 'link' ? 'Project URL' : 'File'}
                    </label>
                    
                    {mediaType === 'link' ? (
                      <input
                        required
                        name="linkUrl"
                        type="url"
                        placeholder="https://..."
                        className="input"
                      />
                    ) : (
                      <div className="relative group">
                        <input
                          required
                          name="file"
                          type="file"
                          accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="input flex items-center gap-3 text-secondary text-sm group-hover:border-primary/50 transition-colors overflow-hidden">
                          <div className="bg-foreground/5 p-1.5 rounded">
                            <Upload size={14} />
                          </div>
                          <span className="truncate">
                            {file ? file.name : `Select ${mediaType} file...`}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-[10px] text-secondary">
                      {mediaType === 'link' 
                        ? 'Provide a direct link to your prototype or project.' 
                        : `Max size: ${mediaType === 'video' ? '25MB' : '10MB'}.`}
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded bg-accent/10 p-3 text-accent text-sm">
                      <AlertCircle size={16} className="shrink-0" />
                      <p className="font-medium">{error}</p>
                    </div>
                  )}

                  <button
                    disabled={loading}
                    type="submit"
                    className="btn btn-primary w-full py-3.5 flex items-center gap-2 shadow-sm font-bold"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Upload size={18} />
                        Submit Project
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useVariant } from './VariantProvider';

export function Hero() {
  const { currentVariant } = useVariant();

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          key={currentVariant.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            {currentVariant.introTitle.split('.').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-primary">.</span>}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-secondary leading-relaxed max-w-2xl">
            {currentVariant.introBody}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

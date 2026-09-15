import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * <img> with a shimmering skeleton placeholder that fades out once the image
 * decodes. Falls back gracefully (hides) on error, like the rest of the site.
 */
export default function SmartImage({ src, alt = '', className = '', imgClassName = '', style, ...rest }) {
  const [status, setStatus] = useState('loading'); // loading | ready | error

  return (
    <span className={`smart-img ${className}`} style={{ position: 'relative', display: 'block', overflow: 'hidden', ...style }}>
      {status === 'loading' && <span className="skeleton skeleton--fill" aria-hidden="true" />}
      {status !== 'error' && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={imgClassName}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={status === 'ready' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
          {...rest}
        />
      )}
    </span>
  );
}

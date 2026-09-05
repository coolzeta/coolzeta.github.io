'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';

/** Keep streamed Emotion styles in the document head, outside hydrated content. */
export default function StyleRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'zeta' });
    cache.compat = true;
    const insert = cache.insert;
    let names: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) names.push(serialized.name);
      return insert(...args);
    };
    return {
      cache,
      flush: () => {
        const inserted = names;
        names = [];
        return inserted;
      },
    };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (!names.length) return null;
    const styles = names
      .map(name => cache.inserted[name])
      .filter(value => typeof value === 'string')
      .join('');
    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

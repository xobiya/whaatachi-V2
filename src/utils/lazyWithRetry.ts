import React from 'react';

export function lazyWithRetry(
  importer: () => Promise<{ default: React.ComponentType<any> }>,
  retries = 5,
  delay = 1500
) {
  let attempts = 0;

  function attempt(): Promise<{ default: React.ComponentType<any> }> {
    return importer().catch((err) => {
      attempts++;
      if (attempts >= retries) throw err;
      return new Promise<{ default: React.ComponentType<any> }>((resolve, reject) => {
        setTimeout(() => {
          attempt().then(resolve).catch(reject);
        }, delay * attempts);
      });
    });
  }

  return React.lazy(() => attempt());
}

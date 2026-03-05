import { lazy, ComponentType } from 'react';

/**
 * Enhanced lazy loading with preload capability
 * Allows preloading components before they're needed
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(factory);
  let factoryPromise: Promise<{ default: T }> | undefined;

  const preload = () => {
    if (!factoryPromise) {
      factoryPromise = factory();
    }
    return factoryPromise;
  };

  return { Component: LazyComponent, preload };
}

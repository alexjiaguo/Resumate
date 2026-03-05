import { useEffect, useRef } from 'react';

/**
 * Performance monitoring utilities
 */

export interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

const metrics: PerformanceMetrics[] = [];

/**
 * Hook to measure component render time
 */
export function useRenderTime(componentName: string) {
  const renderStart = useRef<number>(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;

    metrics.push({
      renderTime,
      componentName,
      timestamp: Date.now(),
    });

    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.shift();
    }

    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(`Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  });

  renderStart.current = performance.now();
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics[] {
  return [...metrics];
}

/**
 * Clear performance metrics
 */
export function clearPerformanceMetrics(): void {
  metrics.length = 0;
}

/**
 * Get average render time for a component
 */
export function getAverageRenderTime(componentName: string): number {
  const componentMetrics = metrics.filter(m => m.componentName === componentName);
  if (componentMetrics.length === 0) return 0;

  const total = componentMetrics.reduce((sum, m) => sum + m.renderTime, 0);
  return total / componentMetrics.length;
}

/**
 * Hook to detect memory leaks
 */
export function useMemoryMonitor(componentName: string) {
  useEffect(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize / 1048576; // Convert to MB

      if (usedMemory > 100) {
        console.warn(`High memory usage in ${componentName}: ${usedMemory.toFixed(2)}MB`);
      }
    }
  });
}

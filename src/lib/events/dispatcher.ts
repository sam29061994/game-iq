// Event Dispatcher for Browser Events
import type {
  HockeyEvent,
} from './types';

export class EventDispatcher {
  private static instance: EventDispatcher;
  private listeners: Map<string, Set<(event: HockeyEvent) => void>> = new Map();
  private eventQueue: HockeyEvent[] = [];
  private isProcessing = false;

  private constructor() {}

  static getInstance(): EventDispatcher {
    if (!EventDispatcher.instance) {
      EventDispatcher.instance = new EventDispatcher();
    }
    return EventDispatcher.instance;
  }

  // Subscribe to specific event types
  on(eventType: HockeyEvent['type'] | 'all', callback: (event: HockeyEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
  }

  // Unsubscribe from events
  off(eventType: HockeyEvent['type'] | 'all', callback: (event: HockeyEvent) => void) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  // Dispatch an event to all subscribers
  async dispatch(event: HockeyEvent): Promise<void> {
    this.eventQueue.push(event);

    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;

      // Notify specific event type listeners
      const typeListeners = this.listeners.get(event.type);
      if (typeListeners) {
        for (const listener of typeListeners) {
          try {
            await listener(event);
          } catch (error) {
            console.error(`Error in event listener for ${event.type}:`, error);
          }
        }
      }

      // Notify 'all' event listeners
      const allListeners = this.listeners.get('all');
      if (allListeners) {
        for (const listener of allListeners) {
          try {
            await listener(event);
          } catch (error) {
            console.error('Error in event listener for all events:', error);
          }
        }
      }
    }

    this.isProcessing = false;
  }

  // Clear all listeners (useful for cleanup)
  clearAll() {
    this.listeners.clear();
    this.eventQueue = [];
    this.isProcessing = false;
  }

  // Reset dispatcher state (clears queue and processing flag)
  reset() {
    this.eventQueue = [];
    this.isProcessing = false;
  }
}

// Export singleton instance
export const eventDispatcher = EventDispatcher.getInstance();

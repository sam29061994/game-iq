// Event Dispatcher for Push Notifications
import type {
  HockeyEvent,
  NotificationPayload,
  GoalEvent,
  AssistEvent,
  PenaltyEvent,
  MilestoneEvent,
  HatTrickEvent,
  GameEndEvent,
  GameStartEvent,
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

      // Convert event to notification and send
      await this.sendNotification(event);
    }

    this.isProcessing = false;
  }

  private async sendNotification(event: HockeyEvent): Promise<void> {
    const payload = this.createNotificationPayload(event);

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;

      try {
        const notificationOptions: NotificationOptions = {
          body: payload.body,
          icon: payload.icon || '/icons/icon-192x192.png',
          badge: payload.badge || '/icons/badge-72x72.png',
          data: payload.data,
          tag: payload.tag || `event-${event.id}`,
          requireInteraction: payload.requireInteraction || false,
        };

        // Add optional properties if they exist (using any to bypass strict type checking)
        if (payload.actions) {
          (notificationOptions as any).actions = payload.actions;
        }

        // Add vibrate pattern
        (notificationOptions as any).vibrate = this.getVibrationPattern(event.type);

        // Add timestamp
        (notificationOptions as any).timestamp = Date.now();

        await registration.showNotification(payload.title, notificationOptions);
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }

  private createNotificationPayload(event: HockeyEvent): NotificationPayload {
    switch (event.type) {
      case 'goal':
        return this.createGoalNotification(event as GoalEvent);
      case 'assist':
        return this.createAssistNotification(event as AssistEvent);
      case 'penalty':
        return this.createPenaltyNotification(event as PenaltyEvent);
      case 'milestone':
        return this.createMilestoneNotification(event as MilestoneEvent);
      case 'hat_trick':
        return this.createHatTrickNotification(event as HatTrickEvent);
      case 'game_start':
        return this.createGameStartNotification(event as GameStartEvent);
      case 'game_end':
        return this.createGameEndNotification(event as GameEndEvent);
      default:
        return {
          title: 'GameIQ Update',
          body: 'New hockey event',
          data: event,
        };
    }
  }

  private createGoalNotification(event: GoalEvent): NotificationPayload {
    const { player, seasonStats, game } = event;
    const opponent = game.homeTeam.name === player.team ? game.awayTeam.name : game.homeTeam.name;

    return {
      title: `⚽ GOAL! ${player.name} scores!`,
      body: `That's ${this.ordinal(seasonStats.goals)} goal of the season vs ${opponent}`,
      icon: '/icons/goal-icon.png',
      data: event,
      tag: `goal-${event.id}`,
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'View Stats' },
        { action: 'share', title: 'Share' },
      ],
    };
  }

  private createAssistNotification(event: AssistEvent): NotificationPayload {
    const { player, seasonStats, game } = event;
    const opponent = game.homeTeam.name === player.team ? game.awayTeam.name : game.homeTeam.name;

    return {
      title: `🎯 Assist for ${player.name}!`,
      body: `${seasonStats.points} points in ${seasonStats.gamesPlayed} games vs ${opponent}`,
      icon: '/icons/assist-icon.png',
      data: event,
      tag: `assist-${event.id}`,
      actions: [
        { action: 'view', title: 'View Stats' },
      ],
    };
  }

  private createPenaltyNotification(event: PenaltyEvent): NotificationPayload {
    const { player, infraction, duration } = event;

    return {
      title: `⚠️ Penalty: ${player.name}`,
      body: `${duration} min for ${infraction}`,
      icon: '/icons/penalty-icon.png',
      data: event,
      tag: `penalty-${event.id}`,
    };
  }

  private createMilestoneNotification(event: MilestoneEvent): NotificationPayload {
    const { player, milestone, description, isCareerHigh, divisionRank } = event;

    let body = description;
    if (isCareerHigh) {
      body += ' - CAREER HIGH!';
    }
    if (divisionRank) {
      body += `\n#${divisionRank} in the division`;
    }

    return {
      title: `🎉 MILESTONE! ${player.name}`,
      body: `${milestone}! ${body}`,
      icon: '/icons/milestone-icon.png',
      data: event,
      tag: `milestone-${event.id}`,
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'View Progress' },
        { action: 'share', title: 'Share Achievement' },
      ],
    };
  }

  private createHatTrickNotification(event: HatTrickEvent): NotificationPayload {
    const { player, careerHatTricks } = event;

    return {
      title: `🔥 HAT TRICK! 🔥`,
      body: `${player.name} completes the hat trick!\n${this.ordinal(careerHatTricks)} of their career`,
      icon: '/icons/hat-trick-icon.png',
      data: event,
      tag: `hat-trick-${event.id}`,
      requireInteraction: true,
      actions: [
        { action: 'share', title: 'Share This!' },
        { action: 'view', title: 'View Game' },
      ],
    };
  }

  private createGameStartNotification(event: GameStartEvent): NotificationPayload {
    const { player, game, minutesUntilStart } = event;
    const opponent = game.homeTeam.name === player.team ? game.awayTeam : game.homeTeam;

    return {
      title: `📢 Game Starting Soon`,
      body: `${player.name}'s game starts in ${minutesUntilStart} minutes vs ${opponent.name}`,
      icon: '/icons/game-start-icon.png',
      data: event,
      tag: `game-start-${game.id}`,
    };
  }

  private createGameEndNotification(event: GameEndEvent): NotificationPayload {
    const { player, gameStats, game } = event;
    const win = (game.homeTeam.name === player.team && game.homeTeam.score > game.awayTeam.score) ||
                (game.awayTeam.name === player.team && game.awayTeam.score > game.homeTeam.score);

    return {
      title: `🏒 Game Final`,
      body: `${player.name}: ${gameStats.goals}G, ${gameStats.assists}A\nTap for AI Summary`,
      icon: '/icons/game-end-icon.png',
      data: event,
      tag: `game-end-${game.id}`,
      requireInteraction: true,
      actions: [
        { action: 'summary', title: 'View Summary' },
        { action: 'stats', title: 'Full Stats' },
      ],
    };
  }

  private getVibrationPattern(eventType: HockeyEvent['type']): number[] {
    switch (eventType) {
      case 'goal':
        return [200, 100, 200, 100, 200];
      case 'milestone':
      case 'hat_trick':
        return [300, 100, 300, 100, 300];
      case 'penalty':
        return [100, 50, 100];
      default:
        return [200];
    }
  }

  private ordinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // Clear all listeners (useful for cleanup)
  clearAll() {
    this.listeners.clear();
    this.eventQueue = [];
  }
}

// Export singleton instance
export const eventDispatcher = EventDispatcher.getInstance();

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PresenceService implements OnModuleInit, OnModuleDestroy {
  private readonly sockets = new Map<string, Set<string>>();
  private readonly offlineTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.user.updateMany({
      where: { status: 'ONLINE' },
      data: { status: 'OFFLINE' },
    });
  }

  onModuleDestroy() {
    for (const timer of this.offlineTimers.values()) clearTimeout(timer);
    this.offlineTimers.clear();
  }

  addSocket(userId: string, socketId: string): boolean {
    const pending = this.offlineTimers.get(userId);
    if (pending) {
      clearTimeout(pending);
      this.offlineTimers.delete(userId);
    }

    let set = this.sockets.get(userId);
    if (!set) {
      set = new Set();
      this.sockets.set(userId, set);
    }
    set.add(socketId);
    return set.size === 1 && !pending;
  }

  removeSocket(userId: string, socketId: string): boolean {
    const set = this.sockets.get(userId);
    if (!set) return false;
    set.delete(socketId);
    if (set.size === 0) {
      this.sockets.delete(userId);
      return true;
    }
    return false;
  }

  scheduleOffline(userId: string, onOffline: () => void, delayMs: number) {
    const timer = setTimeout(() => {
      this.offlineTimers.delete(userId);
      if (!this.sockets.has(userId)) onOffline();
    }, delayMs);
    this.offlineTimers.set(userId, timer);
  }

  /** Online = has a socket, or is inside the grace period. */
  onlineUserIds(): string[] {
    return [...new Set([...this.sockets.keys(), ...this.offlineTimers.keys()])];
  }
}
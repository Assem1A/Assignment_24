import { Inject, Injectable } from "@nestjs/common";
import type { RedisClientType } from "@redis/client";
import { Types } from "mongoose";

@Injectable()
export class Redis {
  constructor(
    @Inject("REDIS_CLIENT") private readonly client: RedisClientType
  ) {}

  set = async ({
    key,
    val,
    ttl,
  }: {
    key: string;
    val: number | string;
    ttl?: number;
  }) => {
    if (ttl) {
      return await this.client.set(key, String(val), { EX: ttl });
    }

    return await this.client.set(key, String(val));
  };

  update = async ({
    key,
    val,
    ttl,
  }: {
    key: string;
    val: number | string;
    ttl?: number;
  }) => {
    if (!(await this.client.exists(key))) return 0;

    return await this.set({ key, val, ttl });
  };

  inc = async (key: string) => {
    if (!(await this.client.exists(key))) return 0;

    return await this.client.incr(key);
  };

  get1 = async (key: string) => {
    const data = await this.client.get(key);

    try {
      return JSON.parse(data as string);
    } catch {
      return data;
    }
  };

  TTL = async (key: string) => {
    return await this.client.ttl(key);
  };

  exists = async ({ key }: { key: string }) => {
    return await this.client.exists(key);
  };

  expire = async ({ key, ttl }: { key: string; ttl: number }) => {
    return await this.client.expire(key, ttl);
  };

  mGet = async (keys: string[]) => {
    return await this.client.mGet(keys);
  };

  keys = async (prefix: string) => {
    return await this.client.keys(`${prefix}*`);
  };

  delete1 = async (key: string | string[]) => {
    return await this.client.del(key);
  };

  private socketKey(userId: string | Types.ObjectId) {
    return `user:sockets:${userId.toString()}`;
  }

  addSocket = async (
    userId: string | Types.ObjectId,
    socketId: string
  ) => {
    return await this.client.sAdd(this.socketKey(userId), socketId);
  };

  removeSocket = async (
    userId: string | Types.ObjectId,
    socketId: string
  ) => {
    return await this.client.sRem(this.socketKey(userId), socketId);
  };

  getSockets = async (userId: string | Types.ObjectId) => {
    return await this.client.sMembers(this.socketKey(userId));
  };

  hasSockets = async (userId: string | Types.ObjectId) => {
    return await this.client.sCard(this.socketKey(userId));
  };

  removeUser = async (userId: string | Types.ObjectId) => {
    return await this.client.del(this.socketKey(userId));
  };
}
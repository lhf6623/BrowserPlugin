import { getKeyByVersion } from ".";

const { storage } = chrome;
const { local } = storage;

class Cache {
  data = {};
  baseKey: string;
  storage = storage;
  constructor(key: string) {
    this.baseKey = key;
    // local.clear();
  }
  async getAllLocal() {
    const data = await local.get(this.baseKey);
    return data[this.baseKey] || {};
  }
  async getItem<T>(key: string, defaultData?: any): Promise<T> {
    if (!key) {
      throw new Error(`请传入键值`);
    }
    const data = await this.getAllLocal();
    return data[key] || defaultData;
  }
  async setItem<T>(key: string, value: T) {
    if (!key) {
      throw new Error(`请传入键值`);
    }
    this.data = {
      ...this.data,
      [key]: value,
    };

    let data = await this.getAllLocal();
    data = {
      [this.baseKey]: {
        ...data,
        ...this.data,
      },
    };

    local.set(data);
  }
  removeItem(key: string) {
    if (!key) {
      throw new Error(`请传入键值`);
    }
    local.remove(key);
  }
  clear() {
    local.clear();
  }
}

export const CACHE_KEY = getKeyByVersion("cache");
export default new Cache(CACHE_KEY);

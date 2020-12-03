import { Injectable, Provider, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

interface IStorage {
  setItem<T>(key: string, item: T): T,
  getItem<T>(key: string): T
}


export class StorageService implements IStorage {
  setItem<T>(key, item): T { return item; }
  getItem<T>(key): T { return null; }
}

export function storageFactory(platformId: string): any {
  if (isPlatformBrowser(platformId)) {
    return new BrowserStorage();
  }
  if (isPlatformServer(platformId)) {
    return new ServerStorage();
  }
  throw new Error(`No implementation for this platform: ${platformId}`);
}

export const storageServiceProvider: Provider = {
  provide: StorageService,
  useFactory: storageFactory,
  deps: [PLATFORM_ID]
};

@Injectable()
export class BrowserStorage {
  localeStorage = localStorage;
  setItem<T>(key: string, item: T): T {
    const str = typeof item === 'string' ? item : JSON.stringify(item)
    localStorage.setItem(key, str);
    return item;
  }

  getItem<T>(key: string): T {
    let item;
    const tmp = localStorage.getItem(key);
    if (!tmp) { return null; }
    try {
      item = JSON.parse(tmp);
    } catch {
      item = tmp;
    }
    return item;
  }
}

@Injectable()
export class ServerStorage {
  localeStorage = {
    data: {},
    setItem<T>(key: string, item: T): void {
      this.data[key] = item;
    },
    getItem<T>(key: string): T {
      return this.data[key] as any;
    }
  }

  setItem<T>(key: string, item: T): T {
    localStorage.setItem(key, JSON.stringify(item));
    return item;
  }

  getItem<T>(key: string): T {
    let item;
    const tmp = localStorage.getItem(key);
    if (!tmp) { return null; }
    try {
      item = JSON.parse(tmp) as any;
    } catch {
      item = tmp;
    }
    return item;
  }
}
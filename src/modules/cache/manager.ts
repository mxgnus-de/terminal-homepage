import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { Cache } from '../../types/Cache';

const defaultCache: Cache = {
   github: {
      repositories: [],
      singleRepositories: [],
   },
   lastRevalidation: {
      github: {
         repositories: 0,
         singleRepositories: 0,
      },
   },
};

class CacheManager {
   private cache: Cache = defaultCache;

   constructor() {
      this.loadCache();
   }

   public setCache(cache: (cache: Cache) => Cache | Cache): void {
      if (typeof cache === 'function') {
         this.cache = cache(this.cache);
      } else {
         this.cache = cache;
      }

      this.saveCache();
   }

   public getCache(): Cache {
      return this.cache;
   }

   private getCacheDirPath(): string {
      const dirPath = process.env.VERCEL_ENV
         ? path.join('/tmp')
         : path.join(cwd(), '.cache');

      if (!fs.existsSync(dirPath)) {
         fs.mkdirSync(dirPath);
      }

      return dirPath;
   }

   private getCacheFilePath(): string {
      const filePath = path.join(this.getCacheDirPath(), 'cache.json');

      if (!fs.existsSync(filePath)) {
         fs.writeFileSync(filePath, JSON.stringify(defaultCache));
      }

      return filePath;
   }

   private loadCache(): Cache {
      const cache = JSON.parse(
         fs.readFileSync(this.getCacheFilePath(), 'utf8'),
      );

      this.cache = cache;
      return cache;
   }

   private saveCache(): void {
      fs.writeFileSync(this.getCacheFilePath(), JSON.stringify(this.cache));
   }
}

export default CacheManager;

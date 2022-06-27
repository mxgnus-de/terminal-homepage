import { GithubRepositories, GithubRepository } from './Github';

export interface GithubCache {
   repositories: GithubRepositories;
   singleRepositories: GithubRepository[];
}

export interface LastRevalidationCache {
   github: {
      repositories: number;
      singleRepositories: number;
   };
}

export interface Cache {
   github: GithubCache;
   lastRevalidation: LastRevalidationCache;
}

import axios from 'axios';
import { GITHUB_USERNAME } from '../../config/terminal';
import { GithubRepositories, GithubRepository } from '../../types/Github';
import CacheManager from '../cache/manager';

const cacheManager = new CacheManager();

const GITHUB_BASE_URL = 'https://api.github.com';

export async function getRepos() {
   const cache = cacheManager.getCache();

   if (process.env.NODE_ENV === 'production') {
      if (
         cache.lastRevalidation.github.repositories + 1000 * 60 * 1 <
            Date.now() &&
         cache.github.repositories.length
      ) {
         return cache.github.repositories;
      }
   }

   try {
      const response = await axios.get<GithubRepositories>(
         GITHUB_BASE_URL + '/users/' + GITHUB_USERNAME + '/repos',
      );

      cacheManager.setCache((cache) => ({
         ...cache,
         github: {
            ...cache.github,
            repositories: response.data,
         },
         lastRevalidation: {
            ...cache.lastRevalidation,
            github: {
               ...cache.lastRevalidation.github,
               repositories: Date.now(),
            },
         },
      }));

      return response.data;
   } catch (err) {
      return [];
   }
}

export async function getForkedRepositories(): Promise<GithubRepository[]> {
   const cache = cacheManager.getCache();
   const repositories = await getRepos();

   if (process.env.NODE_ENV === 'production') {
      if (
         cache.lastRevalidation.github.singleRepositories + 1000 * 60 * 1 <
            Date.now() &&
         cache.github.repositories.length
      ) {
         return cache.github.singleRepositories;
      }
   }

   const reposWithForks = repositories.filter((repo) => repo.fork);

   const singleRepos = await Promise.all(
      reposWithForks.map(async (repo) => {
         const response = await axios.get<GithubRepository>(
            GITHUB_BASE_URL + '/repos/' + repo.full_name,
         );

         return response.data;
      }),
   );

   cacheManager.setCache((cache) => ({
      ...cache,
      github: {
         ...cache.github,
         singleRepositories: singleRepos,
      },
      lastRevalidation: {
         ...cache.lastRevalidation,
         github: {
            ...cache.lastRevalidation.github,
            singleRepositories: Date.now(),
         },
      },
   }));

   return singleRepos;
}

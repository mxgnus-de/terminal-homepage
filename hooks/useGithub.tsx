import useSWRImmutable from 'swr/immutable';
import { fetcher } from '../modules/swr';
import { GithubRepositories, GithubRepository } from '../types/Github';

function useGithub(): {
   repositories: GithubRepositories;
   forkedRepositories: GithubRepository[];
} {
   const { data: repoData, error: repoError } = useSWRImmutable(
      '/api/github/repos',
      fetcher,
   );
   const { data: forkedReposData, error: forkedReposError } = useSWRImmutable(
      '/api/github/forked-repos',
      fetcher,
   );

   return {
      repositories: repoError ? [] : repoData,
      forkedRepositories: forkedReposError ? [] : forkedReposData,
   };
}

export default useGithub;

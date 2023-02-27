import { Endpoints } from '@octokit/types';

export type GithubRepositories =
   Endpoints['GET /users/{username}/repos']['response']['data'];
export type GithubRepository =
   Endpoints['GET /repos/{owner}/{repo}']['response']['data'];

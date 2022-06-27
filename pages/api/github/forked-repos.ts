import { NextApiRequest, NextApiResponse } from 'next';
import { getForkedRepositories, getRepos } from '../../../modules/github';

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   const forkedRepositories = await getForkedRepositories();

   return res.status(200).json(forkedRepositories);
}

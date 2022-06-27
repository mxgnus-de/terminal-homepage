import { NextApiRequest, NextApiResponse } from 'next';
import { getRepos } from '../../../modules/github';

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse,
) {
   const repositories = await getRepos();

   return res.status(200).json(repositories);
}

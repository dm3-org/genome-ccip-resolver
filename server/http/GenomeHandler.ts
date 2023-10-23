
import { ethers } from 'ethers';

import express from 'express';
import { PublicResolver, PublicResolver__factory } from "../../typechain";
import { handleGenomeCcipRequest } from "./handleGenomeCcipRequest";

export function GenomeHandler(provider: ethers.providers.StaticJsonRpcProvider, l2ResolverAddress: string) {

    const router = express.Router();
    const publicResolver = new ethers.Contract(
        l2ResolverAddress,
        PublicResolver__factory.abi,
        provider
    ) as PublicResolver

    router.get(
        '/:resolverAddr/:calldata',
        async (
            req: express.Request,
            res: express.Response,
        ) => {
            const calldata = req.params.calldata.replace('.json', '');
            try {
                const response = await handleGenomeCcipRequest(publicResolver, calldata);

                if (!response) {
                    return res.status(404).send({ message: `unsupported signature` });
                }

                res.status(200).send(response);
            } catch (e) {
                req.app.locals.logger.warn((e as Error).message);
                res.status(400).send({ message: 'Unknown error' });
            }
        },
    );
    return router;
}

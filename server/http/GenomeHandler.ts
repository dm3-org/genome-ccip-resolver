
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

    router.get("/helloGenome", async (req: express.Request, res: express.Response) => {
        return await res.status(200).send("Hello Genome");
    })
 
    router.get(
        '/:resolverAddr/:calldata',
        async (
            req: express.Request,
            res: express.Response,
        ) => {
            const calldata = req.params.calldata.replace('.json', '');
            try {
                const response = await handleGenomeCcipRequest(publicResolver, calldata);
                console.log("handler response", response);

                if (!response) {
                    return res.status(200).send("0x");
                }
                return res.status(200).send(response);

            } catch (e) {
                req.app.locals.logger.warn((e as Error).message);
                res.status(400).send({ message: 'Unknown error' });
            }
        },
    );
    return router;
}

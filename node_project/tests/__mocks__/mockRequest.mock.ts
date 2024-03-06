import { Request } from 'express';
import { Params } from 'express-serve-static-core';

export const makeMockRequest = ({ params, query, headers, body }: { params?: Params; query?: Params; headers?: Params; body?: Object }): Request => {
    const request = {
        body: body || {},
        params: params || {},
        query: query || {},
        headers: headers || {},
    }

    return request as Request;
};
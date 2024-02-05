import { Request } from 'express';
import { Params } from 'express-serve-static-core';

export const makeMockRequest = ({ params, query, headers }: { params?: Params; query?: Params; headers?: Params }): Request => {
    const request = {
        params: params || {},
        query: query || {},
        headers: headers || {},
    }

    return request as Request;
};
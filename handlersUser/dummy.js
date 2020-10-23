import { handler } from 'blob-common/core/handler';

export const main = handler(async (event, context) => {
    return JSON.stringify(event, null, 2);
});
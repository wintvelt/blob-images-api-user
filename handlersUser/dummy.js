import { handler } from 'blob-common/core/handler';

export const main = handler(async (event, context) => {
    return event;
});
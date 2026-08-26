import type { Handle } from '@sveltejs/kit';
import { getSessionUser } from './lib/server/services/session.ts';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = await getSessionUser(event.cookies);

	return resolve(event);
};
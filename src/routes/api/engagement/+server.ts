import { json } from '@sveltejs/kit';
import { toggleEngagement, type EngagementKind } from '$lib/server/db';
import type { RequestHandler } from './$types';

const VALID_KINDS: EngagementKind[] = ['rsvp', 'join', 'vote'];

// POST /api/engagement  { kind, target, choice? }
// מפעיל/מכבה מעורבות למשתמש המחובר. מחזיר את המצב החדש.
export const POST: RequestHandler = async (event) => {
    const session = await event.locals.auth();
    if (!session?.user) {
        return json({ success: false, needLogin: true, message: 'יש להתחבר' }, { status: 401 });
    }

    let body: { kind?: string; target?: string; choice?: string };
    try {
        body = await event.request.json();
    } catch {
        return json({ success: false, message: 'נתונים לא תקינים' }, { status: 400 });
    }

    const kind = body.kind as EngagementKind;
    const target = (body.target ?? '').trim();
    const choice = (body.choice ?? '').trim();

    if (!VALID_KINDS.includes(kind) || !target) {
        return json({ success: false, message: 'בקשה לא תקינה' }, { status: 400 });
    }

    try {
        const result = await toggleEngagement(session.user.id as string, kind, target, choice);
        return json({ success: true, ...result });
    } catch (e) {
        console.error('[api/engagement] toggle failed:', e);
        return json({ success: false, message: 'הפעולה נכשלה' }, { status: 500 });
    }
};

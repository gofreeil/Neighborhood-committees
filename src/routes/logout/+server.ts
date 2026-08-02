import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * יעד היציאה. Auth.js כבר מחק את עוגיית הסשן שלו לפני ההפניה לכאן,
 * ונשאר לנקות את הטוקן של Strapi - כל server action קוראת אותו ישירות
 * מהעוגייה, ולכן בלי המחיקה המשתמש היה ממשיך לפעול בשם עצמו אחרי היציאה.
 */
export const GET: RequestHandler = async ({ cookies }) => {
    cookies.delete('strapi_jwt', { path: '/' });
    throw redirect(303, '/');
};

import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { listMealPlan } from "../../lib/server/repositories/mealPlanRepository.ts";

function mondayOf(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.user) throw redirect(303, "/login");
  const requested = url.searchParams.get("week");
  const weekStart =
    requested && /^\d{4}-\d{2}-\d{2}$/.test(requested)
      ? requested
      : mondayOf(new Date());

  const entries = await listMealPlan(locals.user.id, weekStart);

  const prev = new Date(weekStart);
  prev.setDate(prev.getDate() - 7);
  const next = new Date(weekStart);
  next.setDate(next.getDate() + 7);

  return {
    weekStart,
    entries,
    prevWeek: prev.toISOString().slice(0, 10),
    nextWeek: next.toISOString().slice(0, 10),
  }
};

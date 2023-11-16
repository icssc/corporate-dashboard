import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, params: { selectedMember } }) => {
  const session = await locals.auth.validate();
  const { userId, role, name } = session?.user ?? {};
  return { userId, role, name, selectedMember };
};

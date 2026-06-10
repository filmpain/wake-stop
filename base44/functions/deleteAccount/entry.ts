import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all of the user's data first
    const [favs, sessions, settingsRows] = await Promise.all([
      base44.asServiceRole.entities.FavoriteStop.filter({ created_by: user.email }),
      base44.asServiceRole.entities.RideSession.filter({ created_by: user.email }),
      base44.asServiceRole.entities.UserSettings.filter({ created_by: user.email }),
    ]);
    await Promise.all([
      ...favs.map((f) => base44.asServiceRole.entities.FavoriteStop.delete(f.id)),
      ...sessions.map((s) => base44.asServiceRole.entities.RideSession.delete(s.id)),
      ...settingsRows.map((s) => base44.asServiceRole.entities.UserSettings.delete(s.id)),
    ]);

    // Delete the user account itself
    await base44.asServiceRole.entities.User.delete(user.id);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
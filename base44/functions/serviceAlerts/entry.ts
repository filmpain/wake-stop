// Fetch active NYC MTA service alerts (subway + bus) and return simplified JSON.
// Called from the frontend with optional { routes: ['Q','N','M15'] } to filter.
// Uses MTA's public GTFS-Realtime "Service Alerts" feeds in JSON form (no API key needed).
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SUBWAY_ALERTS_URL =
  'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json';
const BUS_ALERTS_URL =
  'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fbus-alerts.json';

// Pull a human-readable string out of GTFS-RT translated-string objects.
function text(translated) {
  const t = translated?.translation;
  if (Array.isArray(t) && t.length > 0) {
    const en = t.find((x) => (x.language || 'en').startsWith('en')) || t[0];
    return en?.text || '';
  }
  return '';
}

// Is the alert active right now (within any active_period window)?
function isActiveNow(alert) {
  const periods = alert?.active_period;
  if (!Array.isArray(periods) || periods.length === 0) return true;
  const now = Math.floor(Date.now() / 1000);
  return periods.some((p) => {
    const start = p.start ? Number(p.start) : 0;
    const end = p.end ? Number(p.end) : Infinity;
    return now >= start && now <= end;
  });
}

async function fetchFeed(url) {
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data?.entity || [];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let routes = [];
    try {
      const body = await req.json();
      routes = Array.isArray(body?.routes) ? body.routes.map((r) => String(r).toUpperCase()) : [];
    } catch {
      routes = [];
    }

    const [subwayEntities, busEntities] = await Promise.all([
      fetchFeed(SUBWAY_ALERTS_URL),
      fetchFeed(BUS_ALERTS_URL),
    ]);

    const all = [...subwayEntities, ...busEntities];
    const alerts = [];

    for (const entity of all) {
      const alert = entity?.alert;
      if (!alert) continue;
      if (!isActiveNow(alert)) continue;

      // Routes affected by this alert
      const affected = (alert.informed_entity || [])
        .map((ie) => ie.route_id)
        .filter(Boolean)
        .map((r) => String(r).toUpperCase());

      // Specific stops affected by this alert (used for segment filtering on the client)
      const stopIds = (alert.informed_entity || [])
        .map((ie) => ie.stop_id)
        .filter(Boolean)
        .map((s) => String(s));

      alerts.push({
        id: entity.id || '',
        header: text(alert.header_text),
        description: text(alert.description_text),
        routes: [...new Set(affected)],
        stop_ids: [...new Set(stopIds)],
      });
    }

    // Filter to the requested routes if provided
    const filtered = routes.length
      ? alerts.filter((a) => a.routes.some((r) => routes.includes(r)))
      : alerts;

    return Response.json({ count: filtered.length, alerts: filtered });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
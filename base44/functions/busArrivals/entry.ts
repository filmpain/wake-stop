// Fetch real-time bus arrivals at a specific MTA stop using MTA Bus Time SIRI API.
// Called from the frontend with { stop_id: 'MTA_400069' }.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stop_id } = await req.json();
    if (!stop_id) {
      return Response.json({ error: 'Missing stop_id' }, { status: 400 });
    }

    const apiKey = Deno.env.get('MTA_BUS_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'MTA_BUS_API_KEY not configured' }, { status: 500 });
    }

    // MTA Bus Time stop monitoring endpoint
    const url = `https://bustime.mta.info/api/siri/stop-monitoring.json?key=${apiKey}&MonitoringRef=${encodeURIComponent(stop_id)}&MaximumNumberOfCallsOnwards=3`;
    const res = await fetch(url);
    if (!res.ok) {
      return Response.json({ error: `MTA API ${res.status}` }, { status: 502 });
    }
    const data = await res.json();

    const delivery = data?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0];
    const visits = delivery?.MonitoredStopVisit || [];

    const arrivals = visits.map(v => {
      const j = v?.MonitoredVehicleJourney || {};
      const call = j?.MonitoredCall || {};
      return {
        route: j?.PublishedLineName || j?.LineRef || 'BUS',
        destination: j?.DestinationName || '',
        stops_away: call?.NumberOfStopsAway ?? null,
        expected_arrival: call?.ExpectedArrivalTime || null,
        vehicle_lat: j?.VehicleLocation?.Latitude ?? null,
        vehicle_lon: j?.VehicleLocation?.Longitude ?? null,
      };
    });

    return Response.json({ stop_id, arrivals });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
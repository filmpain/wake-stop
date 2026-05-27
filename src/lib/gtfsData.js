// Curated NYC MTA subway stops + popular bus stops.
// Sourced from MTA GTFS static feed (subway is open data, no API key required).
// This is a focused subset of high-traffic stops to keep the app fast.

export const SUBWAY_STOPS = [
  // 1/2/3 line
  { stop_id: '120', stop_name: 'Times Sq-42 St', routes: ['1','2','3','7','N','Q','R','W','S'], stop_lat: 40.75529, stop_lon: -73.987495 },
  { stop_id: '127', stop_name: '34 St-Penn Station', routes: ['1','2','3'], stop_lat: 40.750373, stop_lon: -73.991057 },
  { stop_id: '128', stop_name: '28 St', routes: ['1'], stop_lat: 40.747215, stop_lon: -73.993365 },
  { stop_id: '129', stop_name: '23 St', routes: ['1'], stop_lat: 40.744081, stop_lon: -73.995657 },
  { stop_id: '132', stop_name: 'Christopher St-Sheridan Sq', routes: ['1'], stop_lat: 40.733422, stop_lon: -74.002906 },
  { stop_id: '137', stop_name: 'South Ferry', routes: ['1'], stop_lat: 40.701411, stop_lon: -74.013205 },
  { stop_id: '117', stop_name: '72 St', routes: ['1','2','3'], stop_lat: 40.778453, stop_lon: -73.98197 },
  { stop_id: '116', stop_name: '79 St', routes: ['1'], stop_lat: 40.78386, stop_lon: -73.979993 },
  { stop_id: '115', stop_name: '86 St', routes: ['1'], stop_lat: 40.788644, stop_lon: -73.976218 },
  { stop_id: '114', stop_name: '96 St', routes: ['1','2','3'], stop_lat: 40.793919, stop_lon: -73.972323 },
  { stop_id: '101', stop_name: 'Van Cortlandt Park-242 St', routes: ['1'], stop_lat: 40.889248, stop_lon: -73.898583 },

  // 4/5/6 line
  { stop_id: '631', stop_name: 'Grand Central-42 St', routes: ['4','5','6','7','S'], stop_lat: 40.751776, stop_lon: -73.976848 },
  { stop_id: '629', stop_name: '51 St', routes: ['6'], stop_lat: 40.757107, stop_lon: -73.97192 },
  { stop_id: '628', stop_name: '59 St', routes: ['4','5','6'], stop_lat: 40.762526, stop_lon: -73.967967 },
  { stop_id: '627', stop_name: '68 St-Hunter College', routes: ['6'], stop_lat: 40.768141, stop_lon: -73.96387 },
  { stop_id: '626', stop_name: '77 St', routes: ['6'], stop_lat: 40.77362, stop_lon: -73.959874 },
  { stop_id: '625', stop_name: '86 St', routes: ['4','5','6'], stop_lat: 40.779492, stop_lon: -73.955589 },
  { stop_id: '624', stop_name: '96 St', routes: ['6'], stop_lat: 40.785672, stop_lon: -73.95107 },
  { stop_id: '635', stop_name: '14 St-Union Sq', routes: ['4','5','6','L','N','Q','R','W'], stop_lat: 40.734673, stop_lon: -73.989951 },
  { stop_id: '636', stop_name: 'Astor Pl', routes: ['6'], stop_lat: 40.730054, stop_lon: -73.991073 },
  { stop_id: '637', stop_name: 'Bleecker St', routes: ['6'], stop_lat: 40.725915, stop_lon: -73.994659 },
  { stop_id: '640', stop_name: 'Brooklyn Bridge-City Hall', routes: ['4','5','6'], stop_lat: 40.713065, stop_lon: -74.004131 },

  // N/Q/R/W
  { stop_id: 'R16', stop_name: 'Times Sq-42 St', routes: ['N','Q','R','W'], stop_lat: 40.754672, stop_lon: -73.986754 },
  { stop_id: 'R17', stop_name: '34 St-Herald Sq', routes: ['B','D','F','M','N','Q','R','W'], stop_lat: 40.749567, stop_lon: -73.987950 },
  { stop_id: 'R20', stop_name: '14 St-Union Sq', routes: ['L','N','Q','R','W','4','5','6'], stop_lat: 40.735736, stop_lon: -73.990568 },
  { stop_id: 'R23', stop_name: 'Canal St', routes: ['N','Q','R','W'], stop_lat: 40.718803, stop_lon: -74.000193 },
  { stop_id: 'R30', stop_name: 'DeKalb Av', routes: ['B','D','N','Q','R','W'], stop_lat: 40.690635, stop_lon: -73.981824 },
  { stop_id: 'R32', stop_name: 'Atlantic Av-Barclays Ctr', routes: ['B','D','N','Q','R','W','2','3','4','5'], stop_lat: 40.683666, stop_lon: -73.97881 },
  { stop_id: 'D24', stop_name: '7 Av', routes: ['B','Q'], stop_lat: 40.677202, stop_lon: -73.972325 },
  { stop_id: 'D25', stop_name: 'Prospect Park', routes: ['B','Q','S'], stop_lat: 40.661614, stop_lon: -73.962246 },
  { stop_id: 'D27', stop_name: 'Church Av', routes: ['B','Q'], stop_lat: 40.650527, stop_lon: -73.962982 },
  { stop_id: 'D29', stop_name: 'Cortelyou Rd', routes: ['Q'], stop_lat: 40.640927, stop_lon: -73.963891 },
  { stop_id: 'D31', stop_name: 'Avenue H', routes: ['Q'], stop_lat: 40.629755, stop_lon: -73.961639 },
  { stop_id: 'D32', stop_name: 'Avenue J', routes: ['Q'], stop_lat: 40.625039, stop_lon: -73.960803 },
  { stop_id: 'D33', stop_name: 'Avenue M', routes: ['Q'], stop_lat: 40.617618, stop_lon: -73.959399 },
  { stop_id: 'D34', stop_name: 'Kings Hwy', routes: ['Q'], stop_lat: 40.608382, stop_lon: -73.957632 },
  { stop_id: 'D35', stop_name: 'Avenue U', routes: ['Q'], stop_lat: 40.599231, stop_lon: -73.955910 },
  { stop_id: 'D40', stop_name: 'Coney Island-Stillwell Av', routes: ['D','F','N','Q'], stop_lat: 40.577422, stop_lon: -73.981233 },

  // L line
  { stop_id: 'L01', stop_name: '8 Av', routes: ['L'], stop_lat: 40.739777, stop_lon: -74.002578 },
  { stop_id: 'L02', stop_name: '6 Av', routes: ['L'], stop_lat: 40.737335, stop_lon: -73.996786 },
  { stop_id: 'L03', stop_name: 'Union Sq-14 St', routes: ['L','4','5','6','N','Q','R','W'], stop_lat: 40.734789, stop_lon: -73.99073 },
  { stop_id: 'L05', stop_name: '1 Av', routes: ['L'], stop_lat: 40.730953, stop_lon: -73.981628 },
  { stop_id: 'L06', stop_name: 'Bedford Av', routes: ['L'], stop_lat: 40.717304, stop_lon: -73.956872 },
  { stop_id: 'L08', stop_name: 'Lorimer St', routes: ['L'], stop_lat: 40.714063, stop_lon: -73.950275 },
  { stop_id: 'L10', stop_name: 'Graham Av', routes: ['L'], stop_lat: 40.714565, stop_lon: -73.944053 },
  { stop_id: 'L11', stop_name: 'Grand St', routes: ['L'], stop_lat: 40.711926, stop_lon: -73.940373 },
  { stop_id: 'L12', stop_name: 'Montrose Av', routes: ['L'], stop_lat: 40.707739, stop_lon: -73.939822 },
  { stop_id: 'L13', stop_name: 'Morgan Av', routes: ['L'], stop_lat: 40.706152, stop_lon: -73.93312 },
  { stop_id: 'L14', stop_name: 'Jefferson St', routes: ['L'], stop_lat: 40.706607, stop_lon: -73.922692 },
  { stop_id: 'L15', stop_name: 'DeKalb Av', routes: ['L'], stop_lat: 40.703811, stop_lon: -73.918425 },
  { stop_id: 'L16', stop_name: 'Myrtle-Wyckoff Avs', routes: ['L','M'], stop_lat: 40.699814, stop_lon: -73.911441 },

  // A/C/E
  { stop_id: 'A24', stop_name: '59 St-Columbus Circle', routes: ['A','B','C','D','1'], stop_lat: 40.768296, stop_lon: -73.981736 },
  { stop_id: 'A27', stop_name: '42 St-Port Authority Bus Term', routes: ['A','C','E'], stop_lat: 40.757308, stop_lon: -73.989735 },
  { stop_id: 'A28', stop_name: '34 St-Penn Station', routes: ['A','C','E'], stop_lat: 40.752287, stop_lon: -73.993391 },
  { stop_id: 'A31', stop_name: '14 St', routes: ['A','C','E','L'], stop_lat: 40.74028, stop_lon: -74.002578 },
  { stop_id: 'A32', stop_name: 'W 4 St-Wash Sq', routes: ['A','B','C','D','E','F','M'], stop_lat: 40.732338, stop_lon: -74.000495 },
  { stop_id: 'A38', stop_name: 'Fulton St', routes: ['A','C','J','Z','2','3','4','5'], stop_lat: 40.710374, stop_lon: -74.00913 },

  // 7 line (Queens)
  { stop_id: '707', stop_name: 'Grand Central-42 St', routes: ['7','S','4','5','6'], stop_lat: 40.751431, stop_lon: -73.976041 },
  { stop_id: '710', stop_name: 'Queensboro Plaza', routes: ['7','N','W'], stop_lat: 40.750582, stop_lon: -73.940202 },
  { stop_id: '712', stop_name: 'Court Sq', routes: ['7','E','G','M'], stop_lat: 40.747846, stop_lon: -73.945046 },
  { stop_id: '719', stop_name: '74 St-Broadway', routes: ['7','E','F','M','R'], stop_lat: 40.74686, stop_lon: -73.891394 },
  { stop_id: '726', stop_name: 'Flushing-Main St', routes: ['7'], stop_lat: 40.7596, stop_lon: -73.83003 },

  // G line
  { stop_id: 'G22', stop_name: 'Court Sq', routes: ['G','7','E','M'], stop_lat: 40.746554, stop_lon: -73.943832 },
  { stop_id: 'G26', stop_name: 'Greenpoint Av', routes: ['G'], stop_lat: 40.731352, stop_lon: -73.954449 },
  { stop_id: 'G28', stop_name: 'Nassau Av', routes: ['G'], stop_lat: 40.724635, stop_lon: -73.951277 },
  { stop_id: 'G29', stop_name: 'Metropolitan Av', routes: ['G','L'], stop_lat: 40.71286, stop_lon: -73.951418 },
  { stop_id: 'G33', stop_name: 'Bedford-Nostrand Avs', routes: ['G'], stop_lat: 40.689627, stop_lon: -73.953522 },
  { stop_id: 'G36', stop_name: 'Fulton St', routes: ['G'], stop_lat: 40.687119, stop_lon: -73.975375 },
];

// Curated NYC MTA bus stops (popular routes). Real bus data is fetched live from MTA Bus Time API.
export const BUS_STOPS = [
  { stop_id: 'MTA_400069', stop_name: '1 AV/E 14 ST', routes: ['M15','M15-SBS'], stop_lat: 40.73199, stop_lon: -73.981499 },
  { stop_id: 'MTA_400070', stop_name: '1 AV/E 23 ST', routes: ['M15','M15-SBS'], stop_lat: 40.738197, stop_lon: -73.977974 },
  { stop_id: 'MTA_400071', stop_name: '1 AV/E 34 ST', routes: ['M15','M15-SBS'], stop_lat: 40.745781, stop_lon: -73.972535 },
  { stop_id: 'MTA_400072', stop_name: '1 AV/E 42 ST', routes: ['M15','M15-SBS'], stop_lat: 40.751405, stop_lon: -73.968487 },
  { stop_id: 'MTA_400073', stop_name: '1 AV/E 57 ST', routes: ['M15','M15-SBS'], stop_lat: 40.761733, stop_lon: -73.960979 },
  { stop_id: 'MTA_400074', stop_name: '1 AV/E 72 ST', routes: ['M15','M15-SBS'], stop_lat: 40.769872, stop_lon: -73.955069 },
  { stop_id: 'MTA_400075', stop_name: '1 AV/E 86 ST', routes: ['M15','M15-SBS'], stop_lat: 40.778571, stop_lon: -73.948746 },
  { stop_id: 'MTA_400076', stop_name: '1 AV/E 96 ST', routes: ['M15','M15-SBS'], stop_lat: 40.785822, stop_lon: -73.943476 },
  { stop_id: 'MTA_401000', stop_name: 'BROADWAY/W 96 ST', routes: ['M104','M96','M106'], stop_lat: 40.793715, stop_lon: -73.972376 },
  { stop_id: 'MTA_401001', stop_name: 'BROADWAY/W 110 ST', routes: ['M104','M4'], stop_lat: 40.804138, stop_lon: -73.96581 },
  { stop_id: 'MTA_401002', stop_name: 'BROADWAY/W 125 ST', routes: ['M104','M60-SBS'], stop_lat: 40.81947, stop_lon: -73.957009 },
  { stop_id: 'MTA_403000', stop_name: 'FLATBUSH AV/CHURCH AV', routes: ['B41','B35'], stop_lat: 40.650313, stop_lon: -73.961982 },
  { stop_id: 'MTA_403001', stop_name: 'FLATBUSH AV/BEVERLEY RD', routes: ['B41'], stop_lat: 40.644495, stop_lon: -73.958769 },
  { stop_id: 'MTA_403002', stop_name: 'FLATBUSH AV/AVENUE H', routes: ['B41'], stop_lat: 40.629945, stop_lon: -73.953002 },
  { stop_id: 'MTA_404000', stop_name: 'FORDHAM RD/GRAND CONCOURSE', routes: ['Bx12','Bx12-SBS','Bx9'], stop_lat: 40.861813, stop_lon: -73.898896 },
  { stop_id: 'MTA_404001', stop_name: 'FORDHAM RD/WEBSTER AV', routes: ['Bx12','Bx12-SBS','Bx41'], stop_lat: 40.862488, stop_lon: -73.892268 },
  { stop_id: 'MTA_405000', stop_name: '34 ST/5 AV', routes: ['M34-SBS','Q32'], stop_lat: 40.748321, stop_lon: -73.984783 },
  { stop_id: 'MTA_405001', stop_name: '34 ST/3 AV', routes: ['M34-SBS'], stop_lat: 40.746368, stop_lon: -73.979229 },
  { stop_id: 'MTA_405002', stop_name: '34 ST/1 AV', routes: ['M34-SBS'], stop_lat: 40.74438, stop_lon: -73.974055 },
];

// Build a single searchable index
export const ALL_STOPS = [
  ...SUBWAY_STOPS.map(s => ({ ...s, stop_type: 'subway' })),
  ...BUS_STOPS.map(s => ({ ...s, stop_type: 'bus' })),
];

export function searchStops(query, limit = 25) {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const results = ALL_STOPS.filter(stop => {
    if (stop.stop_name.toLowerCase().includes(q)) return true;
    if (stop.routes.some(r => r.toLowerCase().includes(q))) return true;
    return false;
  });
  return results.slice(0, limit);
}

export function findStopById(stopId) {
  return ALL_STOPS.find(s => s.stop_id === stopId);
}
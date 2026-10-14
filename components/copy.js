// Site-specific prose that used to be hardcoded in the department template.
// Every value can be overridden from dept.json under `copy`; the defaults are
// the Paw Paw Fire Department's own wording, so Paw Paw's output is unchanged.
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
export function words(n) {
  if (typeof n !== 'number' || n < 0 || n > 99 || n !== Math.floor(n)) return String(n);
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function copy(d) {
  const c = d.copy || {};
  const place = c.place ?? d.address?.city ?? 'Paw Paw';
  const short = d.short ?? c.short ?? `${place} Fire`;
  const county = c.county ?? 'Van Buren County';
  const state_name = c.state_name ?? 'Michigan';
  const station_label = c.station_label ?? d.station?.name ?? `Station ${d.radio}`;
  const n = d.stats?.members;
  const members_word = c.members_word ?? cap(words(n ?? 41));
  const map = c.map !== false && !(d.district && d.district.map === false);
  return {
    place, short, county, state_name, station_label, members_word, map,
    title_suffix: c.title_suffix ?? `${place}, ${state_name}`,
    territory: c.territory ?? 'the Village of Paw Paw and the townships of Paw Paw, Antwerp, Waverly and Almena',
    territory_long: c.territory_long ?? `The Village of Paw Paw, the county seat, and Paw Paw, Antwerp and Waverly Townships, with Almena Township under contract: about ${d.district?.area_sq_mi} square miles of town, farms, vineyards and lake country in the middle of Van Buren County. A Fire Board with one member from each participating municipality oversees the department.`,
    district_title: c.district_title ?? 'Five communities, one department',
    district_name: c.district_name ?? `${place} Fire District`,
    board_title: c.board_title ?? `The ${place} Fire Board`,
    board_source_note: c.board_source_note ?? "Board membership as listed on the department's previous website; to be confirmed.",
    map_note: c.map_note ?? 'The district in red; Almena Township, by contract, in lighter red; the Village of Paw Paw outlined. Boundaries from the U.S. Census Bureau.',
    hero_h1: c.hero_h1 ?? `${place} needs firefighters.`,
    hero_lede: c.hero_lede ?? `${members_word} of your neighbors answer about three hundred calls a year, at any hour, for nothing but the work itself. We train you. We outfit you. We need you.`,
    call_door: c.call_door ?? `${members_word} pagers, a drive to the station, and the first rig out. Why a volunteer response takes the minutes it takes.`,
    about_lede: c.about_lede ?? "Paw Paw's business district burned three times before twenty-two men formed Fire Company No. 1 in September 1868. The department has been volunteer, and busy, ever since.",
    about_meta: c.about_meta ?? `The ${d.name}: organized as Paw Paw Fire Company No. 1 in 1868, all-volunteer ever since, serving five communities in Van Buren County from Station 1200. History, leadership, the Fire Board, and the station.`,
    station_photo_alt: c.station_photo_alt ?? `The members of the department in front of the apparatus bays of ${station_label}.`,
    station_photo_caption: c.station_photo_caption ?? 'Station 1200, South Gremps Street, with the department in front of the bays, 2021.',
    mission: c.mission ?? `To protect lives and property from fire and other emergencies, inside the ${place} Fire District or wherever we are dispatched on alarm.`,
    dispatch: c.dispatch ?? `${county} Central Dispatch`,
    ems: c.ems ?? 'Van Buren EMS',
    first_rig: c.first_rig ?? 'Usually an engine with the first three or four members, then the ladder, the tanker and the squad as more arrive. Lawton, Decatur and other county departments are paged for working fires.',
    no_one_in_station: c.no_one_in_station ?? `${place} has no one sitting in the station. Our firefighters are at work, at dinner, asleep. The tones reach every member at once, and the ones who can go, go.`,
    burn_authority: c.burn_authority ?? 'Michigan DNR',
    burn_rule: c.burn_rule ?? 'Each township sets its own burning rules, and the Michigan DNR governs open burning. Check with your township office before you burn, and never on a windy day.',
    burn_rule_short: c.burn_rule_short ?? 'Check the banner at the top of this site and your township office. Michigan DNR permits for open burning. Never on a windy day. A hose or bucket within reach.',
    join_lede: c.join_lede ?? `Every firefighter in ${place} is a volunteer with a job, a family and a pager. Most of them had never been inside a fire station before they walked into this one.`,
    live_here: c.live_here ?? "You respond from home or work, so you need to be in or near the Village of Paw Paw or Paw Paw, Antwerp, Waverly or Almena Townships. Ask us if you're on the edge.",
    cert_name: c.cert_name ?? 'Michigan Firefighter I and II',
    apparatus_lede: c.apparatus_lede ?? 'Most of the district has no hydrants, so the water rides with us: two engines, a tanker, a ladder, a rescue squad, two grass rigs, and a 1948 pumper that still runs.',
    apparatus_note: c.apparatus_note ?? "Specifications carried over from the department's previous website; the department to confirm, and to add the new truck approved in 2026.",
    station_title: c.station_title ?? 'A new house for an old company',
    rigs_title: c.rigs_title ?? 'Eight rigs, one of them from 1948',
    memorial_door: c.memorial_door ?? (d.lodd && d.lodd[0] ? `The members we have lost, and ${d.lodd[0].name}, who died in the line of duty on ${new Date(d.lodd[0].died + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.` : 'The members we have lost.'),
    station_where: c.station_where ?? ', on the south side of the village',
    cert_short: c.cert_short ?? 'Firefighter I and II',
    cert_text: c.cert_text ?? 'Michigan Firefighter I and II certification through the state training council, taught locally over a series of evenings and weekends. The department will explain how it is paid for. You bring the hours.',
    cert_step: c.cert_step ?? 'The Michigan certification course, evenings and weekends over several months, with the department beside you.',
    heritage: c.heritage ?? 'A seat on a rig that is still doing what Paw Paw Fire Company No. 1 set out to do in 1868.',
    address_placeholder: c.address_placeholder ?? 'S. Gremps St., Village of Paw Paw',
    honorary: c.honorary ?? 'The department keeps honorary membership for those who have given their years and stepped back, two honorary officers and more than thirty honorary members, and it presents the Van Buren County Judges Award each year, a tradition going back to 1961. Both lists will be carried onto this page once the department has confirmed them.',
    schools: c.schools ?? 'Paw Paw, Mattawan or Lawton',
    squad_caption: c.squad_caption ?? 'Squad 1206 set up for a prevention event, junior helmets at the ready.',
    join_caption: c.join_caption ?? 'Members of the department, and a friend, in front of an engine.',
    community_caption: c.community_caption ?? "Kyle Richardson with residents in the station's community room.",
    contact_caption: c.contact_caption ?? 'Somebody is usually watching the door.',
    responses_caption: c.responses_caption ?? 'A structure fire at night in the district.',
    apparatus_h1: c.apparatus_h1 ?? 'Eight rigs. All of them earn their keep.',
    apparatus_link: c.apparatus_link ?? 'All eight, with the specs',
    support_h1: c.support_h1 ?? 'The rigs are paid for. The rest is us.',
    members_lede: c.members_lede ?? `${d.stats?.officers} officers, ${d.stats?.firefighters} firefighters and ${d.stats?.juniors} junior members, every one of them a volunteer. Some have been on the department for more than fifty years.`,
    community_door: c.community_door ?? 'Knox Box, hydrants, station tours, burning questions, what to do after a fire, how to get an incident report.',
    footer_kind: c.footer_kind ?? 'An all-volunteer department',
    members_label: c.members_label ?? 'Volunteer members',
    last_team: c.last_team ?? `${state_name}'s Local Assistance State Team`,
    apparatus_meta: c.apparatus_meta ?? "The Paw Paw Fire Department's rigs: Engines 1201 and 1202, Ladder 1203, Tanker 1205, Squad 1206, two grass rigs, and Ole 3, the department's 1948 front-mount pumper.",
    news_meta: c.news_meta ?? `News from the ${d.name} and upcoming public events: training nights, Fire Board meetings, Fire Prevention Week, the open house, and the annual awards dinner.`,
    community_meta: c.community_meta ?? `For ${place} residents and businesses: Knox Box, fire hydrant rules, station tours, Fire Prevention Week, what to do after a fire, incident reports, and answers to common questions.`,
    members_meta: c.members_meta ?? `The people of the ${d.name}: ${n ?? 41} volunteers, the chief's officers, the captains of each rig, the honor guard, and the honorary members who served before them.`,
    members_h1: c.members_h1 ?? `${members_word} neighbors with pagers.`,
    home_meta: c.home_meta ?? `${d.name}: an all-volunteer fire department serving the Village of Paw Paw and Paw Paw, Antwerp, Waverly and Almena Townships in Van Buren County, Michigan, since ${d.founded}. Join us. Non-emergency ${d.phones?.station}.`,
    // Home-page feature block. `feature: null` hides it; an object replaces it.
    feature: d.feature === undefined ? {
      kicker: '2026 Firefighter of the Year', title: 'Kyle Richardson',
      text: 'Chief from October 2024 until the awards banquet on October 1, 2026, when he handed the department to new Chief Nate Jackson and was named Firefighter of the Year by his own members. A member since 2010, and the third generation of his family to serve Paw Paw.',
      href: '/news/', link_label: 'The awards banquet',
    } : d.feature,
  };
}

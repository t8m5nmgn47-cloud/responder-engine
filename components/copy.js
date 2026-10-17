// Site-specific prose for the department template. Every value can be overridden from dept.json under `copy`.
// 0.12.0 ("nothing untrue"): the defaults are plain wording that is true for any volunteer department, or empty
// (and an empty value hides what it would have filled). Until 0.11.1 they were the Paw Paw Fire Department's own
// wording; Paw Paw's values now live in example/content/dept.json, so its site renders as before.
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
export function words(n) {
  if (typeof n !== 'number' || n < 0 || n > 99 || n !== Math.floor(n)) return String(n);
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const STATES = { AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California', CO:'Colorado', CT:'Connecticut', DE:'Delaware', DC:'the District of Columbia', FL:'Florida', GA:'Georgia', HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas', KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland', MA:'Massachusetts', MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri', MT:'Montana', NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico', NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OK:'Oklahoma', OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina', SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont', VA:'Virginia', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming', PR:'Puerto Rico' };
const list = (a) => (a.length < 2 ? a.join('') : a.length === 2 ? a.join(' and ') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);

export function copy(d) {
  const c = d.copy || {};
  const place = c.place ?? d.address?.city ?? '';
  const short = d.short ?? c.short ?? d.name;
  const county = c.county ?? '';
  const state_name = c.state_name ?? STATES[String(d.address?.state || '').toUpperCase()] ?? '';
  const station_label = c.station_label ?? d.station?.name ?? (d.radio ? `Station ${d.radio}` : 'the station');
  const n = d.stats?.members;
  const members_word = c.members_word ?? (n > 0 ? cap(words(n)) : '');
  const map = c.map !== false && !(d.district && d.district.map === false);
  const towns = [...(d.district?.members || []), ...(d.district?.contract || [])];
  const addr = [station_label, d.address?.street].filter(Boolean).join(', ');
  return {
    place, short, county, state_name, station_label, members_word, map,
    title_suffix: c.title_suffix ?? [place, state_name].filter(Boolean).join(', '),
    territory: c.territory ?? list(towns),
    territory_long: c.territory_long ?? '',
    district_title: c.district_title ?? 'The district',
    district_name: c.district_name ?? 'the district',
    board_title: c.board_title ?? 'Who oversees the department',
    board_source_note: c.board_source_note ?? '',
    map_note: c.map_note ?? '',
    hero_h1: c.hero_h1 ?? `${short}.`,
    hero_cta1: c.hero_cta1 ?? 'Join the department', hero_cta1_href: c.hero_cta1_href ?? '/join/',
    hero_cta2: c.hero_cta2 ?? 'Fire safety at home', hero_cta2_href: c.hero_cta2_href ?? '/safety/',
    hero_lede: c.hero_lede ?? `${d.name}${place ? `, ${place}` : ''}. In an emergency, call 911.`,
    call_door: c.call_door ?? 'What happens between your 911 call and the first truck out.',
    about_lede: c.about_lede ?? `${d.name}${d.founded > 0 ? `, serving ${place || 'its community'} since ${d.founded}` : ''}.`,
    about_h1: c.about_h1 ?? 'Who we are.',
    news_source: c.news_source ?? 'as reported by the department',
    year_counts_note: c.year_counts_note ?? '',
    pagers_step: c.pagers_step ?? 'Every member is alerted at once.',
    drive_step: c.drive_step ?? 'Members leave work, dinner or bed and head for the station. The first truck rolls as soon as it has a crew. That is the time a volunteer response takes.',
    knox_box: c.knox_box ?? '',
    station_tours: c.station_tours ?? '',
    incident_reports: c.incident_reports ?? '',
    honor_guard_title: c.honor_guard_title ?? 'Honor guard',
    roster_note: c.roster_note ?? '',
    join_people: c.join_people ?? '',
    join_address_label: c.join_address_label ?? 'Where you live',
    juniors_lede: c.juniors_lede ?? '',
    stat_247: c.stat_247 ?? '',
    // 0.7.0
    weather_nav: c.weather_nav ?? 'Weather',
    shop_nav: c.shop_nav ?? 'Shop',
    support_h2: c.support_h2 ?? 'Support the department.',
    support_h2b: c.support_h2b ?? '',
    events_link: c.events_link ?? 'News & events',
    rigs_note: c.rigs_note ?? '',
    district_note: c.district_note ?? (addr ? `${addr}.` : ''),
    responses_lede: c.responses_lede ?? 'Every call, in general terms: the kind of incident, where in general, and which trucks went. No names, no house numbers, no medical details.',
    responses_list_kicker: c.responses_list_kicker ?? 'Recent',
    responses_list_title: c.responses_list_title ?? 'Latest responses',
    responses_list_note: c.responses_list_note ?? '',
    join_steps_note: c.join_steps_note ?? '',
    youth_note: c.youth_note ?? '',
    footer_about: c.footer_about,
    header_tagline: c.header_tagline ?? (d.founded ? `${station_label} · Est. ${d.founded}` : station_label),
    history_title: c.history_title ?? 'Our history',
    about_meta: c.about_meta ?? `About the ${d.name}: its history, its leadership and the station.`,
    station_photo_alt: c.station_photo_alt ?? station_label,
    station_photo_caption: c.station_photo_caption ?? '',
    mission: c.mission ?? '',
    dispatch: c.dispatch ?? 'The 911 center',
    ems: c.ems ?? 'the ambulance service',
    first_rig: c.first_rig ?? 'The first truck goes as soon as it has a crew. More members follow as they arrive.',
    no_one_in_station: c.no_one_in_station ?? 'Nobody waits at the station. Volunteers respond from home and work the moment they are alerted.',
    burn_authority: c.burn_authority ?? '',
    burn_rule: c.burn_rule ?? 'Check with your county or township before you burn, and never burn on a dry or windy day.',
    burn_rule_short: c.burn_rule_short ?? 'Check with your county or township first. Never on a dry or windy day. Water within reach, and someone watching it until it is out.',
    join_lede: c.join_lede ?? `What it takes to join the ${short}, and how to start.`,
    live_here: c.live_here ?? '',
    cert_name: c.cert_name ?? '',
    apparatus_lede: c.apparatus_lede ?? `The trucks of the ${short}.`,
    apparatus_note: c.apparatus_note ?? '',
    station_title: c.station_title ?? cap(station_label),
    rigs_title: c.rigs_title ?? 'The trucks',
    memorial_door: c.memorial_door ?? (d.lodd && d.lodd[0] ? `The members we have lost, and ${d.lodd[0].name}, who died in the line of duty on ${new Date(d.lodd[0].died + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.` : 'The members we have lost.'),
    station_where: c.station_where ?? '',
    cert_short: c.cert_short ?? '',
    cert_text: c.cert_text ?? '',
    cert_step: c.cert_step ?? '',
    heritage: c.heritage ?? '',
    address_placeholder: c.address_placeholder ?? '',
    honorary: c.honorary ?? '',
    schools: c.schools ?? '',
    squad_caption: c.squad_caption ?? '',
    join_caption: c.join_caption ?? '',
    community_caption: c.community_caption ?? '',
    contact_caption: c.contact_caption ?? '',
    responses_caption: c.responses_caption ?? '',
    apparatus_h1: c.apparatus_h1 ?? 'Our trucks.',
    apparatus_link: c.apparatus_link ?? 'All the apparatus',
    support_h1: c.support_h1 ?? 'Support the department.',
    support_blurb: c.support_blurb ?? '',
    members_lede: c.members_lede ?? `The people of the ${d.name}.`,
    community_door: c.community_door ?? 'Burning, fire safety at home, and what to do after a fire.',
    footer_kind: c.footer_kind ?? (d.tagline || ''),
    members_label: c.members_label ?? 'Members',
    last_team: c.last_team ?? '',
    apparatus_meta: c.apparatus_meta ?? `The trucks and equipment of the ${d.name}.`,
    news_meta: c.news_meta ?? `News and upcoming events from the ${d.name}.`,
    community_meta: c.community_meta ?? `For ${place || 'district'} residents: burning, fire safety at home, what to do after a fire, and answers to common questions.`,
    members_meta: c.members_meta ?? `The people of the ${d.name} and how to join them.`,
    members_h1: c.members_h1 ?? 'Our members.',
    home_meta: c.home_meta ?? `${d.name}${place ? `, ${place}${state_name ? `, ${state_name}` : ''}` : ''}. Join us, support us, and find fire safety information. In an emergency, call 911.`,
    // Home-page feature block: absent or null hides it; an object {kicker,title,text,href,link_label,photo?} shows it.
    feature: d.feature || null,
  };
}

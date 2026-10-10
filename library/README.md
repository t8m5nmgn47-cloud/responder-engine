# Stand-in image library

Placeholder photography for drafting volunteer fire department websites with this engine.
Every image here is a **stand-in**: it lets a draft site look finished before the department has
supplied its own photos. Replace them with the department's own pictures before launch wherever you can,
and never present a stand-in as a photo of the department itself (do not caption a stock engine
"our Engine 1").

Each image ships in two sizes: `<slug>.jpg` (1600 px on the long side) and `<slug>-800.jpg` (800 px).
Both are progressive JPEGs at quality 82.

## Counts

- **structure-fire**: 6
- **wildland**: 6
- **extrication**: 3
- **training**: 6
- **apparatus**: 6
- **station**: 6
- **people**: 5
- **historic**: 5

Total: 43 images (eight were cut in review for showing another department's name prominently, or for weak quality).

## License rules

Only images whose license could be read from a machine-readable source were accepted
(Wikimedia Commons file pages with license metadata, which include US federal government
uploads from USFS, BLM, FEMA, NPS, DoD and the Library of Congress). Accepted licenses:

- US federal government works (public domain)
- Public domain because of age (pre-1930 / PD-old / PD-US-expired)
- CC0
- CC BY (any version)
- CC BY-SA (any version)

Rejected: CC BY-NC, CC BY-ND, "fair use", "all rights reserved", editorial-only, anything without a
readable license, anything under 1600 px on the long side, watermarked images, memorial or funeral
content, injured people, identifiable civilians.

## Attribution

`credits.json` holds one entry per image: `file`, `category`, `title`, `source_url`, `author`,
`license`, `license_url`, `description` (one neutral sentence, suitable as alt text).

- **CC BY and CC BY-SA images require a visible credit** on every page where they appear. Render
  it from `credits.json` as, for example: *Photo: {author}, {license} (link to license_url), via
  Wikimedia Commons (link to source_url)*. A site-wide "Photo credits" page linked from the footer
  is the usual approach; a caption works too. Do not crop out or remove the credit when exporting.
- **CC BY-SA** additionally means any derivative you publish (a cropped or color-graded version)
  must carry the same license. Plain resizing for the web is fine.
- **Public domain and CC0 images do not legally require a credit**, but naming the source agency
  (for example "Photo: Bureau of Land Management") is good practice and is included in `credits.json`.
- Always use the `description` field (or something better) as the `alt` attribute.

## Review notes

`contact-sheet.jpg` shows every image with its category and slug so a human can review the set.
Treat anything that shows a recognizable department name or unit number as a candidate to swap
early, since it may read as a photo of the wrong department.

## Images

| File | Category | Title | Author | License | Source |
|---|---|---|---|---|---|
| `structure-fire/crew-at-burning-house-night.jpg` | structure-fire | Evergreen Structure Fire 01-07-17 (34).jpg | Andrea Wilkinson, Kimberly Quiros | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [source](https://commons.wikimedia.org/wiki/File%3AEvergreen_Structure_Fire_01-07-17_%2834%29.jpg) |
| `structure-fire/engine-working-fire-smoke.jpg` | structure-fire | Huachuca City Fire - 2010-03-16 - 06.jpg | Jarek Tuszyński | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | [source](https://commons.wikimedia.org/wiki/File%3AHuachuca_City_Fire_-_2010-03-16_-_06.jpg) |
| `structure-fire/factory-fire-night-ladder.jpg` | structure-fire | Fire-Grand-Rapids-factory.jpg | Brad Gillette (Brad Gillette) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | [source](https://commons.wikimedia.org/wiki/File%3AFire-Grand-Rapids-factory.jpg) |
| `structure-fire/firefighters-silhouetted-flames.jpg` | structure-fire | 171108-F-LM051-1119 (38412804111).jpg | U.S. Department of Defense Current Photo | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3A171108-F-LM051-1119_%2838412804111%29.jpg) |
| `structure-fire/house-fire-dusk-fully-involved.jpg` | structure-fire | Butler Island Fire.jpg | Hust01 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [source](https://commons.wikimedia.org/wiki/File%3AButler_Island_Fire.jpg) |
| `structure-fire/house-fire-night-front.jpg` | structure-fire | House fire in Beaver Falls, front.jpg | Nyttend | [Public domain (released by the author)](https://commons.wikimedia.org/wiki/Template:PD-self) | [source](https://commons.wikimedia.org/wiki/File%3AHouse_fire_in_Beaver_Falls%2C_front.jpg) |
| `wildland/brush-engine-wildfire-behind.jpg` | wildland | 2020 08 08-15.12.36.284-CDT.jpg | Grand Junction Field Office Bureau of La | [Public domain (US federal government work)](https://creativecommons.org/publicdomain/mark/1.0/) | [source](https://commons.wikimedia.org/wiki/File%3A2020_08_08-15.12.36.284-CDT.jpg) |
| `wildland/brush-truck-smoky-road.jpg` | wildland | 2020 08 21-17.15.30.568-CDT.jpg | Grand Junction Field Office Bureau of La | [Public domain (US federal government work)](https://creativecommons.org/publicdomain/mark/1.0/) | [source](https://commons.wikimedia.org/wiki/File%3A2020_08_21-17.15.30.568-CDT.jpg) |
| `wildland/drip-torch-hillside.jpg` | wildland | 180808-Rouge-CMR-667 (44159158971).jpg | Forest Service Photography | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3A180808-Rouge-CMR-667_%2844159158971%29.jpg) |
| `wildland/engine-prescribed-burn.jpg` | wildland | 20180501-FS-Monongahela-KMB-298 (48137844966).jpg | Monongahela National Forest from Elkins, | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3A20180501-FS-Monongahela-KMB-298_%2848137844966%29.jpg) |
| `wildland/grass-fire-crew-yellow-shirts.jpg` | wildland | P1040373 (6780462712).jpg | Virginia State Parks staff | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | [source](https://commons.wikimedia.org/wiki/File%3AP1040373_%286780462712%29.jpg) |
| `wildland/water-tender-burned-area.jpg` | wildland | FEMA - 39758 - Water truck at a burned area of Colorado.jpg | Michael Rieger | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3AFEMA_-_39758_-_Water_truck_at_a_burned_area_of_Colorado.jpg) |
| `extrication/extrication-crew-cutting-car.jpg` | extrication | KSC firefighters training 1.jpg | NASA/Daniel Casper | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3AKSC_firefighters_training_1.jpg) |
| `extrication/extrication-night-roof-removed.jpg` | extrication | 379th ECES firefighters practice vehicle extrication with ho | U.S. Air Force AFCENT by Senior Airman D | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3A379th_ECES_firefighters_practice_vehicle_extrication_with_host_nation_partners_%288614209%29.jpg) |
| `extrication/spreader-on-car-door.jpg` | extrication | Extrication spreader 2.jpg | Daniel Schwen | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [source](https://commons.wikimedia.org/wiki/File%3AExtrication_spreader_2.jpg) |
| `training/crew-carrying-hose-scba.jpg` | training | Photos, Holloman participates in a MARE 150219-F-ZB149-019.j | Airman 1st Class Aaron Montoya | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3APhotos%2C_Holloman_participates_in_a_MARE_150219-F-ZB149-019.jpg) |
| `training/flashover-training-interior.jpg` | training | Air Force Fire Training.jpg | U.S. Air Force photo/Tech. Sgt. Rey Ramo | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3AAir_Force_Fire_Training.jpg) |
| `training/live-burn-cabin-crowd.jpg` | training | Controlled burn of cabin at University of Alaska Southeast.j | James Brooks | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | [source](https://commons.wikimedia.org/wiki/File%3AControlled_burn_of_cabin_at_University_of_Alaska_Southeast.jpg) |
| `training/live-fire-training-sunset.jpg` | training | 446th Fire Protection Flight at Patriot Warrior (18776255889 | US Air Force from USA | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3A446th_Fire_Protection_Flight_at_Patriot_Warrior_%2818776255889%29.jpg) |
| `training/recruits-hose-team.jpg` | training | Federal Fire Department Firefighting Recruit Training Academ | MC3 Diana Quinlan | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3AFederal_Fire_Department_Firefighting_Recruit_Training_Academy_Recruits_prepare_to_enter_a_building_during_training_at_the_Mamala_Bay_training_area_on_Joint_Base_Pearl_Harbor-Hickam_in_Pearl_Harbor%2C_Hawaii_130320-N-WF272-019.jpg) |
| `training/two-firefighters-advance-hose.jpg` | training | 120718-F-JF472-423 (7644651442).jpg | U.S. Department of Defense Current Photo | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3A120718-F-JF472-423_%287644651442%29.jpg) |
| `apparatus/brush-truck-type6-prairie.jpg` | apparatus | Firetruck wildland Type 6.jpg | Hustvedt | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | [source](https://commons.wikimedia.org/wiki/File%3AFiretruck_wildland_Type_6.jpg) |
| `apparatus/engine-colorado-springs-street.jpg` | apparatus | Colorado Springs fire engine no. 5, Colorado Ave, 31st St, C | Xnatedawgx | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [source](https://commons.wikimedia.org/wiki/File%3AColorado_Springs_fire_engine_no._5%2C_Colorado_Ave%2C_31st_St%2C_Colorado_Springs.jpg) |
| `apparatus/engine-mountain-snow.jpg` | apparatus | Engine 813 of the Copper Mountain Fire Department (CMFD) on  | Bidgee | [CC BY-SA 3.0 au](https://creativecommons.org/licenses/by-sa/3.0/au/deed.en) | [source](https://commons.wikimedia.org/wiki/File%3AEngine_813_of_the_Copper_Mountain_Fire_Department_%28CMFD%29_on_Ten_Mile_Circle_at_Copper_Mountain_Resort.jpg) |
| `apparatus/ladder-truck-side-view.jpg` | apparatus | Mountain View ladder fire truck 51.jpg | Runner1928 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | [source](https://commons.wikimedia.org/wiki/File%3AMountain_View_ladder_fire_truck_51.jpg) |
| `apparatus/rescue-engine-township.jpg` | apparatus | Canton Twp. Fire Rescue Truck.JPG | Dwight Burdette | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | [source](https://commons.wikimedia.org/wiki/File%3ACanton_Twp._Fire_Rescue_Truck.JPG) |
| `apparatus/tanker-pumper-parked-grass.jpg` | apparatus | Paynesville MN Fire Department Truck.jpg | DatraxMada | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [source](https://commons.wikimedia.org/wiki/File%3APaynesville_MN_Fire_Department_Truck.jpg) |
| `station/fire-hall-small-town.jpg` | station | Clyde Township Fire Hall No1 (Ruby, MI).jpg | Notorious4life | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) | [source](https://commons.wikimedia.org/wiki/File%3AClyde_Township_Fire_Hall_No1_%28Ruby%2C_MI%29.jpg) |
| `station/firehouse-1882-antique-truck.jpg` | station | The 1882 firehouse in the town of Ridgway, which calls itsel | Carol M. Highsmith | [Public domain (dedicated by the photographer; Library of Congress)](https://www.loc.gov/rr/print/res/482_high.html) | [source](https://commons.wikimedia.org/wiki/File%3AThe_1882_firehouse_in_the_town_of_Ridgway%2C_which_calls_itself_the_%22Gateway_to_the_San_Juans%2C%22_in_the_Rocky_Mountains_of_Colorado_LCCN2015632430.tif) |
| `station/firehouse-historic-brick.jpg` | station | Calumet Fire Station Calumet MI 2009.jpg | Andrew Jameson | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | [source](https://commons.wikimedia.org/wiki/File%3ACalumet_Fire_Station_Calumet_MI_2009.jpg) |
| `station/station-engine-in-bay.jpg` | station | The Glenwood Springs Fire Department is located in Glenwood  | Loco Steve | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | [source](https://commons.wikimedia.org/wiki/File%3AThe_Glenwood_Springs_Fire_Department_is_located_in_Glenwood_Springs%2C_Colorado._The_city_is_located_approximately_160_miles_west_of_Denver_and_is_known_for_its_natural_hot_springs%2C_a_huge_year_round_hot_springs_pool%2C_skiin_-_panoramio.jpg) |
| `station/station-rural-engines-outside.jpg` | station | Falcon Colorado Fire Station.jpg | David Shankbone | [Public domain (released by the author)](https://commons.wikimedia.org/wiki/Template:PD-self) | [source](https://commons.wikimedia.org/wiki/File%3AFalcon_Colorado_Fire_Station.jpg) |
| `station/station-volunteer-mountain-town.jpg` | station | Lake City Volunteer Fire Department.jpg | Jeffrey Beall | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | [source](https://commons.wikimedia.org/wiki/File%3ALake_City_Volunteer_Fire_Department.jpg) |
| `people/firefighter-clears-hydrant-snow.jpg` | people | Iceman in action 150306-F-YW474-141.jpg | Senior Airman peter reft | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3AIceman_in_action_150306-F-YW474-141.jpg) |
| `people/firefighter-portrait-prescribed-burn.jpg` | people | 20181203-FS-KAIBAB-LSC-0536 (46425438884).jpg | U.S. Department of Agriculture Lance Che | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3A20181203-FS-KAIBAB-LSC-0536_%2846425438884%29.jpg) |
| `people/firefighters-gear-up-at-truck.jpg` | people | U.S. Air Force firefighters adjust their gear at Fire Statio | Elizabeth Copan | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3AU.S._Air_Force_firefighters_adjust_their_gear_at_Fire_Station_No_130612-F-WR679-010.jpg) |
| `people/two-wildland-firefighters-smiling.jpg` | people | 2022 07 25-17.09.55.258-CDT.jpg | Sarah Platt | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3A2022_07_25-17.09.55.258-CDT.jpg) |
| `people/wildland-firefighter-truck-door.jpg` | people | U.S. Air Force firefighter Kenny Kotcher prepares to go back | Elizabeth Copan | [Public domain (US federal government work)](https://commons.wikimedia.org/wiki/Template:PD-USGov) | [source](https://commons.wikimedia.org/wiki/File%3AU.S._Air_Force_firefighter_Kenny_Kotcher_prepares_to_go_back_out_in_the_field_for_day_two_of_the_Black_Forest_Fire_at_Fire_Station_No_130612-F-WR679-037.jpg) |
| `historic/firefighters-ladders-1920s.jpg` | historic | Creecy fire LOC npcc.04502.jpg | National Photo Company Collection | [Public domain (copyright expired)](https://creativecommons.org/publicdomain/mark/1.0/) | [source](https://commons.wikimedia.org/wiki/File%3ACreecy_fire_LOC_npcc.04502.jpg) |
| `historic/firemens-school-ladder-drill.jpg` | historic | Firemen's school LCCN2016828745.jpg | National Photo Company Collection | [Public domain (copyright expired)](https://creativecommons.org/publicdomain/mark/1.0/) | [source](https://commons.wikimedia.org/wiki/File%3AFiremen%27s_school_LCCN2016828745.jpg) |
| `historic/horse-drawn-engine-station.jpg` | historic | Horse-drawn fire truck in front of fire station. Eleventh an | Swekosky, William G., 1895-1964 | [Public domain (copyright expired)](https://commons.wikimedia.org/wiki/Template:PD-US-expired) | [source](https://commons.wikimedia.org/wiki/File%3AHorse-drawn_fire_truck_in_front_of_fire_station._Eleventh_and_Lucas_Streets.jpg) |
| `historic/hose-crew-tintype-1800s.jpg` | historic | Fire Engine Dinkey, Union Fire Company.jpg | Thomas Martin Easterly | [Public domain (copyright expired)](https://creativecommons.org/publicdomain/mark/1.0/) | [source](https://commons.wikimedia.org/wiki/File%3AFire_Engine_Dinkey%2C_Union_Fire_Company.jpg) |
| `historic/steam-fire-engine-1879.jpg` | historic | Seattle's first fire engine, 1879 - DPLA - affc54805d5980dc6 | Unknown | [Public domain (copyright expired)](https://commons.wikimedia.org/wiki/Template:PD-US-expired) | [source](https://commons.wikimedia.org/wiki/File%3ASeattle%27s_first_fire_engine%2C_1879_-_DPLA_-_affc54805d5980dc62a078ccd46e0aff.jpg) |

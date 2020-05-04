// @flow

import type { AchievementType } from 'brewskey.js-api';

import BackOnTheBusSmall from './resources/badges/70x70/BackOnTheBus-70x70.png';
import BeerAficionadoSmall from './resources/badges/70x70/BeerAficionado-70x70.png';
import BeerAuthoritySmall from './resources/badges/70x70/BeerAuthority-70x70.png';
import BeerBeforeNoonSmall from './resources/badges/70x70/BeerBeforeNoon-70x70.png';
import BeerBuffSmall from './resources/badges/70x70/BeerBuff-70x70.png';
import BeerConnoisseurSmall from './resources/badges/70x70/BeerConnoisseur-70x70.png';
import DrankAKegSmall from './resources/badges/70x70/DrankAKeg-70x70.png';
import DrankFiveKegsSmall from './resources/badges/70x70/DrankFiveKegs-70x70.png';
import DrankTenKegsSmall from './resources/badges/70x70/DrankTenKegs-70x70.png';
import Edward40HandsSmall from './resources/badges/70x70/Edward40Hands-70x70.png';
import FirstPourOfTheDaySmall from './resources/badges/70x70/FirstPourOfTheDay-70x70.png';
import HatTrickSmall from './resources/badges/70x70/HatTrick-70x70.png';
import KingOfTheKegSmall from './resources/badges/70x70/KingOfTheKeg-70x70.png';
import LastPourOfTheKegSmall from './resources/badges/70x70/LastPourOfTheKeg-70x70.png';
import LastPourOfTheNightSmall from './resources/badges/70x70/LastPourOfTheNight-70x70.png';
import LightWeightSmall from './resources/badges/70x70/LightWeight-70x70.png';
import PowerHourSmall from './resources/badges/70x70/PowerHour-70x70.png';
import SevenDaysStraightSmall from './resources/badges/70x70/SevenDaysStraight-70x70.png';
import WelcomeSmall from './resources/badges/70x70/Welcome-70x70.png';

import BackOnTheBusLarge from './resources/badges/150x150/BackOnTheBus.png';
import BeerAficionadoLarge from './resources/badges/150x150/BeerAficionado.png';
import BeerAuthorityLarge from './resources/badges/150x150/BeerAuthority.png';
import BeerBeforeNoonLarge from './resources/badges/150x150/BeerBeforeNoon.png';
import BeerBuffLarge from './resources/badges/150x150/BeerBuff.png';
import BeerConnoisseurLarge from './resources/badges/150x150/BeerConnoisseur.png';
import DrankAKegLarge from './resources/badges/150x150/DrankAKeg.png';
import DrankFiveKegsLarge from './resources/badges/150x150/DrankFiveKegs.png';
import DrankTenKegsLarge from './resources/badges/150x150/DrankTenKegs.png';
import Edward40HandsLarge from './resources/badges/150x150/Edward40Hands.png';
import FirstPourOfTheDayLarge from './resources/badges/150x150/FirstPourOfTheDay.png';
import HatTrickLarge from './resources/badges/150x150/HatTrick.png';
import KingOfTheKegLarge from './resources/badges/150x150/KingOfTheKeg.png';
import LastPourOfTheKegLarge from './resources/badges/150x150/LastPourOfTheKeg.png';
import LastPourOfTheNightLarge from './resources/badges/150x150/LastPourOfTheNight.png';
import LightWeightLarge from './resources/badges/150x150/LightWeight.png';
import PowerHourLarge from './resources/badges/150x150/PowerHour.png';
import SevenDaysStraightLarge from './resources/badges/150x150/SevenDaysStraight.png';
import WelcomeLarge from './resources/badges/150x150/Welcome.png';

export type Badge = {|
  description: string,
  image: {| large: number, small: number |},
  name: string,
|};

export const BADGE_IMAGE_SIZES = {
  large: 150,
  small: 70,
};

const BADGE_BY_TYPE = Object.freeze({
  BackOnTheBus: {
    description:
      'Never give up. Never surrender! You poured a beer after 3 weeks of inactivity.',
    image: { large: BackOnTheBusLarge, small: BackOnTheBusSmall },
    name: 'Back On The Bus',
  },
  BeerAficionado: {
    description: "You've tried 20 different types of beers on Brewskey.",
    image: { large: BeerAficionadoLarge, small: BeerAficionadoSmall },
    name: 'Beer Aficionado',
  },
  BeerAuthority: {
    description: "You've tried 10 different types of beers on Brewskey.",
    image: { large: BeerAuthorityLarge, small: BeerAuthoritySmall },
    name: 'Beer Authority',
  },
  BeerBeforeNoon: {
    description:
      "Too soon for a beer before noon? It's five o'clock somewhere!.",
    image: { large: BeerBeforeNoonLarge, small: BeerBeforeNoonSmall },
    name: 'Beer Before Noon',
  },
  BeerBuff: {
    description: "You've tried 5 different types of beers on Brewskey.",
    image: { large: BeerBuffLarge, small: BeerBuffSmall },
    name: 'Beer Buff',
  },
  BeerConnoisseur: {
    description: "You've tried 30 different types of beers on Brewskey.",
    image: { large: BeerConnoisseurLarge, small: BeerConnoisseurSmall },
    name: 'Beer Connoisseur',
  },
  DrankAKeg: {
    description: 'You drank a whole keg of beer!',
    image: { large: DrankAKegLarge, small: DrankAKegSmall },
    name: 'Drank A Keg',
  },
  DrankFiveKegs: {
    description:
      'The beer belly is strong in this one.  You drank over 5 kegs!',
    image: { large: DrankFiveKegsLarge, small: DrankFiveKegsSmall },
    name: 'Drank Five Kegs',
  },
  DrankTenKegs: {
    description: 'Get ready for some keg tosses! You drank over 10 kegs!',
    image: { large: DrankTenKegsLarge, small: DrankTenKegsSmall },
    name: 'Drank 10 Kegs',
  },
  Edward40Hands: {
    description:
      'You can take off the tape.  You poured two 40 ouncers in a day!',
    image: { large: Edward40HandsLarge, small: Edward40HandsSmall },
    name: 'Edward 40 Hands',
  },
  FirstPourOfTheDay: {
    description:
      'Get the party started. You just had the first pour of the day.',
    image: { large: FirstPourOfTheDayLarge, small: FirstPourOfTheDaySmall },
    name: 'First Pour of the Day',
  },
  HatTrick: {
    description: 'You poured three times today.',
    image: { large: HatTrickLarge, small: HatTrickSmall },
    name: 'Hat Trick',
  },
  KingOfTheKeg: {
    description:
      'King of the keg, king of the keg. Go do this. Go do this. Wa Wa Wee Wa!!',
    image: { large: KingOfTheKegLarge, small: KingOfTheKegSmall },
    name: 'King of the Keg',
  },
  LastPourOfTheKeg: {
    description:
      "Hope you didn't get foam.  You poured the last pour of the keg.",
    image: { large: LastPourOfTheKegLarge, small: LastPourOfTheKegSmall },
    name: 'Brewskey Out',
  },
  LastPourOfTheNight: {
    description: 'You poured the last beer before midnight.',
    image: { large: LastPourOfTheNightLarge, small: LastPourOfTheNightSmall },
    name: 'Last Pour of the Night',
  },
  LightWeight: {
    description: 'Do you need a bigger cup?  You just poured a half-pint.',
    image: { large: LightWeightLarge, small: LightWeightSmall },
    name: 'Light Weight',
  },
  PowerHour: {
    description: 'You feeling pumped? You drank 60 ounces in under an hour!',
    image: { large: PowerHourLarge, small: PowerHourSmall },
    name: 'Power Hour',
  },
  SevenDaysStraight: {
    description: "You've poured a drink seven days in a row.",
    image: { large: SevenDaysStraightLarge, small: SevenDaysStraightSmall },
    name: 'Seven Days Straight',
  },
  Welcome: {
    description:
      'Congrats on your first pour. Keep using Brewskey to unlock more achievements.',
    image: { large: WelcomeLarge, small: WelcomeSmall },
    name: 'Welcome',
  },
});

export default BADGE_BY_TYPE;

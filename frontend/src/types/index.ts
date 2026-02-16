// TODO: Define TypeScript interfaces for your data types here

export interface Player {
  /** Unique player ID */
  player_id: string;

  /** First name of the player */
  first_name: string;

  /** Last name of the player */
  last_name: string;

  /** Birthdate in YYYY-MM-DD format */
  birthdate: string;

  /** Birth country (optional) */
  birth_country?: string;

  /** Birth state (optional) */
  birth_state?: string;

  /** Height in feet */
  height_feet: number;

  /** Height in inches */
  height_inches: number;

  /** Weight in pounds */
  weight: number;

  /** Team code, e.g., "TOR" */
  team: string;

  /** Primary position, e.g., "RHS"*/
  primary_position: string;

  /** Throws hand: "R" or "L" */
  throws: string;

  /** Bats hand: "R" or "L" */
  bats: string;
}


export interface Pitch {
  // TODO: Add player properties that match your backend model
}

export interface PlayerFilterOptions {
  /** Team code, e.g., "TOR" */
  team?: string;

  /** Primary position, e.g., "RHS" for pitcher */
  position?: string;

  /** player ID for exact lookup */
  player_id?: string;
}
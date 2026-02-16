export const teamLogoMap: Record<string, string> = {
  TOR: "tor",
  CHC: "chc",
  BOS: "bos",
  LAD: "lad",
  MIL: "mil",
  PHI: "phi",
  NYY: "nyy",
  SD: "sd",
  LAA: "laa",
  BAL: "bal",
  SEA: "sea",
  CHI: "cws",   
  TB: "tb",
  MIN: "min",
  DET: "det",
  NY: "nym",    
  CLE: "cle",
  TEX: "tex",
  CIN: "cin",
  LA: "lad",    
  KC: "kc",
  ARI: "ari",
  PIT: "pit",
  ATL: "atl",
  STL: "stl",
  WSH: "wsh",
};

export const getTeamLogoUrl = (team?: string): string | null => {
  if (!team) return null;

  const mapped = teamLogoMap[team];
  if (!mapped) return null;

  return `https://a.espncdn.com/i/teamlogos/mlb/500/${mapped}.png`;
};

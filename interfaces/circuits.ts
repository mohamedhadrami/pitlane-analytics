

export type circuit = {
    xmlns: string,
    series: string,
    limit: string,
    offset: string,
    total: string,
    RaceTable: RaceTable
  }
  
  export type RaceTable = {
    season: string,
  }
// TODO: create here a typescript interface for an olympic country
/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/

import { Participation } from "./Participation"

export type OlympicCountry = {
    id: number,
    country: string,
    participations: Array<Participation>
}

export type OlympicResume = {
    id: number,
    country: string,
    medals: number
}
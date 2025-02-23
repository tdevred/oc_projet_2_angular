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

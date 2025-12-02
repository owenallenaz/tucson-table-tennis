/**
 * A PlayerVector represents a round in a round robin tournament using the circle method.
 * The first array is the top row and the second array is the second row.
 * The player in row1 slot1 plays row2 slot2 etc
*/
export type PlayerVector = [string[], string[]]

export type Match = [string, string]

export type MethodHandler = (e: GoogleAppsScript.Events.DoPost, data: any) => any

export interface RosterRow {
	id: string
	name: string
	rating: number
	pool?: string
}

export interface MatchRow {
	pool: string
	idA: string
	idB: string
	aWins?: number
	bWins?: number
}

export type MatchRowCompleted = Required<MatchRow>

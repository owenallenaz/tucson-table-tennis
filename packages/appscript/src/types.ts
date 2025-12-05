/**
 * A PlayerVector represents a round in a round robin tournament using the circle method.
 * The first array is the top row and the second array is the second row.
 * The player in row1 slot1 plays row2 slot2 etc
*/
export type PlayerVector = [string[], string[]]

export type Match = [string, string]

export type MethodHandler = (e: GoogleAppsScript.Events.DoPost, data: any) => any

export interface RosterRow {
	row: number
	id: string
	name: string
	rating: number
	pool?: string
	newRating?: number
	delta?: number
	playing: boolean
}

export interface MatchRow {
	row: number
	pool: string
	idA: string
	idB: string
	completed: boolean
	winner?: string
	loser?: string
	aWins?: number
	bWins?: number
}

export type MatchRowCompleted = Required<MatchRow>

export interface PlayerStats {
	id: string
	matchWins: number
	matchLosses: number
	gameWins: number
	gameLosses: number
}

export type PlayerStatsMap = Map<string, PlayerStats>

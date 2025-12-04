interface UpdateMatchArgs {
    tournament: string;
    row: number;
    aWins: number;
    bWins: number;
}
export default function updateMatch(e: any, data: UpdateMatchArgs): void;
export {};

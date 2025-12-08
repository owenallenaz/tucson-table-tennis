type SheetCell = string | null;
export default class SheetsApi {
    #private;
    constructor({ token, sheet }: {
        token: string;
        sheet: string;
    });
    readRange(range: string): Promise<string[][]>;
    updateRange(range: string, values: SheetCell[][]): Promise<void>;
    clearRange(range: string): Promise<void>;
}
export {};

import { Line } from './line';

export interface ZoneWithLines {
    name: string;
    transport: string;
    lines: Line[];
    distinctLines?: string[];
}

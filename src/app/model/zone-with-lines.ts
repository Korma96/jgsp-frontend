import { Line } from './line';

export interface ZoneWithLines {
    name: string;
    lines: Line[];
    distinctLines?: string[];
}

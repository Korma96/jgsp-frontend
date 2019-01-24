import { Stop } from './stop';
import { Point } from './point';

export interface LineForShowing {
    name: string;
    transport?: string;
    stops: Stop[];
    points: Point[];
    polyline: any;
    markers: any[];
    relativeUrl: string;
    color: string;
    markersForVehicles: any[];
    subscription: any;
}

export type Ratios = [number, number];

/**
 * Viewport dimensions, in pixel units.
 * Width, then height.
 */
export type Dimensions = [number, number];

/**
 * A center point, either as an object, or as an array.
 * The array must be in Longitude, Latitude order, as is the custom.
 */
export type LongitudeLatitude = Position | { lon: number; lat: number };

/**
 * A Longitude, Latitude position, in that order.
 */
export type Position = [number, number];

/**
 * A bounding rectangle, in WSEN order
 */
export type Bounds = [number, number, number, number];

export interface Viewport {
  center: Position;
  zoom: number;
}

/**
 * Viewport dimensions, in pixel units.
 * Width, then height.
 */
type Dimensions = [number, number];
/**
 * A center point, either as an object, or as an array.
 * The array must be in Longitude, Latitude order, as is the custom.
 */
type LongitudeLatitude = Position | {
    lon: number;
    lat: number;
};
/**
 * A Longitude, Latitude position, in that order.
 */
type Position = [number, number];
/**
 * A bounding rectangle, in WSEN order
 */
type Bounds = [number, number, number, number];
interface Viewport {
    center: Position;
    zoom: number;
}
/**
 * Given bounds in WSEN order and pixel dimensions,
 * figure out what center and zoom will produce a map
 * view with the same bounds and dimensions.
 */
declare function viewport(bounds: Bounds, dimensions: Dimensions, { minzoom, maxzoom, tileSize, allowFloat, allowAntiMeridian, }?: {
    /**
     * Given a minimum or maximum zoom, the output zoom will
     * be clamped between those numbers.
     */
    minzoom?: number;
    maxzoom?: number;
    /**
     * Tile size. By default, this is 256.
     */
    tileSize?: number;
    /**
     * Allow floating-point zoom levels. By default,
     * only integer zoom levels are output.
     */
    allowFloat?: boolean;
    allowAntiMeridian?: boolean;
}): Viewport;
/**
 * The inverse of viewport: given center, zoom,
 * dimensions, and tileSize, return the bounds that will be produced
 * when you configure a map with those parameters.
 */
declare function bounds(center: LongitudeLatitude, zoom: number, dimensions: Dimensions, tileSize?: number): Bounds;

export { Bounds, Dimensions, LongitudeLatitude, Position, Viewport, bounds, viewport };

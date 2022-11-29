import { SphericalMercator } from "./sphericalmercator";
import {
  Ratios,
  Viewport,
  Position,
  Bounds,
  Dimensions,
  LongitudeLatitude,
} from "./types";

function getAdjusted(base: number, ratios: Ratios, allowFloat: boolean) {
  const adjusted = Math.min(
    base - Math.log(ratios[0]) / Math.log(2),
    base - Math.log(ratios[1]) / Math.log(2)
  );

  return allowFloat ? adjusted : Math.floor(adjusted);
}

/**
 * Given bounds in WSEN order and pixel dimensions,
 * figure out what center and zoom will produce a map
 * view with the same bounds and dimensions.
 */
export function viewport(
  bounds: Bounds,
  dimensions: Dimensions,
  {
    minzoom = 0,
    maxzoom = 20,
    tileSize = 256,
    allowFloat = false,
    allowAntiMeridian = false,
  }: {
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
  } = {}
): Viewport {
  const merc = new SphericalMercator({
    size: tileSize,
    antimeridian: allowAntiMeridian,
  });
  const base = maxzoom;
  const bl = merc.px([bounds[0], bounds[1]], base);
  const tr = merc.px([bounds[2], bounds[3]], base);
  const width = tr[0] - bl[0];
  const height = bl[1] - tr[1];
  const centerPixelX = bl[0] + width / 2;
  const centerPixelY = tr[1] + height / 2;
  const ratios: Ratios = [width / dimensions[0], height / dimensions[1]];
  const adjusted = getAdjusted(base, ratios, allowFloat);

  const center = merc.ll([centerPixelX, centerPixelY], base);
  const zoom = Math.max(minzoom, Math.min(maxzoom, adjusted));

  return { center, zoom };
}

/**
 * The inverse of viewport: given center, zoom,
 * dimensions, and tileSize, return the bounds that will be produced
 * when you configure a map with those parameters.
 */
export function bounds(
  center: LongitudeLatitude,
  zoom: number,
  dimensions: Dimensions,
  tileSize: number = 256
): Bounds {
  if (!Array.isArray(center)) {
    center = [center.lon, center.lat];
  }

  const merc = new SphericalMercator({
    size: tileSize,
  });
  const px = merc.px(center, zoom);
  const tl = merc.ll(
    [px[0] - dimensions[0] / 2, px[1] - dimensions[1] / 2],
    zoom
  );
  const br = merc.ll(
    [px[0] + dimensions[0] / 2, px[1] + dimensions[1] / 2],
    zoom
  );
  return [tl[0], br[1], br[0], tl[1]];
}

export { Bounds, Position, Viewport };

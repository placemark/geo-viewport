var SphericalMercator = require("@mapbox/sphericalmercator");

type LongitudeLatitude = [number, number] | { lon: number; lat: number };
type Ratios = [number, number];

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
  bounds: [number, number, number, number],
  dimensions: [number, number],
  {
    minzoom = 0,
    maxzoom = 20,
    tileSize = 256,
    allowFloat = false,
    allowAntiMeridian = false,
  }: {
    minzoom?: number;
    maxzoom?: number;
    tileSize?: number;
    /**
     * Allow floating-point zoom levels. By default,
     * only integer zoom levels are output.
     */
    allowFloat?: boolean;
    allowAntiMeridian?: boolean;
  } = {}
) {
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

export function bounds(
  viewport: LongitudeLatitude,
  zoom: boolean,
  dimensions: [number, number],
  tileSize: number
) {
  if (!Array.isArray(viewport)) {
    viewport = [viewport.lon, viewport.lat];
  }

  const merc = new SphericalMercator({
    size: tileSize,
  });
  const px = merc.px(viewport, zoom);
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

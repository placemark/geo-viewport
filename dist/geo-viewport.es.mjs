Object.defineProperty(exports, "__esModule", { value: true });
exports.bounds = exports.viewport = void 0;
const tslib_1 = require("tslib");
const sphericalmercator_1 = tslib_1.__importDefault(require("@mapbox/sphericalmercator"));
function getAdjusted(base, ratios, allowFloat) {
    const adjusted = Math.min(base - Math.log(ratios[0]) / Math.log(2), base - Math.log(ratios[1]) / Math.log(2));
    return allowFloat ? adjusted : Math.floor(adjusted);
}
/**
 * Given bounds in WSEN order and pixel dimensions,
 * figure out what center and zoom will produce a map
 * view with the same bounds and dimensions.
 */
function viewport(bounds, dimensions, { minzoom = 0, maxzoom = 20, tileSize = 256, allowFloat = false, allowAntiMeridian = false, } = {}) {
    const merc = new sphericalmercator_1.default({
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
    const ratios = [width / dimensions[0], height / dimensions[1]];
    const adjusted = getAdjusted(base, ratios, allowFloat);
    const center = merc.ll([centerPixelX, centerPixelY], base);
    const zoom = Math.max(minzoom, Math.min(maxzoom, adjusted));
    return { center, zoom };
}
exports.viewport = viewport;
/**
 * The inverse of viewport: given center, zoom,
 * dimensions, and tileSize, return the bounds that will be produced
 * when you configure a map with those parameters.
 */
function bounds(center, zoom, dimensions, tileSize = 256) {
    if (!Array.isArray(center)) {
        center = [center.lon, center.lat];
    }
    const merc = new sphericalmercator_1.default({
        size: tileSize,
    });
    const px = merc.px(center, zoom);
    const tl = merc.ll([px[0] - dimensions[0] / 2, px[1] - dimensions[1] / 2], zoom);
    const br = merc.ll([px[0] + dimensions[0] / 2, px[1] + dimensions[1] / 2], zoom);
    return [tl[0], br[1], br[0], tl[1]];
}
exports.bounds = bounds;
//# sourceMappingURL=geo-viewport.es.mjs.map

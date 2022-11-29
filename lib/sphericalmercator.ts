import { Position } from "./types";

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

interface ZoomParams {
  Bc: number[];
  Cc: number[];
  zc: number[];
  Ac: number[];
}

const cache: Record<number, ZoomParams> = {};

function isFloat(n: number) {
  return Number(n) === n && n % 1 !== 0;
}

// SphericalMercator constructor: precaches calculations
// for fast tile lookups.
export class SphericalMercator {
  size: number;
  expansion: number;
  Bc: number[];
  Cc: number[];
  zc: number[];
  Ac: number[];

  constructor({
    size = 256,
    antimeridian = false,
  }: {
    size?: number;
    antimeridian?: boolean;
  } = {}) {
    this.size = size;
    this.expansion = antimeridian === true ? 2 : 1;
    if (!cache[this.size]) {
      let size = this.size;
      let c: ZoomParams = {
        Bc: [],
        Cc: [],
        zc: [],
        Ac: [],
      };
      cache[this.size] = c;

      for (let d = 0; d < 30; d++) {
        c.Bc.push(size / 360);
        c.Cc.push(size / (2 * Math.PI));
        c.zc.push(size / 2);
        c.Ac.push(size);
        size *= 2;
      }
    }
    this.Bc = cache[this.size].Bc;
    this.Cc = cache[this.size].Cc;
    this.zc = cache[this.size].zc;
    this.Ac = cache[this.size].Ac;
  }

  // Convert lon lat to screen pixel value
  //
  // - `ll` {Array} `[lon, lat]` array of geographic coordinates.
  // - `zoom` {Number} zoom level.
  px(ll: Position, zoom: number): Position {
    if (isFloat(zoom)) {
      let size = this.size * Math.pow(2, zoom);
      let d = size / 2;
      let bc = size / 360;
      let cc = size / (2 * Math.PI);
      let ac = size;
      let f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
      let x = d + ll[0] * bc;
      let y = d + 0.5 * Math.log((1 + f) / (1 - f)) * -cc;
      x > ac * this.expansion && (x = ac * this.expansion);
      y > ac && (y = ac);
      //(x < 0) && (x = 0);
      //(y < 0) && (y = 0);
      return [x, y];
    } else {
      let d = this.zc[zoom];
      let f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
      let x = Math.round(d + ll[0] * this.Bc[zoom]);
      let y = Math.round(
        d + 0.5 * Math.log((1 + f) / (1 - f)) * -this.Cc[zoom]
      );
      x > this.Ac[zoom] * this.expansion &&
        (x = this.Ac[zoom] * this.expansion);
      y > this.Ac[zoom] && (y = this.Ac[zoom]);
      //(x < 0) && (x = 0);
      //(y < 0) && (y = 0);
      return [x, y];
    }
  }

  // Convert screen pixel value to lon lat
  //
  // - `px` {Array} `[x, y]` array of geographic coordinates.
  // - `zoom` {Number} zoom level.
  ll(px: Position, zoom: number): Position {
    if (isFloat(zoom)) {
      let size = this.size * Math.pow(2, zoom);
      let bc = size / 360;
      let cc = size / (2 * Math.PI);
      let zc = size / 2;
      let g = (px[1] - zc) / -cc;
      let lon = (px[0] - zc) / bc;
      let lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
      return [lon, lat];
    } else {
      let g = (px[1] - this.zc[zoom]) / -this.Cc[zoom];
      let lon = (px[0] - this.zc[zoom]) / this.Bc[zoom];
      let lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
      return [lon, lat];
    }
  }
}

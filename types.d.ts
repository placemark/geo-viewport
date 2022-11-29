declare module "@mapbox/sphericalmercator" {
  export default class SphericalMercator {
    constructor({
      size,
      antimeridian,
    }: {
      size?: number | undefined;
      antimeridian?: boolean | undefined;
    });
    px: (arg1: [number, number], base: number) => [number, number];
    ll: (arg1: [number, number], base: number) => [number, number];
  }
}

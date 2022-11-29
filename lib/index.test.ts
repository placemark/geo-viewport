import { Bounds, Position, Viewport, viewport, bounds } from "./index";
import { test, expect } from "vitest";

// Compare float values up to ~1mm precision
const decDegreesFloatTolerance = 8;

function precisionRound(number: number) {
  var factor = Math.pow(10, decDegreesFloatTolerance);
  return Math.round(number * factor) / factor;
}

const sampleBounds: Bounds = [
  5.668343999999995, 45.111511000000014, 5.852471999999996, 45.26800200000002,
];

const expectedCenter: Position = [5.760407969355583, 45.189810341718136];

function areViewportsApproximatelyEqual(v1: Viewport, v2: Viewport) {
  expect(v1.center[0]).toBeCloseTo(v2.center[0]);
  expect(v1.center[1]).toBeCloseTo(v2.center[1]);
  expect(v1.zoom).toBeCloseTo(v2.zoom);
}

test("viewport", function () {
  areViewportsApproximatelyEqual(viewport(sampleBounds, [640, 480]), {
    center: expectedCenter,
    zoom: 11,
  });

  areViewportsApproximatelyEqual(viewport(sampleBounds, [64, 48]), {
    center: expectedCenter,
    zoom: 8,
  });

  areViewportsApproximatelyEqual(viewport(sampleBounds, [10, 10]), {
    center: expectedCenter,
    zoom: 5,
  });
});

test("viewport in Southern hemisphere", () => {
  areViewportsApproximatelyEqual(viewport([10, -20, 20, -10], [500, 250]), {
    center: [14.999999776482582, -15.058651551491899],
    zoom: 5,
  });

  areViewportsApproximatelyEqual(viewport([-10, -60, 10, -30], [500, 250]), {
    center: [0, -47.05859720188612],
    zoom: 2,
  });
});

test("viewport across the antimeridian", () => {
  areViewportsApproximatelyEqual(
    viewport([175, -43, 190, -43], [300, 200], {
      tileSize: 512,
      allowFloat: true,
      allowAntiMeridian: false,
    }),
    { center: [177.5000001490116, -43.00000017011762], zoom: 5.398743777929521 }
  );

  areViewportsApproximatelyEqual(
    viewport([175, -43, 190, -43], [300, 200], {
      tileSize: 512,
      allowFloat: true,
      allowAntiMeridian: true,
    }),
    {
      center: [182.50000018626451, -43.00000017011762],
      zoom: 3.8137812127148685,
    }
  );
});

test("bounds for 512px tiles", () => {
  expect(
    bounds([-77.036556, 38.897708], 17, [1080, 350], 512).map(precisionRound)
  ).toEqual([-77.03945339, 38.89697827, -77.03365982, 38.89843951]);
});

test("bounds for float zooms", () => {
  var zoom = 16.52;
  expect(
    bounds([-77.036556, 38.897708], zoom, [1080, 350], 512).map(precisionRound)
  ).toEqual([-77.04059627, 38.89668897, -77.03251573, 38.89872702]);
});

test("viewport for float zooms", () => {
  areViewportsApproximatelyEqual(
    viewport(sampleBounds, [10, 10], {
      allowFloat: true,
    }),
    { center: expectedCenter, zoom: 5.984828902182182 }
  );
});

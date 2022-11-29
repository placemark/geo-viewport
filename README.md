# geo-viewport

_geo-viewport development is supported by 🌎 [placemark.io](https://placemark.io/)_

Turns bounding boxes / extents into centerpoint & zoom
combos for static maps.

This is a maintained fork of the [Mapbox repository](https://github.com/mapbox/geo-viewport),
with the following changes:

- Fixed crashing bug introduced in `0.5.0`
- Includes TypeScript types
- Modernized project & dependencies
- ESM & CJS output types

## Changes

Most of the improvements to this package are internal, but the `viewport` method has changed.
In the Mapbox version, it grew quite a few parameters and is now:

```ts
viewport(bounds, dimensions, minzoom, maxzoom, tileSize, allowFloat, allowAntiMeridian)
```

In this fork **this has changed** so that there is less remembering required. The method
signature is:

```ts
// Showing default values
viewport(bounds, dimensions, {
    minzoom: 0,
    maxzoom: 20,
    tileSize: 256,
    allowFloat: false,
    allowAntiMeridian: false
})

// You can omit any options or the options array:
viewport(bounds, dimensions);

// Just one option:
viewport(bounds, dimensions, {
    tileSize: 256
})
```



## [Docs](https://placemark.github.io/geo-viewport/)

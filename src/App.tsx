import { Map } from "react-map-gl/maplibre";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import DeckGL, { DeckGLRef } from "@deck.gl/react/typed";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import type { Layer, PickingInfo } from "@deck.gl/core/typed";

import { useRef } from "react";

const INITIAL_VIEW_STATE = {
  latitude: 38.01826212529584,
  longitude: -83.84391061262917,
  zoom: 11,
  bearing: 0,
  pitch: 0,
};

const TEST_DATA = [
  {
    id: 1,
    position: [-83.84391061262917, 38.01826212529584],
    velocity: 2,
    color: [255, 0, 0],
  },
  {
    id: 2,
    position: [-83.84691061262917, 38.02826212529584],
    velocity: -2,
    color: [255, 255, 0],
  },
  {
    id: 3,
    position: [-83.85391061262917, 38.03826212529584],
    velocity: 0,
    color: [255, 0, 255],
  },
];

const TEST_DATA2 = {
  id: new Int32Array([4, 5, 6]),
  position: new Float64Array([
    -83.80391061262917, 38.01826212529584, -83.80691061262917,
    38.02826212529584, -83.81391061262917, 38.03826212529584,
  ]),
  velocity: new Float32Array([2, -2, 0]),
  color: new Uint8ClampedArray([255, 0, 0, 255, 255, 0, 255, 0, 255]),
};

function App() {
  const deckRef = useRef<DeckGLRef>(null);
  window.deckRef = deckRef;
  const pickTest = () => {
    console.log("pickInfo result");

    let h = deckRef.current?.deck?.height;
    let w = deckRef.current?.deck?.width;
    const pickInfo = deckRef.current?.pickObjects({
      x: 0,
      y: 0,
      height: h,
      width: w,
    });
    console.log(pickInfo);

    return pickInfo;
  };
  window.pickTest = pickTest;
  const clicky = (info: PickingInfo, _: any) => console.log("Clicked:", info);
  const layers: Layer[] = [
    new ScatterplotLayer({
      id: "scatter_layer_binary",
      data: {
        length: 3,
        velocity: TEST_DATA2.velocity,
        id: TEST_DATA2.id,
        attributes: {
          getPosition: {
            value: TEST_DATA2.position,
            size: 2,
          },
          getFillColor: { value: TEST_DATA2.color, size: 3 },
        },
      },
      radiusMinPixels: 5,
      pickable: true,
      onClick: clicky,
    }),
    new ScatterplotLayer({
      id: "scatter_layer_classic",
      data: TEST_DATA,
      getFillColor: (d) => d.color,
      radiusMinPixels: 5,
      pickable: true,
      onClick: clicky,
    }),
  ];

  return (
    <>
      <button className="testButton" onClick={pickTest}>
        Test
      </button>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        ref={deckRef}
      >
        <Map
          // mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle={{
            version: 8,
            sources: {
              osm: {
                type: "raster",
                tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: "&copy; OpenStreetMap Contributors",
                maxzoom: 19,
              },
              // Use a different source for terrain and hillshade layers, to improve render quality
            },
            layers: [
              {
                id: "osm",
                type: "raster",
                source: "osm",
              },
            ],
          }}
        ></Map>
      </DeckGL>
    </>
  );
}

export default App;

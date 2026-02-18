declare module "@mapbox/polyline" {
  const polyline: {
    decode(encoded: string): [number, number][];
    encode(points: [number, number][]): string;
  };
  export default polyline;
}

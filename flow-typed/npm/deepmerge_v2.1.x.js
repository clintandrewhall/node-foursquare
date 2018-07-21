// flow-typed signature: cf8f173b269ecc9a9ae029395afce17b
// flow-typed version: e6922b8125/deepmerge_v2.1.x/flow_>=v0.57.3

declare module 'deepmerge' {
  declare type Options = {
    clone?: boolean,
    arrayMerge?: (destination: any[], source: any[], options?: Options) => Array<any>
  }

  declare module.exports: {
    <A, B>(a: A, b: B, options?: Options): A & B,
    all<T>(objects: Array<$Shape<T>>, options?: Options): T
  };

}

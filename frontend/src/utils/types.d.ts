export interface SampleType {
  sampleType1: string;
  sampleType2: boolean;
}

export enum HTTPMethods {
  GET = "get",
  POST = "post"
}

export interface IMutationProps {
  readonly method: HTTPMethods;
  url: string;
  data: any;
}

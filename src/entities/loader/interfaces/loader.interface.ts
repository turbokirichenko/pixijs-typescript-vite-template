export type LoaderOptions = { manifest: { bundles: { name: string, assets: object }[] }};
export type LoadingCallback = (progress: number) => void;
export interface LoaderInterface {
    download(data: LoaderOptions, onLoading: LoadingCallback): Promise<any>;
}
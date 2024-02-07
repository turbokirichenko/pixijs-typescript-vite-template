export type AssetsOptions = { manifest: any };
export type AssetsProgressCallback = (progress: number) => void
export interface AssetsInterface {
    init(options?: AssetsOptions | undefined): Promise<void>;
    loadBundle(data: string | string[], onProgress: AssetsProgressCallback): Promise<any>;
}
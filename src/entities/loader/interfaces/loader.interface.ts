/** loading callback, take the number between 0 and 1
 * 
 */
export type LoadingCallback = (progress: number) => void;
/** a bundle object
 * 
 */
export interface LoaderBundle {
    name: string;
    assets: any;
}
/** the object contains bunldle sources
 * 
 */
export interface LoaderManifest {
    bundles: LoaderBundle[];
}
/** manifest options
 * 
 */
export interface LoaderOptions { 
    manifest: LoaderManifest | undefined;
};
/** the entity allows to download bundle-assets for the project
 * 
 */
export interface LoaderInterface {
    /** downloading assets
     * 
     * @param data - manifest file
     * @param onLoading - loading callback, take the number between 0 and 1
     */
    download(data: LoaderOptions, onLoading: LoadingCallback): Promise<any>;
}
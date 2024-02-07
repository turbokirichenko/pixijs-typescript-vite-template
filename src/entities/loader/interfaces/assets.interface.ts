import { LoaderOptions } from "./loader.interface";
/** Callback function, take the number of the loading progress between 0 and 1;
 * 
 */
export type AssetsProgressCallback = (progress: number) => void
/** Assets is static source of the project
 * 
 */
export interface AssetsInterface {
    /** assets inizialization
     * 
     * @param options - assets parameters
     */
    init(options?: LoaderOptions | undefined): Promise<void>;

    /** load bundle file
     * 
     * @param data - deserialized assets names
     * @param onProgress - callback function to check the progress of the loading
     */
    loadBundle(data: string | string[], onProgress: AssetsProgressCallback): Promise<any>;
}
import type { TLAssetStore, TLComponents } from "tldraw";

/** The page concept is not exposed to users: one room, one board. */
export const BOARD_COMPONENTS: TLComponents = { PageMenu: null };

/**
 * Prototype asset store: images dropped on the board are inlined as data URLs.
 *
 * Fine for a demo, wrong for production — every image then lives inside the
 * document. Replace `upload` with a call to the backend's file endpoint (the
 * same one the Files panel will use) as soon as it exists.
 */
export const PROTOTYPE_ASSET_STORE: TLAssetStore = {
  async upload(_asset, file) {
    const src = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    return { src };
  },
  resolve: (asset) => asset.props.src,
};

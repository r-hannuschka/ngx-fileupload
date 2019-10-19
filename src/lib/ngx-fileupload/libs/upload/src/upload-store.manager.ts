import { Injectable } from "@angular/core";
import { UploadStore } from "./upload.store";

@Injectable({ providedIn: "root"})
export class UploadStoreManager {

    /**
     * type injection token
     */
    private stores: WeakMap<any, UploadStore> = new WeakMap();

    public createStore(token?: object): UploadStore {
        const store = new UploadStore();
        if (token) {
            this.register(store, token);
        }
        return store;
    }

    /**
     * factory to create a new store instance
     */
    public register(store: UploadStore, token: object): boolean {
        if (!this.stores.has(token)) {
            this.stores.set(token, store);
        }
        return false;
    }

    /**
     * remove upload store
     */
    public remove(token): boolean {
        const store = this.get(token);
        if (store !== null) {
            this.stores.delete(token);
            return true;
        }
        return false;
    }

    /**
     * get upload store
     */
    public get(token: object): UploadStore | null {
        if (this.stores.has(token)) {
            return this.stores.get(token);
        }
        return null;
    }
}

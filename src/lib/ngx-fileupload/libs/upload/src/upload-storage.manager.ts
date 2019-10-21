import { Injectable } from "@angular/core";
import { UploadStorage } from "./upload.storage";
import { UploadStoreConfig } from "../../../data/api";

@Injectable({ providedIn: "root"})
export class UploadStorageManager {

    /**
     * type injection token
     */
    private stores: WeakMap<any, UploadStorage> = new WeakMap();

    public createStorage(token?: object): UploadStorage {
        const store = new UploadStorage();
        if (token) {
            this.register(store, token);
        }
        return store;
    }

    /**
     * factory to create a new store instance
     */
    public register(store: UploadStorage, token: object): boolean {
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
    public get(token: object): UploadStorage | null {
        if (this.stores.has(token)) {
            return this.stores.get(token);
        }
        return null;
    }
}

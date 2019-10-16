import { Injectable } from "@angular/core";
import { FileUploadStore } from "./upload.store";

@Injectable({ providedIn: "root"})
export class UploadStoreManager {

    /**
     * type injection token
     */
    private stores: WeakMap<any, FileUploadStore> = new WeakMap();

    public createStore(token?: object): FileUploadStore {
        const store = new FileUploadStore();

        if (token) {
            this.register(store, token);
        }

        return store;
    }

    /**
     * factory to create a new store instance
     */
    public register(store: FileUploadStore, token: object): boolean {
        if (!this.stores.has(token)) {
            this.stores.set(token, store);
        }
        return false;
    }

    public remove(token): boolean {
        const store = this.get(token);
        if (store !== null) {
            this.stores.delete(token);
            return true;
        }
        return false;
    }

    public get(token: object): FileUploadStore | null {
        if (this.stores.has(token)) {
            return this.stores.get(token);
        }
        return null;
    }
}

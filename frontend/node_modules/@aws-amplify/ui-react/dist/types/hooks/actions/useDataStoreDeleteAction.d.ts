import { PersistentModel, PersistentModelConstructor, PersistentModelMetaData, IdentifierFieldOrIdentifierObject } from '@aws-amplify/datastore';
export interface UseDataStoreDeleteActionOptions<Model extends PersistentModel> {
    model: PersistentModelConstructor<Model>;
    id: IdentifierFieldOrIdentifierObject<Model, PersistentModelMetaData<Model>>;
}
/**
 * Action to Delete DataStore item
 * @internal
 */
export declare const useDataStoreDeleteAction: <Model extends Readonly<Record<string, any>>>({ model, id, }: UseDataStoreDeleteActionOptions<Model>) => (() => Promise<void>);

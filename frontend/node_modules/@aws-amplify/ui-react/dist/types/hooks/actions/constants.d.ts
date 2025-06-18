/**
 * UI Actions use the `ui` channel
 * Format for `ui` channel events is EVENT_TYPE:CATEGORY:NAME:STATUS
 */
export declare const UI_CHANNEL = "ui";
export declare const UI_EVENT_TYPE_ACTIONS = "actions";
export declare const CATEGORY_AUTH = "auth";
export declare const CATEGORY_DATASTORE = "datastore";
export declare const CATEGORY_CORE = "core";
export declare const ACTION_AUTH_SIGNOUT = "signout";
export declare const ACTION_NAVIGATE = "navigate";
export declare const ACTION_DATASTORE_CREATE = "create";
export declare const ACTION_DATASTORE_DELETE = "delete";
export declare const ACTION_DATASTORE_UPDATE = "update";
export declare const ACTION_STATE_MUTATION = "statemutation";
export declare const STATUS_STARTED = "started";
export declare const STATUS_FINISHED = "finished";
export declare const EVENT_ACTION_AUTH: string;
export declare const EVENT_ACTION_AUTH_SIGNOUT: string;
export declare const ACTION_AUTH_SIGNOUT_STARTED: string;
export declare const ACTION_AUTH_SIGNOUT_FINISHED: string;
export declare const EVENT_ACTION_CORE: string;
export declare const EVENT_ACTION_CORE_STATE_MUTATION: string;
export declare const ACTION_STATE_MUTATION_STARTED: string;
export declare const ACTION_STATE_MUTATION_FINISHED: string;
export declare const EVENT_ACTION_CORE_NAVIGATE: string;
export declare const ACTION_NAVIGATE_STARTED: string;
export declare const ACTION_NAVIGATE_FINISHED: string;
export declare const EVENT_ACTION_DATASTORE: string;
export declare const EVENT_ACTION_DATASTORE_CREATE: string;
export declare const ACTION_DATASTORE_CREATE_STARTED: string;
export declare const ACTION_DATASTORE_CREATE_FINISHED: string;
export declare const EVENT_ACTION_DATASTORE_DELETE: string;
export declare const ACTION_DATASTORE_DELETE_STARTED: string;
export declare const ACTION_DATASTORE_DELETE_FINISHED: string;
export declare const EVENT_ACTION_DATASTORE_UPDATE: string;
export declare const ACTION_DATASTORE_UPDATE_STARTED: string;
export declare const ACTION_DATASTORE_UPDATE_FINISHED: string;
export declare const DATASTORE_QUERY_BY_ID_ERROR = "Error querying datastore item by id";

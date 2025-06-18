import { Logger } from 'aws-amplify';
type LoggerCategory = 'Auth' | 'Geo' | 'Notifications' | 'Storage';
export declare const getLogger: (category: LoggerCategory) => Logger;
export {};

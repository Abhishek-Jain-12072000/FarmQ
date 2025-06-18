import React from 'react';
import { UseFileUploader } from './types';
export default function useFileUploader({ maxSize, acceptedFileTypes, hasMultipleFiles, isLoading, setAutoLoad, }: {
    maxSize: number;
    acceptedFileTypes: string[];
    hasMultipleFiles: boolean;
    isLoading: boolean;
    setAutoLoad: React.Dispatch<React.SetStateAction<boolean>>;
}): UseFileUploader;

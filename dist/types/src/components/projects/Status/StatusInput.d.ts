import { Manuscript, Section } from '@manuscripts/manuscripts-json-schema';
import React from 'react';
import { AnyElement } from '../../inspector/ElementStyleInspector';
interface StatusInputProps {
    target: AnyElement | Section | Manuscript;
    isOverdue?: boolean;
    isDueSoon?: boolean;
}
export declare const StatusInput: React.FC<StatusInputProps>;
export {};

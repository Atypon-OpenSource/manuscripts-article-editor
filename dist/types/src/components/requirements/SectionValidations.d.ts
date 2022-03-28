import { ContainedModel } from '@manuscripts/manuscript-transform';
import { Model } from '@manuscripts/manuscripts-json-schema';
import { AnyValidationResult } from '@manuscripts/requirements';
import React from 'react';
export declare const SectionValidations: React.FC<{
    sortedData: AnyValidationResult[];
    modelMap: Map<string, Model>;
    manuscriptID: string;
    bulkUpdate: (items: Array<ContainedModel>) => Promise<void>;
}>;

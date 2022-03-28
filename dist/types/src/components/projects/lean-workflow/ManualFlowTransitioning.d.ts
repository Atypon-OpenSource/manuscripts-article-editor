import React from 'react';
import { Submission } from '../../../lib/lean-workflow-gql';
import { ProjectRole } from '../../../lib/roles';
export declare const ManualFlowTransitioning: React.FC<{
    submission: Submission;
    userRole: ProjectRole | null;
    documentId: string;
    hasPendingSuggestions: boolean;
}>;

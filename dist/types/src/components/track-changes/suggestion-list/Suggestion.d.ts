import { TrackedChange } from '@manuscripts/track-changes-plugin';
import React from 'react';
interface Props {
    suggestion: TrackedChange;
    handleAccept: (c: TrackedChange) => void;
    handleReject: (c: TrackedChange) => void;
    handleReset: (c: TrackedChange) => void;
}
export declare const Suggestion: React.FC<Props>;
export {};

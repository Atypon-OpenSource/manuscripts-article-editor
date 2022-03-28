import React, { InputHTMLAttributes } from 'react';
interface Props extends InputHTMLAttributes<HTMLInputElement> {
    _id: string;
    textHint?: string;
}
export declare const RadioButton: React.FunctionComponent<Props>;
export {};

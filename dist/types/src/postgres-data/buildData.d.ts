import { Model } from '@manuscripts/manuscripts-json-schema';
import { SubmissionAttachment } from '@manuscripts/style-guide';
import Api from './Api';
export declare const buildModelMap: (docs: Model[]) => Promise<Map<string, Model>>;
export default function buildData(projectID: string, manuscriptID: string, api: Api, attachments: SubmissionAttachment[]): Promise<{}>;

export type dbResult = {
    language?: string;
    modeloutput?: string;
    userinput?: string;
    type: 'asr' | 'parallel' | 'ocr';
}
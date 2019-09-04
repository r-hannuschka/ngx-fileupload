export interface ValidationErrors {
    [key: string]: any;
}

export type ValidationFn = (file: File) => ValidationErrors | null;

export interface Validator {
    validate(file: File): ValidationErrors | null;
}

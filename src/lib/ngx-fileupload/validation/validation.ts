export interface ValidationErrors {
    [key: string]: any;
}

export interface Validator {
    validate(file: File): ValidationErrors | null;
}

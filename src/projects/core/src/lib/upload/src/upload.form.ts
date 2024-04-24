import { BehaviorSubject, map } from 'rxjs';
import {
  NgxFileUploadState,
  type NgxFileUploadFormControlOptions,
  type NgxFileUploadValidation,
  type NgxFileUploadValidationErrors,
  type NgxFileuploadFormControl,
} from '../../api';
import type { NgxFileUploadRequest } from './upload.request';


export class NgxFileUploadForm {
  private readonly formControls: Map<string, NgxFileuploadFormControl> = new Map();

  private readonly formErrors = new BehaviorSubject<NgxFileUploadValidationErrors | null>(null);

  get errors(): NgxFileUploadValidationErrors | null {
    return this.formErrors.getValue();
  }

  validationState = this.formErrors.pipe(map((errors) => (errors === null ? 'VALID' : 'INVALID')));

  constructor(private readonly request: NgxFileUploadRequest) {}

  /**
   * @description
   */
  addControl(name: string, ctrl: NgxFileUploadFormControlOptions) {
    if (this.request.state > NgxFileUploadState.IDLE) {
      return;
    }

    const control: NgxFileuploadFormControl = {
      errors: null,
      valid: true,
      dirty: true,
      send: true,
      ...ctrl
    };

    this.formControls.set(name, control);
    this.validate();
  }

  controls() {
    return this.formControls.entries();
  }

  /**
   * @description
   */
  getControl(ctrl: string): NgxFileuploadFormControl | undefined {
    return this.formControls.get(ctrl);
  }

  /**
   * @description
   */
  getRawValue(): Record<string, unknown> {
    const raw: Record<string, unknown> = {};
    for (const [name, ctrl] of this.formControls.entries()) {
      raw[name] = ctrl.value;
    }
    return raw;
  }

  /**
   * @description
   */
  removeControl(key: string): void {
    if (this.request.state > NgxFileUploadState.IDLE) {
      return;
    }

    this.formControls.delete(key);
    this.validate();
  }

  /**
   * @description
   * @param formCtrlName
   * @param validator
   * @returns
   */
  addValidator(formCtrlName: string, validator: NgxFileUploadValidation<NgxFileuploadFormControl>) {
    const control = this.formControls.get(formCtrlName);
    if (!control) {
      return;
    }

    const updated: NgxFileuploadFormControl = { ...control, dirty: true, validator };
    this.formControls.set(formCtrlName, updated);
    this.validate();
  }

  // removeValidator(formCtrlName: string, validator: NgxFileUploadValidation<NgxFileuploadFormControl>) {}

  /**
   * @description
   */
  setValue(ctrl: string, value: unknown) {
    const control = this.formControls.get(ctrl);
    if (!control) {
      return;
    }

    const updated = { ...control, dirty: true, value };
    this.formControls.set(ctrl, updated);
    this.validate();
  }

  /**
   * @description
   */
  private validate() {
    let formErrors: NgxFileUploadValidationErrors = {};

    for (const [name, ctrl] of this.formControls.entries()) {
      const validator = ctrl.validator;

      if (!validator) continue;

      let errors: NgxFileUploadValidationErrors | null = ctrl.errors;
      if (ctrl.dirty === true) {
        errors = 'validate' in validator ? validator.validate(ctrl) : validator(ctrl);
        this.formControls.set(name, { ...ctrl, dirty: false, errors });
      }

      if (errors !== null) {
        formErrors = {
          ...formErrors,
          ...(errors !== null ? { [name]: errors } : {}),
        };
      }
    }

    this.formErrors.next(Object.keys(formErrors).length > 0 ? formErrors : null);
  }
}

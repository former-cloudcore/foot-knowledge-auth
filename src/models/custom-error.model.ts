import {StatusCodes} from "http-status-codes";

export class CustomError extends Error {

    type: StatusCodes;
    traceId?: string;
    errors?: { [propertyKey: string]: Array<string> };

    constructor(message?: string, code?: StatusCodes) {
        super(message);
        if (code) {
            this.type = code;
        }
    }
}

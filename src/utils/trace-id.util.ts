import { v4 as uuidv4 } from 'uuid';

export class TraceIdUtil {

    static generateTraceId() {
        return uuidv4();
    }
}

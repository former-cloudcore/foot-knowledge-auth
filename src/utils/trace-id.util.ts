import { singleton } from "../decorators/singleton.decorator";
import { v4 as uuidv4 } from 'uuid';

@singleton
export class TraceIdUtil {
    generateTraceId() {
        return uuidv4();
    }
}
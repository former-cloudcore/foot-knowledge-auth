import { singleton } from "../decorators/singleton.decorator";

@singleton
export class LoggerUtil {
    private traceId: string = '';

    setTraceId(traceId: string) {
        this.traceId = traceId;
    }

    getTraceId(): string {
        return this.traceId;
    }

    log(functionName: string, ...optionalParams: any[]) {
        console.log(this.getTraceId() + " -- ", functionName, optionalParams);
    }
}
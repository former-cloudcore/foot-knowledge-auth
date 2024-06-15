export class LoggerUtil {

    private traceId: string = '';
    private static instance: LoggerUtil;

    static getInstance() {
        this.instance ??= new LoggerUtil();
        return this.instance;
    }

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

import {ExpressMiddlewareInterface, Middleware} from "routing-controllers";
import {LoggerUtil} from "../utils/logger.util";
import {TraceIdUtil} from "../utils/trace-id.util";

@Middleware({ type: 'before' })
export class TraceIdLogger implements ExpressMiddlewareInterface {
    use(request: any, response: any, next: (err: any) => any): void {
        const traceId = new TraceIdUtil().generateTraceId();
        new LoggerUtil().setTraceId(traceId);
        new LoggerUtil().log("traceIdLogger", traceId)
        next(null);
    }
}

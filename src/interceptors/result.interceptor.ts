import {Action, Interceptor, InterceptorInterface} from 'routing-controllers';
import {ResultDTO} from "../dto/http/result.dto";
import {StatusCodes} from "http-status-codes";

@Interceptor()
export class ResponseInterceptor implements InterceptorInterface {
    intercept(action: Action, content: any): ResultDTO {
        console.log(`Successfully carried out ${action.request.method} on ${action.request.url}`);
        return {
            type: StatusCodes.OK,
            reason: content
        };
    }
}

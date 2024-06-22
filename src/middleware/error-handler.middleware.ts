import {ExpressErrorMiddlewareInterface, Middleware} from 'routing-controllers';
import {Response} from "express";
import {StatusCodes} from "http-status-codes";

@Middleware({type: 'after'})
export class ErrorHandlingMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, req: Request, res: Response): void {
        error.type ??= StatusCodes.BAD_REQUEST;
        console.log(error.message, `\nError: ${error.errors ?? error.type}`);
        res.status(error.type).json({
            type: error.type,
            reason: this.produceReason(error),
            errors: error?.errors ?? []
        });
    }

    private produceReason(error: any): any {
        return {
            message: error?.message ?? 'Internal server error',
            stack: error?.stack
        };
    }
}

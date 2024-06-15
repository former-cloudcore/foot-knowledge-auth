import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { Express } from "express";
import "reflect-metadata";
import {Action, createExpressServer, getMetadataArgsStorage, MetadataArgsStorage} from "routing-controllers";
import { TraceIdLogger } from "./src/middleware/trace.middleware";
import * as swaggerUiExpress from "swagger-ui-express";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { AuthController } from "./src/api/auth.controller";
import { AuthService } from "./src/api/auth.service";
import { ResponseInterceptor } from "./src/interceptors/result.interceptor";
import { ErrorHandlingMiddleware } from "./src/middleware/error-handler.middleware";
import { AUTH_REPLACE_VALUE } from "./src/config/consts";
import { PORT } from "./src/config/consts";

const { defaultMetadataStorage } = require("class-transformer/cjs/storage");
const routingControllersOptions = {
    controllers: [AuthController],
    routePrefix: "/api",
};

class Server {
    static run(): void {
        const app: Express = this.getExpressServer();
        this.initDocs(app);
        app.listen(PORT);
        console.log(`Server is running on port ${PORT}`);
    }

    private static getExpressServer(): Express {
        return createExpressServer({
            controllers: [...routingControllersOptions.controllers],
            cors: {
                origin: '*'
            },
            interceptors: [ResponseInterceptor],
            routePrefix: routingControllersOptions.routePrefix,
            middlewares: [TraceIdLogger, ErrorHandlingMiddleware],
            defaultErrorHandler: false,
            validation: true,
            authorizationChecker: (action: Action) => AuthService.validateToken((action.request.headers["Authorization"] ?? action.request.headers["authorization"])?.replace(AUTH_REPLACE_VALUE, ''))
        });
    }

    private static initDocs(app: Express): void {
        const schemas: any = validationMetadatasToSchemas({
            classTransformerMetadataStorage: defaultMetadataStorage,
            refPointerPrefix: "#/components/schemas/",
        });

        const storage: MetadataArgsStorage = getMetadataArgsStorage();
        const spec = routingControllersToSpec(storage, routingControllersOptions, {
            components: {
                schemas,
                securitySchemes: {
                    basicAuth: {
                        scheme: "basic",
                        type: "http",
                    },
                },
            },
            info: {
                title: "Auth API",
                description: "Auth",
                version: "1.0.0",
            },
        });

        app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
    }
}

Server.run();

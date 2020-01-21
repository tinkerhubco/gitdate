import {
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MeInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.accessToken;

    if (accessToken && accessToken.user) {
      // perform 'me' substitution
      const keys = Object.keys(request.params || {});

      if (keys.length > 0) {
        for (const key of keys) {
          if (request.params[key] === 'me') {
            // TODO do we need to make model and primarykey configurable/discoverable?
            request.params[key] = accessToken.user.id.toString();
          }
        }
      }
    }
    return next.handle();
  }
}

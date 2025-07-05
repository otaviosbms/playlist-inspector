import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];
        const VALID_TOKEN = this.configService.get<string>('BEARER_TOKEN');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token de autenticação ausente');
        }

        const token = authHeader.split(' ')[1];
        if (token !== VALID_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }

        return true;
    }
}

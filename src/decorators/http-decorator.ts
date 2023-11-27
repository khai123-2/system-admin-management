import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function Auth(summaryApi?: string) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt')),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiOperation({ summary: summaryApi }),
  );
}

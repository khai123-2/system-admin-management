import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EmployeeModule } from './employee/employee.module';
import { PermissionModule } from './permission/permission.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { SharedModule } from './shared/shared.module';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    RoleModule,
    CustomerModule,
    EmployeeModule,
    PermissionModule,
    AuthModule,
    SharedModule,
  ],
})
export class AppModule {}

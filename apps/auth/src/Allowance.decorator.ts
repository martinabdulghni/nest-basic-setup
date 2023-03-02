import { SetMetadata } from '@nestjs/common';
import { AllowanceType } from 'libs/types/allowance';


export const Allowances = (...Allowances: AllowanceType[]) => SetMetadata('allowances', Allowances);

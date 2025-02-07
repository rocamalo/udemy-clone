import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  async createPaymentIntent(
    @Body('amount') amount: number,
    @Body('currency') currency: string,
    @Body('purchaseId') purchaseId: string,
  ) {
    return this.paymentsService.createPaymentIntent(amount, currency, purchaseId);
  }

  @Post('confirm')
  async confirmPayment(@Body('clientSecret') clientSecret: string) {
    return this.paymentsService.confirmPayment(clientSecret);
  }
}

import pkg from 'authorizenet';
const { APIContracts, APIControllers } = pkg;

const createTransaction = async () => {
  const merchantAuthentication = new APIContracts.MerchantAuthenticationType();
  merchantAuthentication.setName('DigitalLibrary');
  merchantAuthentication.setTransactionKey('DvoraAndYael14');

  const creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber('4242424242424242');
  creditCard.setExpirationDate('12/30');
  creditCard.setCardCode('123');

  const paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const transactionRequest = new APIContracts.TransactionRequestType();
  transactionRequest.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
  transactionRequest.setPayment(paymentType);
  transactionRequest.setAmount('10.00');

  const createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthentication);
  createRequest.setTransactionRequest(transactionRequest);

  const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());

  return new Promise((resolve, reject) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new APIContracts.CreateTransactionResponse(apiResponse);

      if (response.getMessages().getResultCode() === 'Ok') {
        const transId = response.getTransactionResponse().getTransId();
        console.log(`✔ הצליח. Transaction ID: ${transId}`);
        resolve(transId);
      } else {
        const errorMsg = response.getMessages().getMessage()[0].getText();
        console.log(`✖ נכשל: ${errorMsg}`);
        reject(new Error(errorMsg));
      }
    });
  });
};

createTransaction().catch((err) => {
  console.error('שגיאה בביצוע התשלום:', err.message);
});

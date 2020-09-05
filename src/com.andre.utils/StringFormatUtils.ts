export class StringFormatUtils{

    public static FormatMoney(number):string {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
          
          return formatter.format(number);
    }    
}

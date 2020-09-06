export class StringFormatUtils{

    public static FormatMoney(number):string {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
          
          return formatter.format(number);
    }    

    public static FormatTime(time:number):string {
        return new Date(time).toISOString().slice(11,19)
    }    
}

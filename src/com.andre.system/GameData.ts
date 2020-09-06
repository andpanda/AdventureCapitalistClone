import { PlayerData } from "../com.andre.system/PlayerData";
import { InvestmentData } from '../com.andre.ui/Investment';

export class GameData {
    public static investmentsData: Array<InvestmentData> = [{ investmentName: "Lemonade Stand", startTime: 0, own: 1, basePrice: 50, costIncrement: 0.05, duration: 1, revenue: 10, endTime: 0, isRunning: false, haveManager: false },
    { investmentName: "Newspaper", startTime: 0, own: 0, basePrice: 100, costIncrement: 0.1, duration: 2, revenue: 100, endTime: 0, isRunning: false, haveManager: false },
    { investmentName: "Car Wash", startTime: 0, own: 0, basePrice: 200, costIncrement: 0.1, duration: 3, revenue: 200, endTime: 0, isRunning: false, haveManager: false },
    { investmentName: "Pizza Place", startTime: 0, own: 0, basePrice: 300, costIncrement: 0.1, duration: 4, revenue: 300, endTime: 0, isRunning: false, haveManager: false },
    { investmentName: "Donut Store", startTime: 0, own: 0, basePrice: 400, costIncrement: 0.1, duration: 5, revenue: 500, endTime: 0, isRunning: false, haveManager: false },
    { investmentName: "Shrimp", startTime: 0, own: 0, basePrice: 500, costIncrement: 0.1, duration: 6, revenue: 600, endTime: 0, isRunning: false, haveManager: false },
    { investmentName: "Hockey Team", startTime: 0, own: 0, basePrice: 600, costIncrement: 0.1, duration: 7, revenue: 700, endTime: 0, isRunning: false, haveManager: false },
    { investmentName: "Film Maker", startTime: 0, own: 0, basePrice: 700, costIncrement: 0.1, duration: 8, revenue: 800, endTime: 0, isRunning: false, haveManager: false },
    { investmentName: "Bank", startTime: 0, own: 0, basePrice: 800, costIncrement: 0.1, duration: 10, revenue: 1000, endTime: 0, isRunning: false, haveManager: false },
    { investmentName: "Oil", startTime: 0, own: 0, basePrice: 1000, costIncrement: 0.1, duration: 30, revenue: 2000, endTime: 0, isRunning: false, haveManager: false }];

    public static managerNames:Array<string> = ['The Man','Perry Black','Bailey','Tony Tiger','Shags','Grumpy','Jin','Not Hannibal','Ralphchoo','Mr Hamilton','Ralphchoo'];    
    public static managerPrices:Array<number> = [5000,10000,50000,66666,100000,200000,300000,400000,500000,600000];    


    public static Save(){
        localStorage.setItem('money', '' + PlayerData.money);        
        localStorage.setItem('investmentData', JSON.stringify(GameData.investmentsData));
    }

    public static Load(){
        let invData = localStorage.getItem('investmentData');
        let money = Number.parseInt(localStorage.getItem('money'));                
        if(invData != null) GameData.investmentsData = JSON.parse(invData);
        if(!Number.isNaN(money)) PlayerData.money = money;                    
    }
}
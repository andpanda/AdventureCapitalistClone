import 'phaser';
import { Investment, InvestmentData } from './com.andre.ui/Investment';
import { StringFormatUtils } from './com.andre.utils/StringFormatUtils';
import { PlayerData } from './com.andre.data/PlayerData';
import { GameData } from './com.andre.system/GameData';

export default class MainScreen extends Phaser.Scene {
    private investments: Array<Investment> = new Array<Investment>();
    private moneyLabel: Phaser.GameObjects.Text;

    constructor() {
        super('mainscreen');
    }

    //preload all game assets first
    preload() {
        //investment iconsÞ
        for (var i = 0; i < 10; i++) {
            var n = (i + 1);
            this.load.image('investment_logo_' + n, 'assets/Investment/Icons/invest_' + n + '.png');
        }
        this.load.image('ref', 'assets/ref.png');

        this.load.image('investment-frame', 'assets/Investment/investment-frame.png');
        this.load.image('investment-progress-bg', 'assets/Investment/investment-progress-bg.png');
        this.load.image('investment_bubble', 'assets/Investment/investment_bubble.png');

        this.load.image('invest_btn', 'assets/Investment/invest_btn.png');
        this.load.image('invest_btn_pressed', 'assets/Investment/invest_btn_pressed.png');
        this.load.image('invest_btn_disabled', 'assets/Investment/invest_btn_disabled.png');
        this.load.image('meter_green', 'assets/Investment/MeterGreen.png');
        this.load.image('inactive_investment', 'assets/Investment/inactive_investment.png');
        this.load.image('investment_purchase', 'assets/Investment/investment_purchase.png');11

        this.load.image('menu_option', 'assets/Misc/menu_option.png');
    }

    create() {
        //this was used as a reference guide for the UI
        let ref = this.add.image(this.cameras.default.width / 2, this.cameras.default.height / 2, 'ref');
        //ref.alpha = 0.5; 
        //localStorage.clear();
        GameData.Load();

        PlayerData.money = 1000000;

        this.CheckOfflineEarnings();

        this.moneyLabel = this.add.text(250, 12, '$ 0.00', { font: '50px Arial' });

        let k: number = 0;
        let offsetX: number = 0;

        //draw the buttons
        for (let i = 0; i < 10; i++) {
            if (i == 5) {
                offsetX = 400;
                k = 0;
            }
            this.investments.push(new Investment(this, (i + 1), 322 + offsetX, 146 + 96 * k, GameData.investmentsData[i]));

            k++;
        }

        let menuTitles:string[] = ['Unlocks', 'Upgrades', 'Managers', 'Investors'];
        for(let i = 0; i < menuTitles.length; i++){
            let menuOption:Phaser.GameObjects.Image = this.add.image(122, 224 + 73 * i, 'menu_option');
            menuOption.scale = 0.45;
            let menuText:Phaser.GameObjects.Text = this.add.text(menuOption.x - 12, menuOption.y - 10, menuTitles[i], { color: 'grey' });
        }        

    }
    
    update() {        
        this.moneyLabel.text = StringFormatUtils.FormatMoney(PlayerData.money);

        for (let i = 0; i < this.investments.length; i++) {
            this.investments[i].update();
        }
    }

    private CheckOfflineEarnings() {
        let totalEarned = 0;
        for (let i = 0; i < GameData.investmentsData.length; i++) {
            let inv:InvestmentData = GameData.investmentsData[i];
            if(inv.haveManager){
                let timeleft: number = inv.endTime - Date.now();            
                if(timeleft < 0){
                    let timesEarned:number = Math.floor(Math.abs(timeleft) / (inv.duration * 1000));                                        
                    totalEarned = timesEarned * (inv.revenue * inv.own);
                }                
            }
        }
        
        PlayerData.money += totalEarned;
        GameData.Save();
    }

    OnButtonClicked() {
        console.log("hii");
    }

}

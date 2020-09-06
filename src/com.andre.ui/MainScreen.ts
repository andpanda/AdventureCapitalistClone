import 'phaser';
import { Investment, InvestmentData } from './Investment';
import { StringFormatUtils } from '../com.andre.utils/StringFormatUtils';
import { PlayerData } from '../com.andre.system/PlayerData';
import { GameData } from '../com.andre.system/GameData';
import { Manager } from './Manager';

export default class MainScreen extends Phaser.Scene {
    private investments: Array<Investment> = new Array<Investment>();
    private moneyLabel: Phaser.GameObjects.Text;

    constructor() {
        super('mainscreen');
    }

    //preload all game assets first
    preload() {
        //investment icons
        for (var i = 0; i < 10; i++) {
            var n = (i + 1);
            this.load.image('investment_logo_' + n, 'assets/Investment/Icons/invest_' + n + '.png');
        }

        //manager icons
        for (var i = 0; i < 10; i++) {            
            this.load.image('manager_' + i, 'assets/Managers/Icons/' + i + '.png');
        }

        this.load.image('ref', 'assets/ref.png');
        this.load.image('ref2', 'assets/ref2.png');
        this.load.image('ref3', 'assets/ref3.png');

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
        this.load.image('btn_close_normal', 'assets/Misc/btn_close_normal.png');
        this.load.image('btn_close_pressed', 'assets/Misc/btn_close_pressed.png');

        this.load.image('btn_close_pressed', 'assets/Misc/btn_close_pressed.png');

        this.load.image('manager_upgrade_disabled', 'assets/Managers/manager_upgrade_disabled.png');
        this.load.image('manager_upgrade_enabled', 'assets/Managers/manager_upgrade_enabled.png');
    }

    create() {
        //this was used as a reference guide for the UI
        let ref = this.add.image(this.cameras.default.width / 2, this.cameras.default.height / 2, 'ref');
        //ref.alpha = 0.5; 
        //localStorage.clear();
        GameData.Load();        

        this.CheckOfflineEarnings();

        this.moneyLabel = this.add.text(250, 12, '$ 0.00', { font: '50px Arial' });

        let k: number = 0;
        let offsetX: number = 0;

        //draw the buttons
        for (let i = 0; i < GameData.investmentsData.length; i++) {
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
            let menuTitle:string = menuTitles[i];
            let menuText:Phaser.GameObjects.Text = this.add.text(menuOption.x - 12, menuOption.y - 10, menuTitle, { color: 'grey' });

            if(menuTitle == 'Managers'){
                menuOption.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    this.OnOpenManagers();
                });                
            }
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

        if(totalEarned > 0){

        }
        
        PlayerData.money += totalEarned;
        GameData.Save();
    }

    private OnOpenManagers() {
        let ref = this.add.image(this.cameras.default.width / 2, this.cameras.default.height / 2, 'ref2');        
        ref.setInteractive({ useHandCursor: false })
        .on('pointerdown', () => {
            event.stopPropagation();
        });    

        let container:Phaser.GameObjects.Container = this.add.container(450, 350);        
        for(let i = 0; i < GameData.investmentsData.length; i++) {            
            container.add(new Manager(this, i, 0, 100 * i));
        }          
        
        var mask = this.add.graphics();

        //  Shapes drawn to the Graphics object must be filled.
        mask.fillRect(200, 300, 800, 640);        

        //	And apply it to the Sprite
        //  Comment out this line to see the mask visually
        container.setMask(mask.createGeometryMask());

        let btnClose = this.add.image(this.cameras.default.width - 100, 80, 'btn_close_normal');        
        btnClose.setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            btnClose.setTexture('btn_close_pressed')            
        })
        .on('pointerout', () => {
            btnClose.setTexture('btn_close_normal')            
        })
        .on('pointerup', () => {
            container.destroy();
             ref.destroy();
            btnClose.destroy();
        });   
        
        var zone = this.add.zone(200, 0, 480, 640).setOrigin(0).setInteractive();

        zone.on('pointermove', function (pointer:any) {                        
            if (pointer.isDown)
            {                
                container.y += (pointer.velocity.y / 6);
                container.y = Phaser.Math.Clamp(container.y, -500, 400);               
            }

        });
    }

}

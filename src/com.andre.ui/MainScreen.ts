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

        this.load.image('dandy_normal', 'assets/Misc/dandy_normal.png');        
        this.load.image('dandy_over', 'assets/Misc/dandy_over.png');        
    }

    create() {
        //this was used as a reference guide for the UI
        let ref = this.add.image(this.cameras.default.width / 2, this.cameras.default.height / 2, 'ref');
        //ref.alpha = 0.5; 
        //localStorage.clear();
        GameData.Load();                

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
            let menuText:Phaser.GameObjects.Text = this.add.text(menuOption.x - 20, menuOption.y - 17, menuTitle, { font: '24px tabitha', color: '#605249' });

            if(menuTitle == 'Managers'){
                menuOption.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    this.OnOpenManagers();
                });                
            }
        }    
        
        this.CheckOfflineEarnings();
    }
    
    update() {        
        this.moneyLabel.text = StringFormatUtils.FormatMoney(PlayerData.money);

        for (let i = 0; i < this.investments.length; i++) {
            this.investments[i].update();
        }
    }

    private CheckOfflineEarnings() {
        let totalEarned = 0;
        let timeAway: number = Math.abs(GameData.investmentsData[0].endTime - Date.now());            
        for (let i = 0; i < GameData.investmentsData.length; i++) {
            let inv:InvestmentData = GameData.investmentsData[i];
            if(inv.haveManager){
                let timeleft: number = inv.endTime - Date.now();                            
                
                if(timeleft < 0){
                    let timesEarned:number = Math.floor(Math.abs(timeleft) / (inv.duration * 1000));                    
                                                            
                    totalEarned += timesEarned * (inv.revenue * inv.own);                    
                }                
            }
        }            
        
        if(totalEarned > 0){
            this.ShowOfflineEarnignPopup(totalEarned, timeAway);
        }
        
        PlayerData.money += totalEarned;
        GameData.Save();
    }

    private ShowOfflineEarnignPopup(totalEarned:number, offlineTime:number) {
        let container:Phaser.GameObjects.Container = this.add.container(0, 0);

        let bg = this.add.image(this.cameras.default.width / 2, this.cameras.default.height / 2, 'ref');
        bg.scale = 2;
        bg.setInteractive({ useHandCursor: false })
        .on('pointerdown', () => {
            event.stopPropagation();
        }); 
        //ref.alpha = 0.6;
        container.add(bg);

        container.add(this.add.text(105, 54, 'Welcome back Capitalist!',  { font: '90px tabitha', fill: '#539DC0'  }));
        container.add(this.add.text(340, 180, 'You were offline for ' + StringFormatUtils.FormatTime(offlineTime),  { font: '30px tabitha', fill: '#FFFFFF'  }));
        container.add(this.add.text(440, 250, 'You earned',  { font: '30px tabitha', fill: '#FFFFFF'  }));        
        container.add(this.add.text(500, 332, '' + StringFormatUtils.FormatMoney(totalEarned),  { font: '30px tabitha', fill: '#00FF00'  }).setOrigin(0.5,0.5));
        container.add(this.add.text(388, 360, 'while you were gone',  { font: '30px tabitha', fill: '#FFFFFF'  }));
        container.add(this.add.text(130, 440, 'Now get in there and maximize those profits, you job creator!',  { font: '30px tabitha', fill: '#FFFFFF'  }));
        
        let dandyBtn:Phaser.GameObjects.Image = this.add.image(890, 570, 'dandy_normal')                
        dandyBtn.setInteractive({ useHandCursor: true })            
            .on('pointerover', () => {
                dandyBtn.setTexture('dandy_over')
            })
            .on('pointerout', () => {
                dandyBtn.setTexture('dandy_normal')
            })
            .on('pointerdown', () => {
               container.destroy();
            });            
        container.add(dandyBtn);        
        container.add(this.add.text(dandyBtn.x - 48, dandyBtn.y - 25, 'Dandy!', {font: '38px tabitha', fill: '#212121'}));
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

        var zone = this.add.zone(200, 0, 480, 640).setOrigin(0).setInteractive();

        zone.on('pointermove', function (pointer:any) {                        
            if (pointer.isDown)
            {                
                container.y += (pointer.velocity.y / 6);
                container.y = Phaser.Math.Clamp(container.y, -500, 400);               
            }

        });

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
            zone.setInteractive(false);
            zone.destroy();
        });                   
    }

}

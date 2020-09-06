import 'phaser';
import { Scene, Data } from 'phaser';
import { StringFormatUtils } from '../com.andre.utils/StringFormatUtils';
import { PlayerData } from '../com.andre.system/PlayerData';
import { GameData } from '../com.andre.system/GameData';

export class Investment extends Phaser.GameObjects.GameObject {
    private id:number;
    private iData: InvestmentData;
    private ownLabel: Phaser.GameObjects.Text;
    private timerText: Phaser.GameObjects.Text;
    private progressBar: Phaser.GameObjects.Image;
    private priceText: Phaser.GameObjects.Text;
    private revenueText: Phaser.GameObjects.Text;  
    
    private frameBg:Phaser.GameObjects.Image;
    private investmentBtn:Phaser.GameObjects.Image;
    private mouseOverButton:boolean;

    constructor(scene: Scene, id: number, x: number, y: number, iData: InvestmentData) {
        super(scene, 'sprite');

        this.iData = iData;

        this.id = id;
        if (this.OwnInvestment()) {
            this.DrawInvestment(scene, id, x, y);
        } else {
            this.frameBg = scene.add.image(x + 122, y, 'inactive_investment');
            this.frameBg.scale = 0.8;
            let t1 = scene.add.text(this.frameBg.x, this.frameBg.y - 14, iData.investmentName, {font: '24px tabitha', color: '#323232'}).setOrigin(0.5, 0.5);
            let t2 = scene.add.text(this.frameBg.x, this.frameBg.y + 14, StringFormatUtils.FormatMoney(iData.basePrice), {font: '24px tabitha', color: '#FFFFFF'}).setOrigin(0.5, 0.5);

            this.frameBg.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    if (this.CanPurchase()) {
                        this.DrawInvestment(scene, id, x, y);

                        this.OnPurchase(1);

                        this.frameBg.destroy();
                        t1.destroy();
                        t2.destroy();
                    }
                });
        }
    }

    private OwnInvestment():boolean{
        return this.iData.own > 0;
    }

    private GetCurrentCost(): number {

        return this.iData.basePrice + (this.iData.basePrice * this.iData.costIncrement) * this.iData.own;
    }

    private CanPurchase():boolean{
        return PlayerData.money >= this.GetCurrentCost();
    }

    private OnPurchase(quant: number) {
        PlayerData.money -= this.GetCurrentCost();
        this.iData.own += quant;
        this.ownLabel.text = '' + this.iData.own;
        this.priceText.text = StringFormatUtils.FormatMoney(this.GetCurrentCost());
        this.revenueText.text = StringFormatUtils.FormatMoney(this.GetTotalRevenue());

        console.log(this.id);
        
        var particles = this.scene.add.particles('investment_logo_' + this.id);

        //dont use blend mode for last ico because it is black and will not appear if used
        let blendMode = 'SCREEN';
        if(this.id == 10) blendMode = '';

        var emitter = particles.createEmitter({            
            x: 400,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: blendMode,
            //active: false,
            lifespan: 600,
            gravityY: 800                       
        });

        emitter.stop();
        emitter.emitParticle(5, this.ownLabel.x, this.ownLabel.y);                

        GameData.Save();
    }

    private DrawInvestment(scene: Scene, id: number, x: number, y: number) {
        let bubble: Phaser.GameObjects.Image = scene.add.image(x, y, 'investment_bubble');
        bubble.scale = 0.55;

        let investmentFrame: Phaser.GameObjects.Image = scene.add.image(x, y, 'investment-frame');
        investmentFrame.scale = 0.55;
        let logo: Phaser.GameObjects.Image = scene.add.image(investmentFrame.x, investmentFrame.y - 8, 'investment_logo_' + id);
        logo.scale = 0.6;
        this.ownLabel = scene.add.text(investmentFrame.x, investmentFrame.y + 16, '' + this.iData.own, {font: '20px tabitha', color: '#FFFFFF'});
        this.ownLabel.setOrigin(0.5, 0);        

        investmentFrame.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.RunInvestment();
            });

        let investmentProgressBg: Phaser.GameObjects.Image = scene.add.image(investmentFrame.x + 168, investmentFrame.y - 19, 'investment-progress-bg');
        investmentProgressBg.scale = 0.75;

        investmentProgressBg.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.RunInvestment();
            });

        //bar used to display the investment progress
        let greenBar: Phaser.GameObjects.Image = scene.add.image(investmentProgressBg.x - 116, investmentProgressBg.y, 'meter_green');
        greenBar.scale = 0.65;
        greenBar.setOrigin(1, 0.5);
        greenBar.scaleX = 0;

        this.revenueText = scene.add.text(investmentProgressBg.x, investmentProgressBg.y - 12, StringFormatUtils.FormatMoney(this.GetTotalRevenue()), {font: '20px tabitha', color: '#FFFFFF'});
        this.revenueText.setOrigin(0.5, 0);

        this.progressBar = greenBar;

        var mask = investmentProgressBg.createBitmapMask();

        greenBar.setMask(mask);

        this.investmentBtn = scene.add.image(investmentFrame.x + 130, investmentFrame.y + 28, 'invest_btn');
        this.investmentBtn.scaleX = 0.7;
        this.investmentBtn.scaleY = 0.5;

        this.investmentBtn.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.mouseOverButton = true)
            .on('pointerout', () => this.mouseOverButton = false)
            .on('pointerdown', () => {
                if(this.CanPurchase()){                    
                    if (PlayerData.money >= this.GetCurrentCost()) this.OnPurchase(1)
                }                
            })
            // .on('pointerup', () => { 
            //     if(this.CanPurchase()){
            //         this.investmentBtn.setTexture('invest_btn'); 
            //     }                 
            // });

        let buyText: Phaser.GameObjects.Text = scene.add.text(this.investmentBtn.x - 63, this.investmentBtn.y - 20, 'Buy', {font: '18px tabitha', color: '#FFFFFF'});
        scene.add.text(buyText.x, buyText.y + 18, 'x1', {font: '18px tabitha', color: '#FFFFFF'});
        let bPrice: number = this.iData.basePrice;
        this.priceText = scene.add.text(buyText.x + 130, buyText.y, StringFormatUtils.FormatMoney(this.GetCurrentCost()), {font: '18px tabitha', color: '#FFFFFF'});
        this.priceText.setOrigin(1, 0);        

        let timerBtn = scene.add.image(this.investmentBtn.x + 126, this.investmentBtn.y, 'invest_btn_disabled');
        timerBtn.scaleX = 0.42;
        timerBtn.scaleY = 0.5;
        this.timerText = scene.add.text(timerBtn.x, timerBtn.y, '00:00:00', {font: '18px tabitha', color: '#FFFFFF'})
        this.timerText.setOrigin(0.5, 0.5);

        if(this.iData.haveManager) this.RunInvestment();
    }

    private RunInvestment() {
        if (this.iData.isRunning) return;

        this.iData.startTime = Date.now();
        this.iData.endTime = this.iData.startTime + (this.iData.duration * 1000);
        this.iData.isRunning = true;

        GameData.Save();
    }

    private GetTotalRevenue(): number {
        return this.iData.revenue * this.iData.own;
    }

    update() {
        if(!this.OwnInvestment()){
            this.frameBg.setTexture(this.CanPurchase() ? 'investment_purchase' : 'inactive_investment');         
        }else{
            if(this.CanPurchase()){                
                this.investmentBtn.setTexture(this.mouseOverButton ? 'invest_btn_pressed' : 'invest_btn');
            }else {
                this.investmentBtn.setTexture('invest_btn_disabled');
            }            
        }                  

        if (this.iData.isRunning) {
            let timeleft: number = this.iData.endTime - Date.now();            
            
            this.timerText.text = StringFormatUtils.FormatTime(timeleft);

            let d = this.iData.duration * 1000;
            let l = ((timeleft - d) / d);            

            this.progressBar.scaleX = l;

            if (timeleft <= 0) {
                this.progressBar.scaleX = 0;
                this.iData.isRunning = false;
                this.timerText.text = '00:00:00';
                PlayerData.money += this.iData.revenue * this.iData.own;

                GameData.Save();                
                
                //if (this.iData.haveManager) this.RunInvestment();
            }
        }

        if(this.iData.haveManager && !this.iData.isRunning) this.RunInvestment();
    }
}

export interface InvestmentData {
    investmentName: string; //the name displayed 
    startTime: number; //time that the investment started to be used to generated revenue    
    own: number; //total owned investments
    basePrice: number; //investment base price       
    costIncrement: number; //ratio that the cost will be inremented for each purchase. eg: 0.1 == 10%
    duration: number; //total duration of the process in seconds    
    revenue: number; // revenue generated for each process    
    endTime: number; //end time of the process
    isRunning: boolean; //is process running
    haveManager: boolean; //manager is enable for auto run
}
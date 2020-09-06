import 'phaser';
import { Scene, Game } from 'phaser';
import { GameData } from '../com.andre.system/GameData';
import { StringFormatUtils } from '../com.andre.utils/StringFormatUtils';
import { PlayerData } from '../com.andre.system/PlayerData';

export class Manager extends Phaser.GameObjects.Container {    
    private id:number;
    private hireBtn:Phaser.GameObjects.Image;
    private hireLabel:Phaser.GameObjects.Text
    
    constructor(scene: Scene, id: number, x: number, y: number) {
        super(scene,  x, y);

        this.id = id;
                         
        scene.add.existing(this);

        let managerIcon:Phaser.GameObjects.Image = scene.add.image(-100, 10, 'manager_' + id);
        managerIcon.scale = 0.35;
        this.add(managerIcon)
        this.add(scene.add.text(0, -24, GameData.managerNames[id], {font: '22px tabitha', color: '#539DC0'}));
        this.add(scene.add.text(0, 0, 'Runs ' + GameData.investmentsData[id].investmentName, {font: '18px tabitha', fill: '#E6E9E7'}));
        this.add(scene.add.text(0, 24, StringFormatUtils.FormatMoney(GameData.managerPrices[id]), {font: '20px tabitha', fill: '#514940'}));
                
        this.hireBtn = scene.add.image(280, 0, 'manager_upgrade_disabled')        
        this.hireBtn.scale = 0.9;
        this.hireBtn.setInteractive({ useHandCursor: true })            
            .on('pointerdown', () => {
                if(this.CanPurchase()){                    
                    PlayerData.money -= GameData.managerPrices[id];
                    GameData.investmentsData[id].haveManager = true;
                    GameData.Save();
                }
            });            
        this.add(this.hireBtn);        
        this.hireLabel = scene.add.text(this.hireBtn.x - 34, this.hireBtn.y - 24, 'Hire!', {font: '38px tabitha', fill: '#736960'})
        this.hireLabel.setRotation(-0.1);        
        this.add(this.hireLabel);        
    }
    
    private CanPurchase():boolean{
        return PlayerData.money >= GameData.managerPrices[this.id];
    }

    preUpdate(){
        if(this.CanPurchase() && !GameData.investmentsData[this.id].haveManager){
            //this.hireBtn.setTexture('manager_upgrade_enabled');
            this.hireBtn.tint = 0x97BFD4;
            //this.hireBtn.setTint();
            this.hireLabel.setColor('#FFFFFF');            
        }else{
            //this.hireBtn.setTexture('manager_upgrade_disabled');
            this.hireLabel.setColor('#736960');            
            this.hireBtn.tint = 0xFFFFFF;
        }
    }
}
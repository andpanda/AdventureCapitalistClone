import 'phaser';
import { Scene, Game } from 'phaser';
import { GameData } from '../com.andre.system/GameData';
import { StringFormatUtils } from '../com.andre.utils/StringFormatUtils';
import { PlayerData } from '../com.andre.system/PlayerData';

export class Manager extends Phaser.GameObjects.Container {    
    private id:number;
    private hireBtn:Phaser.GameObjects.Image;
    
    constructor(scene: Scene, id: number, x: number, y: number) {
        super(scene,  x, y);

        this.id = id;
                         
        scene.add.existing(this);

        let managerIcon:Phaser.GameObjects.Image = scene.add.image(-100, 10, 'manager_' + id);
        managerIcon.scale = 0.35;
        this.add(managerIcon)
        this.add(scene.add.text(0, -20, GameData.managerNames[id], {fill: '#539DC0'}));
        this.add(scene.add.text(0, 0, 'Runs ' + GameData.investmentsData[id].investmentName, {fill: '#E6E9E7'}));
        this.add(scene.add.text(0, 20, StringFormatUtils.FormatMoney(GameData.managerPrices[id]), {fill: '#514940'}));
                
        this.hireBtn = scene.add.image(280, 0, 'manager_upgrade_enabled')        
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
        this.add(scene.add.text(this.hireBtn.x - 8, this.hireBtn.y + 4, 'HIRE', {fill: '#DCDCDC'}));
        //scene.add.image(x + 122, y, 'inactive_investment');
    }
    
    private CanPurchase():boolean{
        return PlayerData.money >= GameData.managerPrices[this.id];
    }

    preUpdate(){
        if(this.CanPurchase() && !GameData.investmentsData[this.id].haveManager){
            this.hireBtn.setTexture('manager_upgrade_enabled');
        }else{
            this.hireBtn.setTexture('manager_upgrade_disabled');
        }
    }
}
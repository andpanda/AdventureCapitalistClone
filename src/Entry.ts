import 'phaser';
import MainScreen from './com.andre.ui/MainScreen';

export default class Entry extends Phaser.Scene
{
    constructor ()
    {
        super('main');
    }
    
    preload ()
    {                
        this.scene.add('MainScreen', MainScreen, true);
    }

    create ()
    {                
        this.scene.start('MainScreen')
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#111111',
    width: 1080,
    height: 640,
    scene: Entry
};

const game = new Phaser.Game(config);

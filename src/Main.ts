import 'phaser';
import MainScreen from './MainScreen';

export default class Main extends Phaser.Scene
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
    scene: Main
};

const game = new Phaser.Game(config);

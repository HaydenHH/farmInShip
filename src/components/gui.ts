import * as GUI from 'babylonjs-gui'
import * as BABYLON from 'babylonjs'
import PlayerStateMachine from './playerState'



class UI {
    ui: GUI.AdvancedDynamicTexture
    text_speed?:GUI.TextBlock
    box_speed?:GUI.Rectangle
    player?:BABYLON.AbstractMesh
    stateMachine:PlayerStateMachine
    box_speedWidth= 1
    constructor(stateMachine:PlayerStateMachine) {
        
        // console.log(noise);
        
        this.stateMachine=stateMachine
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        const bg =new  GUI.Image('main','./uiBg.png')
  
        
        bg.stretch=GUI.Image.STRETCH_UNIFORM
        this.ui.addControl(bg)

    }
    speedUI(player:BABYLON.AbstractMesh) {
        this.player = player
        this.text_speed=new GUI.TextBlock();
        this.text_speed.text = String(Math.abs(Math.floor(this.player?.physicsImpostor?.getLinearVelocity()?.z||0)));
    
        this.text_speed.color = "white";
        this.text_speed.fontSize = 24;
        this.ui.addControl(this.text_speed);

        const box = new GUI.Rectangle()
        box.width='1px'
        box.height='10px'
        // box.color='red'
        box.horizontalAlignment=GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        box.background='#2CE2FB'
        box.thickness=0
        box.left='15%'
        box.top='46%'
        this.box_speed = box
        this.ui.addControl(this.box_speed)

    }
    udpate() {
        this.box_speedWidth++
        if(this.text_speed)this.text_speed.text = String(this.player?.rotationQuaternion?._y.toFixed(2));
        // if(this.box_speed&&!this.stateMachine.states.stop.isIn) this.box_speed.width = Math.abs(Math.sin(this.box_speedWidth/10)*300) + 'px'
        if(this.box_speed&&!this.stateMachine.states.stop.isIn) this.box_speed.width = Math.abs((this.player?.physicsImpostor?.getLinearVelocity()?.z||1))*10 + 'px'

    }
}

export default UI
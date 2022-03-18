import * as BABYLON from 'babylonjs'
import { Vec3 } from 'cannon'

const PlayerGoForwardBehavior = (player: BABYLON.AbstractMesh,velocity:number) => {
    const ele = player.getDescendants().find(x=>x.name.includes('wheelFLControl'));
    const ang = (ele as BABYLON.AbstractMesh).rotationQuaternion!.y;
    // console.log(ang);
    
    player.translate(BABYLON.Axis.Z, -1, BABYLON.Space.LOCAL)
    player.rotate(BABYLON.Axis.Y, -ang/25, BABYLON.Space.LOCAL)
    player.getDescendants().filter(ele=>ele.name.includes('wheel'||'Wheel')&&!ele.name.includes('Control')).forEach(ele=>{
        
        (ele as BABYLON.AbstractMesh).rotate(BABYLON.Axis.Z, -Math.PI/50, BABYLON.Space.LOCAL)
    })



    // player.getScene().getAnimationGroupByName('moveAni1.001')
    player.getScene().getAnimationGroupByName('Cube.001Action')?.play()
    player.getScene().getAnimationGroupByName('backAni2')?.play()

    let mtr = player.getScene().getMaterialByName('light') as BABYLON.PBRMaterial

    mtr.emissiveColor =BABYLON.Color3.Green()     
    
  
}

const PlayerGoBackBehavior = (player: BABYLON.AbstractMesh) => {

    const ele = player.getDescendants().find(x=>x.name.includes('wheelFLControl'));
    const ang = (ele as BABYLON.AbstractMesh).rotationQuaternion!.y;
    // console.log(ang);
    
    player.translate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL)
    player.rotate(BABYLON.Axis.Y, ang/25, BABYLON.Space.LOCAL)
    player.getDescendants().filter(ele=>ele.name.includes('wheel'||'Wheel')&&!ele.name.includes('Control')).forEach(ele=>{
        
        (ele as BABYLON.AbstractMesh).rotate(BABYLON.Axis.Z, -Math.PI/50, BABYLON.Space.LOCAL)
    })



    // player.getScene().getAnimationGroupByName('moveAni1.001')
    player.getScene().getAnimationGroupByName('Cube.001Action')?.play()
    player.getScene().getAnimationGroupByName('backAni2')?.play()

    let mtr = player.getScene().getMaterialByName('light') as BABYLON.PBRMaterial
    mtr.emissiveColor =BABYLON.Color3.Red()  


    // (ele as BABYLON.AbstractMesh).rotate(BABYLON.Axis.Y, ang*-0.99, BABYLON.Space.LOCAL);
    
    
}

const PlayerStopBehavior = (player: BABYLON.AbstractMesh) => {

    let mtr = player.getScene().getMaterialByName('light') as BABYLON.PBRMaterial
    mtr.emissiveColor =BABYLON.Color3.Red()  


    
    
    
}

const PlayerRotateBehavior = (player: BABYLON.AbstractMesh,LR:boolean) => {
    const _LR = LR? 1:-1;
    
    
    // player.rotate(BABYLON.Axis.Y, -Math.PI/100*_LR, BABYLON.Space.LOCAL)
    const ele = player.getDescendants().find(x=>x.name.includes('wheelFRControl'));
    const ele2 = player.getDescendants().find(x=>x.name.includes('wheelFLControl'));

    const ang = (ele as BABYLON.AbstractMesh).rotationQuaternion!.y
    // console.log(ang);
    
    if(LR&& ang  <= Math.PI/10 ){
        (ele as BABYLON.AbstractMesh).rotate(BABYLON.Axis.Y, Math.PI/50*_LR, BABYLON.Space.LOCAL);
        (ele2 as BABYLON.AbstractMesh).rotate(BABYLON.Axis.Y, Math.PI/50*_LR, BABYLON.Space.LOCAL)
    }

    if(!LR&& ang  >= -Math.PI/10){
        (ele as BABYLON.AbstractMesh).rotate(BABYLON.Axis.Y, Math.PI/50*_LR, BABYLON.Space.LOCAL);
        (ele2 as BABYLON.AbstractMesh).rotate(BABYLON.Axis.Y, Math.PI/50*_LR, BABYLON.Space.LOCAL)
    }




   
    

    
    
  
    
}



export { PlayerGoForwardBehavior, PlayerGoBackBehavior,PlayerRotateBehavior,PlayerStopBehavior }
import * as BABYLON from 'babylonjs'
import { Vec3 } from 'cannon'

const PlayerGoForwardBehavior = (player: BABYLON.AbstractMesh,velocity:number) => {
    const ele = player.getDescendants().find(x=>x.name.includes('wheelFLControl'));
    const ang = (ele as BABYLON.AbstractMesh).rotationQuaternion!.y;


    player.rotate(BABYLON.Axis.Y, -ang/20, BABYLON.Space.LOCAL)
    player.physicsImpostor?.applyForce(BABYLON.Vector3.Zero().subtract(player.forward).scale(70),player.getAbsolutePosition())

    // player.translate(BABYLON.Axis.Z, -1*velocity/10, BABYLON.Space.LOCAL)
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
    
    player.rotate(BABYLON.Axis.Y, ang/25, BABYLON.Space.LOCAL)
    const backForce = BABYLON.Vector3.Zero().subtract(player.forward).scale(70)

    player.physicsImpostor?.applyForce(backForce.multiplyInPlace(new BABYLON.Vector3(-1,1,-1)),player.getAbsolutePosition())

    
    // player.translate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL)
    player.getDescendants().filter(ele=>ele.name.includes('wheel'||'Wheel')&&!ele.name.includes('Control')).forEach(ele=>{
        
        (ele as BABYLON.AbstractMesh).rotate(BABYLON.Axis.Z, Math.PI/50, BABYLON.Space.LOCAL)
    })



    let mtr = player.getScene().getMaterialByName('light') as BABYLON.PBRMaterial
    mtr.emissiveColor =BABYLON.Color3.Red()  


}

const PlayerStopBehavior = (player: BABYLON.AbstractMesh) => {
    const vel = player.physicsImpostor?.getLinearVelocity()
    player.physicsImpostor?.setLinearVelocity(vel!.multiplyInPlace(new BABYLON.Vector3(0.9,1,0.9)))
    let mtr = player.getScene().getMaterialByName('light') as BABYLON.PBRMaterial
    mtr.emissiveColor =BABYLON.Color3.Red()  


    
    
    
}

const PlayerSlowdownBehavior = (player: BABYLON.AbstractMesh) => {



    player.rotate(BABYLON.Axis.X,-Math.PI/100,BABYLON.Space.LOCAL)

    
    
    
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



export { PlayerGoForwardBehavior, PlayerGoBackBehavior,PlayerRotateBehavior,PlayerStopBehavior,PlayerSlowdownBehavior }
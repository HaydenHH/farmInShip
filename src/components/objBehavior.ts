import * as BABYLON from 'babylonjs'
import { PBRMaterial } from 'babylonjs'
import { PhysicalGameObejct } from './objects'
const Container_Drop=(obj:PhysicalGameObejct,playerPos:PhysicalGameObejct)=>{
    obj.position.y += 5
    obj.position.x = playerPos.position.x
    obj.position.z = playerPos.position.z
    obj.rotation.y = playerPos.forward.y
    var joint1 = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.LockJoint, {
        mainAxis: new BABYLON.Vector3(0, 0, 0),
        connectedPivot: new BABYLON.Vector3(0, -5, 0),
                connectedAxis: new BABYLON.Vector3(0, 0, 1),
        collision: true
	}); 
    playerPos.jointTop={joint:joint1,target:obj}
    obj.jointTop={joint:joint1,target:playerPos}
    obj.physicsImpostor?.mass!=.5
    playerPos.physicsImpostor?.addJoint(obj.physicsImpostor!,joint1);

    // obj.getScene().getPhysicsEngine()?.removeJoint(playerPos.physicsImpostor!,obj.physicsImpostor!,joint1)
    
    
}

const Container_DropOut=(obj:PhysicalGameObejct)=>{
    obj.getScene().getPhysicsEngine()?.removeJoint(obj.jointTop?.target.physicsImpostor!,obj.physicsImpostor!,obj.jointTop?.joint!)
    obj.position.x += 15
    // obj.position.x += 15
    console.log(obj.physicsImpostor);
    const root = obj as PhysicalGameObejct
    const mtr = root.getChildMeshes().find(x=>x.material?.name==='containerType')?.material as PBRMaterial
    mtr.emissiveColor= BABYLON.Color3.Yellow()
    
}

const Container_DropOn=(obj:PhysicalGameObejct)=>{
    const root = obj as BABYLON.AbstractMesh
    const mtr = root.getChildMeshes().find(x=>x.material?.name==='containerType')?.material as PBRMaterial
    mtr.emissiveColor= BABYLON.Color3.Red()
    
    
}

export {Container_Drop,Container_DropOut,Container_DropOn}
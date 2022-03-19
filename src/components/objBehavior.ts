import * as BABYLON from 'babylonjs'
import { PhysicalGameObejct } from './objects'
const Container_Drop=(obj:BABYLON.AbstractMesh,playerPos:BABYLON.AbstractMesh)=>{
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
    obj.physicsImpostor?.mass!=.5
    playerPos.physicsImpostor?.addJoint(obj.physicsImpostor!,joint1);

    obj.getScene().getPhysicsEngine()?.removeJoint(playerPos.physicsImpostor!,obj.physicsImpostor!,joint1)
    
}

const Container_DropOut=(obj:BABYLON.AbstractMesh)=>{
    obj.position.y += 15
    obj.position.x += 15


    
   
    
}

export {Container_Drop,Container_DropOut}
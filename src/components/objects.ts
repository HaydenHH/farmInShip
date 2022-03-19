import * as BABYLON from 'babylonjs'
import {StateMachine} from './playerState'
import { ContainerStateMachine } from './containerState'
import { MakePhysicsObject } from './tool'
import { PhysicsEngine } from 'babylonjs'



class PhysicalGameObejct extends BABYLON.Mesh {
    stateMachine:StateMachine
    physicsEngine:BABYLON.PhysicsEngine
    constructor(name:string,physicsEngine:BABYLON.PhysicsEngine,newMeshes:BABYLON.AbstractMesh[], scene:BABYLON.Scene, scaling:number,mass=3.3){
        super(name,scene)
        this.stateMachine=new ContainerStateMachine(this)
        this.physicsEngine=physicsEngine
        this.position.y += 0.1

        // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
        newMeshes.forEach((m, i)=>{
            if(m.name.includes("box")||m.name.includes("Box")){
                m.isVisible = false
                m.material!.wireframe=true
             
                this.addChild(m)
            }
        })
    
        // Add all root nodes within the loaded gltf to the physics root
        newMeshes.forEach((m, i)=>{
            if(m.parent == null){
                this.addChild(m)
            }
        })
    
        // Make every collider into a physics impostor
        this.getChildMeshes().forEach((m)=>{
            // console.log(m.name);
            
            if(m.name.includes('box')||m.name.includes('Box')||m.name==='Box'){             
                m.scaling.x = Math.abs(m.scaling.x)
                m.scaling.y = Math.abs(m.scaling.y)
                m.scaling.z = Math.abs(m.scaling.z)
                m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: mass,friction: 13}, scene);
                // m.visibility = 0
            }
        })
        
        // Scale the object and turn it into a physics impsotor
        this.scaling.scaleInPlace(scaling)
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, { mass:mass,friction:1}, scene);
        BABYLON.Tags.AddTagsTo(this,name) 

    }
}        

export {PhysicalGameObejct}
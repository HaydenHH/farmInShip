import * as BABYLON from 'babylonjs'
import {StateMachine} from './playerState'
import { ContainerStateMachine } from './containerState'
import { MakePhysicsObject } from './tool'
import { PhysicsEngine } from 'babylonjs'



class PhysicalGameObejct extends BABYLON.Mesh {
    stateMachine?:StateMachine
    physicsEngine:BABYLON.PhysicsEngine
    metaMeshes:BABYLON.AbstractMesh[]
    initScaling:number=1
    mass:number=1
    constructor(name:string,physicsEngine:BABYLON.PhysicsEngine,newMeshes:BABYLON.AbstractMesh[], scene:BABYLON.Scene, scaling:number=1,mass=3.3){
        super(name,scene)
        this.name=name
  
        this.physicsEngine=physicsEngine
        this.metaMeshes=newMeshes
        this.initScaling=scaling
        this.mass= mass
        this.position.y += 0.1
        this.makePhysical()

         

    }
    makePhysical(){
        // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
        this.metaMeshes.forEach((m, i)=>{
            if(m.name.includes("box")||m.name.includes("Box")){
                m.isVisible = false
                m.material!.wireframe=true
             
                this.addChild(m)
            }
        })
    
        // Add all root nodes within the loaded gltf to the physics root
        this.metaMeshes.forEach((m, i)=>{
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
                m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: this.mass,friction: 13}, this._scene);
                // m.visibility = 0
            }
        })
        
        // Scale the object and turn it into a physics impsotor
        this.scaling.scaleInPlace(this.initScaling)
        this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.NoImpostor, { mass:this.mass,friction:1}, this._scene);
        BABYLON.Tags.AddTagsTo(this,this.name)
    }
}        

class ContainerGameObject extends PhysicalGameObejct{
    constructor(name:string,physicsEngine:BABYLON.PhysicsEngine,newMeshes:BABYLON.AbstractMesh[], scene:BABYLON.Scene, scaling:number,mass=1){
        super(name,physicsEngine,newMeshes,scene,scaling,mass)
        this.stateMachine=new ContainerStateMachine(this)
    }
}

export {PhysicalGameObejct,ContainerGameObject}
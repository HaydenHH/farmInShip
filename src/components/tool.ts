import * as BABYLON from 'babylonjs'
import { Vec3 } from 'cannon';
const MakePhysicsObject = (newMeshes:BABYLON.AbstractMesh[], scene:BABYLON.Scene, scaling:number,mass=3.3)=>{
    // Create physics root and position it to be the center of mass for the imported mesh
    var physicsRoot = new BABYLON.Mesh("physicsRoot", scene);
    physicsRoot.position.y += 0.1

    // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
    newMeshes.forEach((m, i)=>{
        if(m.name.includes("box")||m.name.includes("Box")){
            m.isVisible = false
            m.material!.wireframe=true
         
            physicsRoot.addChild(m)
        }
    })

    // Add all root nodes within the loaded gltf to the physics root
    newMeshes.forEach((m, i)=>{
        if(m.parent == null){
            physicsRoot.addChild(m)
        }
    })

    // Make every collider into a physics impostor
    physicsRoot.getChildMeshes().forEach((m)=>{
        // console.log(m.name);
        
        if(m.name.includes('box')||m.name.includes('Box')||m.name==='Box'){
            // console.log(m.name);
            
            m.scaling.x = Math.abs(m.scaling.x)
            m.scaling.y = Math.abs(m.scaling.y)
            m.scaling.z = Math.abs(m.scaling.z)
            m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: mass,friction: 13}, scene);
            // m.visibility = 0
        }
    })
    
    // Scale the root object and turn it into a physics impsotor
    physicsRoot.scaling.scaleInPlace(scaling)
    physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.BoxImpostor, { mass:mass,friction:1}, scene);
    
    return physicsRoot
}


const MakeCarPhysicsObject = (newMeshes:BABYLON.AbstractMesh[], scene:BABYLON.Scene, scaling:number,mass=3.3)=>{
    // Create physics root and position it to be the center of mass for the imported mesh
    var physicsRoot = new BABYLON.Mesh("physicsRoot", scene);
    physicsRoot.position.y += 0.1

    // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
    newMeshes.forEach((m, i)=>{
        if(m.name.includes("box")||m.name.includes("Box")){
            m.isVisible = false
            m.material!.wireframe=true         
            physicsRoot.addChild(m)
        }
    })

    // Add all root nodes within the loaded gltf to the physics root
    newMeshes.forEach((m, i)=>{
        if(m.parent == null){
            physicsRoot.addChild(m)
        }
    })

    // Make every collider into a physics impostor
    physicsRoot.getChildMeshes().forEach((m)=>{
        // console.log(m.name);
        
        if(m.name.includes('box')||m.name.includes('Box')||m.name==='Box'){
            // console.log(m.name);
            
            m.scaling.x = Math.abs(m.scaling.x)
            m.scaling.y = Math.abs(m.scaling.y)
            m.scaling.z = Math.abs(m.scaling.z)
            m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: mass,friction: 3}, scene);
            // m.visibility = 0
        }
    })
    
    // Scale the root object and turn it into a physics impsotor
    physicsRoot.scaling.scaleInPlace(scaling)
    physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.BoxImpostor, { mass:mass,friction:5}, scene);
    
    return physicsRoot
}

class RayCaster{
    caster:BABYLON.AbstractMesh

    hit?:BABYLON.AbstractMesh
    scene:BABYLON.Scene
    ray:BABYLON.Ray
    vecToLocal(vector:BABYLON.Vector3, mesh:BABYLON.AbstractMesh){
        var m = mesh.getWorldMatrix();
        var v = BABYLON.Vector3.TransformCoordinates(vector, m);
		return v;		 
    }

    constructor(caster:BABYLON.AbstractMesh,scene:BABYLON.Scene){
        this.caster=caster
        
        this.scene=scene
        const origin=this.caster.absolutePosition
        const forward = this.vecToLocal(new BABYLON.Vector3(0,0,1), this.caster);
        var direction = forward.subtract(origin).divide(new BABYLON.Vector3(-1,-1,-1));
        direction = BABYLON.Vector3.Normalize(direction);
        var length = 300;
        this.ray=new BABYLON.Ray(this.caster.absolutePosition,direction,length)
        let rayHelper = new BABYLON.RayHelper(this.ray);		
        rayHelper.show(this.scene);	
        
    }
    update(){
        // console.log(this.caster);
        const origin=this.caster.absolutePosition
        const forward = this.vecToLocal(new BABYLON.Vector3(0,0,1), this.caster);
        var direction = forward.subtract(origin).divide(new BABYLON.Vector3(-1,-1,-1));
        direction = BABYLON.Vector3.Normalize(direction);
        this.ray.origin = origin
        this.ray.direction=direction
        

    }
	
	
	
	


        

        
}


    
   


export  {MakePhysicsObject,MakeCarPhysicsObject,RayCaster}
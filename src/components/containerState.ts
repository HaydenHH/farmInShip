import { StateMachine,State, MachineStates } from "./playerState";
import * as BABYLON from 'babylonjs'
import { PBRMaterial } from "babylonjs";
import * as OBJBEHAVIOR from './objBehavior'

class ContainerMountState implements State{
    stateMachine: StateMachine;
    isIn: Boolean=false;
    isTransition?: Boolean | undefined;
    enter(tar:BABYLON.AbstractMesh): void {
        OBJBEHAVIOR.Container_Drop(this.stateMachine.context as BABYLON.AbstractMesh,tar)
        this.isIn=true
    }
    exit(nextState?: State): Promise<void> {
        return new Promise((res,rej)=>{
            OBJBEHAVIOR.Container_DropOut(this.stateMachine.context as BABYLON.AbstractMesh)
            this.isIn=false
        })
    }
    update(): void {
        // throw new Error("Method not implemented.");
        // console.log(`it's mounted`);
        const root = this.stateMachine.context as BABYLON.AbstractMesh
        const mtr = root.getChildMeshes().find(x=>x.material?.name==='containerType')?.material as PBRMaterial
        mtr.emissiveColor = BABYLON.Color3.Random()
        
    }
    constructor(stateMachine:StateMachine){
        this.stateMachine=stateMachine
    }
    
}

class ContainerStateMachine implements StateMachine{
    context: unknown;
    states: MachineStates;
    isTransition: Boolean=false;
    inState(state: State): void {
        state.enter()
    }
    updateState(): void {
        Object.values(this.states).forEach(state=>{
            state.isIn&&state.update()
        })
    }
    constructor(context:unknown){
        console.log('obj State');
        this.context=context
        const Mounted = new ContainerMountState(this)
        this.states={
            Mounted
        }

        // this.states.Mounted.enter()
    }
}

export {ContainerStateMachine,ContainerMountState}
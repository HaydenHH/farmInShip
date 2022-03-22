import { StateMachine,State, MachineStates } from "./playerState";
import * as BABYLON from 'babylonjs'
import { PBRMaterial } from "babylonjs";
import * as OBJBEHAVIOR from './objBehavior'
import { PhysicalGameObejct } from './objects'
class ContainerMountState implements State{
    stateMachine: ContainerStateMachine;
    isIn: Boolean=false;
    isTransition?: Boolean | undefined;
    enter(tar:BABYLON.AbstractMesh): void {
        OBJBEHAVIOR.Container_Drop(this.stateMachine.context as PhysicalGameObejct,tar as PhysicalGameObejct )
        this.isIn=true
    }
    exit(nextState?: State): Promise<void> {
        return new Promise((res,rej)=>{
            OBJBEHAVIOR.Container_DropOut(this.stateMachine.context)
            this.isIn=false
        })
    }
    update(): void {
        // throw new Error("Method not implemented.");
        // console.log(`it's mounted`);
        OBJBEHAVIOR.Container_DropOn(this.stateMachine.context)
        
    }
    constructor(stateMachine:ContainerStateMachine){
        this.stateMachine=stateMachine
    }
    
}

class ContainerStateMachine implements StateMachine{
    context: PhysicalGameObejct;
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
    constructor(context:PhysicalGameObejct){
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
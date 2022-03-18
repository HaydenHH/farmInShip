import * as BABYLON from 'babylonjs'
import * as BEHAVIOR from './playerBehavior'
abstract class State{
    abstract stateMachine:StateMachine
    abstract nextState?:State
    isIn:Boolean=false
    isTransition?:Boolean
    abstract enter(nextState?:State):void
    abstract exit(nextState?:State):void
    abstract update():void
}

interface MachineStates{
    [propName:string]:State
}

abstract class StateMachine{
    context:unknown
    abstract lastState?:State
    states:MachineStates={}
    activeState:State|null = null
    currentStates:State[]=[]
    isExiting:Boolean=false
    abstract isTransition:Boolean
    abstract changeState(state:State):void
    abstract updateState():void 
}




class PlayerStop implements State{
    stateMachine: StateMachine
    isIn: Boolean=false
    enter(): void {
        this.isIn=true
        this.stateMachine.lastState=this
        
    }
    exit(nextState?:State): void {
        const stateArray=[1,2,3]
        new Promise((res,rej)=>{

        })
        this.isIn=false
        
    }
    update(): void {

      BEHAVIOR.PlayerStopBehavior(this.stateMachine.context as BABYLON.AbstractMesh)  
      
        // this.exit()
    }
    constructor(stateMachine:StateMachine){
        this.stateMachine = stateMachine
    }
    
}

class PlayerRotating implements State{
    stateMachine: StateMachine
    isLeft:boolean
    isIn: Boolean=false
    enter(): void {
       this.isIn=true
       this.exit()
       
    }
    exit(nextState?:State): void {

        
    }
    update(): void {
      
      BEHAVIOR.PlayerRotateBehavior(this.stateMachine.context as BABYLON.AbstractMesh,this.isLeft)  
      this.isIn=false
    }
    constructor(stateMachine:StateMachine,isLeft=true){
        this.stateMachine = stateMachine
        this.isLeft=isLeft
    }
    
}

class PlayerSlowDown implements State{
    isIn: Boolean=false
    stateMachine: StateMachine
    nextState?: State | undefined
    enter(nextState:State): void {
        this.isIn=true
        
    }
    exit(nextState?:State): void {
        this.isIn=false
    }
    update(): void {
        // console.log('过度过度过度');
        const player = (this.stateMachine.context as BABYLON.AbstractMesh)
        
        player.rotate(BABYLON.Axis.X,-Math.PI/300,BABYLON.Space.LOCAL)
        this.exit()
    }
    constructor(stateMachine:StateMachine){
        this.stateMachine = stateMachine

    }

}

class PlayerMove implements State{
    isIn: Boolean=false
    stateMachine: StateMachine
    enter(): void {
        // this.stateMachine.activeState = this
        this.isIn=true
        this.stateMachine.states.stop.exit()
    }
    exit(nextState?:State): void {
        this.isIn=false
        // this.stateMachine.states.slowDown.enter()
    }
    update(): void {

        BEHAVIOR.PlayerGoForwardBehavior(this.stateMachine.context as BABYLON.AbstractMesh,5)
        this.exit()
    }
    constructor(stateMachine:StateMachine){
        this.stateMachine = stateMachine

    }
    
}

class PlayerBack implements State{
    isIn: Boolean=false
    stateMachine: StateMachine
    enter(): void {
        this.stateMachine.states.stop.exit()
        this.isIn=true
    }
    exit(nextState?:State): void {
        this.isIn=false
        // this.stateMachine.states.slowDown.enter()
    }
    update(): void {

        BEHAVIOR.PlayerGoBackBehavior(this.stateMachine.context as BABYLON.AbstractMesh)
        this.exit()
    }
    constructor(stateMachine:StateMachine){
        this.stateMachine = stateMachine

    }
    
}



class PlayerStateMachine implements StateMachine{
    context:BABYLON.AbstractMesh
    states:MachineStates={}
    activeState: State|null=null
    isExiting:Boolean = false
    nextState:State|null = null
    isTransition=false
    currentStates:State[]=[]
    lastState:State
    constructor(context:BABYLON.AbstractMesh){
        this.context=context
        const move = new PlayerMove(this)
        const back = new PlayerBack(this)
        const stop = new PlayerStop(this)
        const slowDown = new PlayerSlowDown(this)
        const rotateL = new PlayerRotating(this)
        const rotateR = new PlayerRotating(this,false)
        
        this.states={
            move,back,stop,slowDown,rotateL,rotateR
        }

        this.lastState = this.states.stop

        
    }
    inState(state:State):void{

        state.enter()

    }
    changeState(state:State): void {   
        if(this.activeState!=state&&!this.isTransition){
            
            this.activeState?.exit(state)
        }     
        
    }
    updateState(): void {

        // this.activeState?.update()
      
       Object.values(this.states).forEach(state=>{
           state.isIn&&state.update()
       })
       
        
    }
    
}

export default PlayerStateMachine
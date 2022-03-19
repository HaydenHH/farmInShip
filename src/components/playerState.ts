import * as BABYLON from 'babylonjs'
import * as BEHAVIOR from './playerBehavior'
abstract class State{
    abstract stateMachine:StateMachine
    isIn:Boolean=false
    isTransition?:Boolean
    abstract enter(para?:any):void
    abstract exit():Promise<void>
    abstract update():void
}

interface MachineStates{
    [propName:string]:State
}

abstract class StateMachine{
    context:unknown
    states:MachineStates={}
    abstract isTransition:Boolean
    // abstract changeState(state:State):void
    abstract inState(state:State):void
    abstract updateState():void 
}




class PlayerStop implements State{
    stateMachine: StateMachine
    isIn: Boolean=false
    isTransition=false
    enter(): void {
        this.isIn=true

        
    }
    async exit(nextState?:State): Promise<void> {
        
       
        this.isIn = false
        
        
    }
    update(): void {


      BEHAVIOR.PlayerStopBehavior(this.stateMachine.context as BABYLON.AbstractMesh)  
    //   console.log(this.isIn);
      
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
    exit(nextState?:State): Promise<void> {
        return new Promise((res,rej)=>{
            // setTimeout(() => {
            //     this.isIn=false
            // }, 100);
            res()
        })
        
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
    enter(): void {
        this.isIn=true
        
    }
    exit(nextState?:State): Promise<void> {
        return new Promise((res,rej)=>{
            
            setTimeout(() => {
                this.isIn=false
                res()
            }, 150);
        })
    }
    update(): void {
        console.log('过度过度过度');
        BEHAVIOR.PlayerSlowdownBehavior(this.stateMachine.context as BABYLON.AbstractMesh)  
        this.exit()
    }
    constructor(stateMachine:StateMachine){
        this.stateMachine = stateMachine

    }

}

class PlayerMove implements State{
    isIn: Boolean=false
    stateMachine: StateMachine
    isTransition?: Boolean | undefined=false
    speed=0
    enter(): void {

        this.speed+=0.1
        this.isIn=true

        this.stateMachine.states.stop.exit()
    }
    async exit(nextState?:State): Promise<void> {
        this.isTransition=true
        const transitionStates=[this.stateMachine.states.slowDown,this.stateMachine.states.stop,this.stateMachine.states.slowDown]
        for(let [i,state] of transitionStates.entries()){
 
            state.enter()
            await state.exit()           
        }
        this.isIn=false
        this.speed/=2

    }
    update(): void {
        if(this.speed<0){
            this.exit()
        }else{
            this.speed-=0.09
        }
        BEHAVIOR.PlayerGoForwardBehavior(this.stateMachine.context as BABYLON.AbstractMesh,this.speed)
        // this.exit()
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
        if(this.stateMachine.states.move.isIn)this.stateMachine.states.move.exit()
        this.isIn=true
    }
    exit(nextState?:State): Promise<void> {
        return new Promise((res,rej)=>{
            this.isIn=false
            res()
        })
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
    isTransition=false
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


        
    }
    inState(state:State):void{

        state.enter()

    }

    updateState(): void {

       Object.values(this.states).forEach(state=>{
           state.isIn&&state.update()
       })
       
        
    }
    
}

export {PlayerStateMachine,State,StateMachine,MachineStates}
import React, {useState,useEffect} from 'react'
import '../index.css';
import Box from './Box.js'

function GameArea() {
    const [matrix,setMatrix] = useState([
        [0,2,0,0],
        [0,0,0,0],
        [0,0,4,0],
        [0,2,0,0]
    ]);
    const [reward_list,setreward_list] = useState([]);
    const [game,setGame] = useState(0);

    function putRandomElements(arr){
        let items = []
        console.log(arr)
        arr.forEach((el,rowId)=>{
            el.forEach((ele,colId)=>{ if(arr[rowId][colId]===0) items.push([rowId,colId]) })
        })
        console.log("=====================================================");
        console.log(items.length);
        console.log("=====================================================");
        if(items.length===0)
        {
            setGame(1)
            fetch('/train',{method: 'POST',
                        headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                                },
                        body:JSON.stringify(reward_list)}).then(res => res.json()).then(data => {
            console.log(data);
          });
            arr = [
                [0,2,0,0],
                [0,0,0,0],
                [0,0,4,0],
                [0,2,0,0]
            ];
            return arr
        }
        let item = items[Math.floor(Math.random() * items.length)]
        let p = [2,4]
        arr[item[0]][item[1]] = p[Math.floor(Math.random() * p.length)]
        return arr
    }

    function arrayProcess(arr,reward){
        function pushZerosatEnd(arr){
            let temp= arr.filter((el)=> {return el!==0;})
            temp=[...temp,...Array(4-temp.length).fill(0)]
            return temp
        }
        for (let index = 0; index < arr.length-1; index++) {
            arr = pushZerosatEnd(arr);
            if(arr[index] === arr[index+1]){
                reward = reward + 2*arr[index]
                arr[index] = 2*arr[index]
                arr[index+1] = 0
            }
        }
        arr = pushZerosatEnd(arr)
        return [arr,reward]
    }

    function calculate(dir){
        let copy  = [...matrix]
        let reward = 0 
        console.log(copy)
        switch(dir){
            case "up":
                for (let index = 0; index < copy[0].length; index++) {
                    let column = copy.map((el)=>{ return el[index] })
                    let [col,reward_] = arrayProcess(column,reward)
                    reward = reward + reward_
                    copy.forEach((el,i)=>{el[index] = col[i]})
                }
                break
            case "down":
                for (let index = 0; index < copy[0].length; index++) {
                    let column = copy.map((el)=>{ return el[index] })
                    let [col,reward_] = arrayProcess(column.reverse(),reward)
                    reward = reward + reward_
                    col.reverse()
                    copy.forEach((el,i)=>{el[index] = col[i]})
                }
                break
            case "left":
                copy=copy.map((el)=> {
                    let [col,reward_] = arrayProcess(el,reward)
                    reward = reward + reward_
                    return col
                })
                break
            case "right":
                let col = []
                copy=copy.map((el)=> {
                    let [col,reward_] = arrayProcess(el.reverse(),reward)
                    reward = reward + reward_
                    return col.reverse()
                })
                break
        }
        setreward_list([...reward_list,reward])
        copy = putRandomElements(copy)
        if(game === 1)
        {
            setGame(0)
            setreward_list([])
        }
        setMatrix(copy)
    }

    useEffect(()=>{     
        fetch('/setupModel').then(res =>  {
            console.log(res);
          }); 
    },[])

    useEffect(()=>{
        /*function onKeydown(e) {
            e=e||window.event
            switch(e.keyCode){
              case 38:
                calculate("up")
                break
              case 40:
                calculate("down")
                break
              case 37:
                calculate("left")
                break
              case 39:
                calculate("right")
                break
              default:
                console.log("press valid keys!")
            }
          }
        document.onkeydown=onKeydown*/
        
        fetch('/action',{method: 'POST',
                        headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                                },
                        body:JSON.stringify(matrix)}).then(res => res.json()).then(data => {
            console.log(data.action);
            calculate(data.action);
          }); 
    },[matrix])

    return (
        <div>
            <div id="container">
                {matrix.map((row,rowIndex)=>{
                    return row.map((cell,colIndex)=>{
                        if(cell!==0)
                            return <Box pos={[rowIndex,colIndex]} value={cell}/>
                    })
                })}
            </div>
        </div>
    )
}

export default GameArea

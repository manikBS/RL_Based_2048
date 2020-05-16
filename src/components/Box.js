import React from 'react'

const colorMapping = new Map([
    [ 2, '#fce8e0'],  
    [ 4, '#fdcab6'],  
    [ 8, '#fda988'],
    [ 16, '#ff733b']  
  ]);

function Box(props) {
    const position = props.pos;
    const value = props.value;
    const style= {
        backgroundColor:colorMapping.get(value),
        top:`${position[0]*125+6}px`,
        left:`${position[1]*125+6}px`
    }
    return (
        <div>
            <div id="box" style={style}>
                <h1>{value}</h1>
            </div>
        </div>
    )
}

export default Box

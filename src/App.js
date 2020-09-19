import React, { useState, useEffect, useRef } from "react";
import "./Calculate.css";

function App() {
  const [result, setResult] = useState("");
  const inputRef = useRef(null);

  useEffect(() => inputRef.current.focus());

  function display(e) {
    setResult(result.concat(e.target.name));
  }
  function clearLastElement() {
    if(result && result.length > 0){
      setResult(result.slice(0, -1))
    }else{
      setResult(result)
    }
    
  }
  function handleKeyPress(e){
    if (e.key === 'Enter') {
      try {
        setResult(evaluate(result).toString());
      } catch (err) {
        setResult("")
      }
    }else if(e.key === '0' || e.key === '1' || e.key === '2' || e.key === '3' ||e.key ===  '4' || 
    e.key ===  '5' || e.key ===  '6' || e.key ===  '7' || e.key === '8' || e.key === '9' || e.key ===  '+' ||
     e.key ===  '-' || e.key ===  '*' || e.key === '/' || e.key === '(' ||e.key === ')'){
      setResult(result.concat(e.key)) 
    }
  }
  function clear() {
    setResult("");
  }
  function solve() {
    try {
      setResult(evaluate(result).toString());
    } catch (err) {
      setResult("err")
    }

  }
  function evaluate(expression) {
    expression = expression.replace(/\s/g, "");
    let tokens = expression.split('');
    if (!isBalancedParentheses(tokens)) {
      throw 'Unbalanced Parentheses';
    }
    let values = [];
    let ops = [];
    let tokenLen = tokens.length;
    for (let i = 0; i < tokenLen; i++) {
      if (tokens[i] >= '0' && tokens[i] <= '9') {
        let str = tokens[i];
        let next = i + 1;
        while (next < tokens.length && tokens[next] >= '0' && tokens[next] <= '9') {
          str = str + tokens[next];
          i = i + 1;
          next = i + 1;
        }
        values.push(parseInt(str))
      } else if (tokens[i] === '(') {
        ops.push(tokens[i]);
      } else if (tokens[i] === ')') {
        while (ops[ops.length - 1] !== '(') {
          values.push(applyOp(ops.pop(), values.pop(), values.pop()));
        }
        ops.pop();
      } else if (tokens[i] === '+' || tokens[i] === '-' || tokens[i] === '*' || tokens[i] === '/') {
        while (!isEmpty(ops) && hasPrecedence(tokens[i], ops[ops.length - 1])) {
          values.push(applyOp(ops.pop(), values.pop(), values.pop()));
        }
        ops.push(tokens[i]);
      }
    }
    while (!isEmpty(ops)) {
      values.push(applyOp(ops.pop(), values.pop(), values.pop()));
    }
    return values.pop();
  }
  
  function hasPrecedence(op1, op2) {
    if (op2 === '(' || op2 === ')') {
      return false;
    }
    if ((op1 === '*' || op1 === '/') && (op2 === '+' || op2 === '-')) {
      return false;
    }
    return true;
  }
  
  function applyOp(op, b, a) {
  
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
         
        if (b === 0) {
          throw 'Cannot divide by zero';

        }
        return a / b;
      default: 
        return 0;
    }
  }
  
  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
  
    return true;
  }
  
  function isBalancedParentheses(tokens) {
    let stack = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === "(") {
        stack.push("(")
      } else if (tokens[i] === ")") {
        if (isEmpty(stack)) {
          return false;
        }
        if (stack[stack.length - 1] !== "(") {
          return false;
        }
        stack.pop()
      }
    }
    return isEmpty(stack);
  }


  return (
    <div class="calculator">

        <input class="text" type="text" value={result}  ref={inputRef} onKeyPress={handleKeyPress}/>
      
      <div class="keypad" ></div>
      <button class='button' name="(" onClick={display}>(</button>
      <button class='button' id="clearLastElement" onClick={clearLastElement}>CE </button>
      <button class='button' name=")" onClick={display}>)</button>
      <button class='button' id="clear" onClick={clear}>C</button>
      <button class='button' name="1" onClick={display}>1</button>
      <button class='button' name="2" onClick={display}>2</button>
      <button class='button' name="3" onClick={display}>3</button>
      <button class='button' name="+" onClick={display}>+</button>
      <button class='button' name="4" onClick={display}>4</button>
      <button class='button' name="5" onClick={display}>5</button>
      <button class='button' name="6" onClick={display}>6</button>
      <button class='button' name="-" onClick={display}>-</button>
      <button class='button' name="7" onClick={display}>7</button>
      <button class='button' name="8" onClick={display}>8</button>
      <button class='button' name="9" onClick={display}>9</button>
      <button class='button' name="*" onClick={display}>*</button>
      <button class='button' name="." onClick={display}>.</button>
      <button class='button' name="0" onClick={display}>0</button>
      <button class='button' id="result" onClick={solve}>=</button>
      <button class='button' name="/" onClick={display}>/</button>
    </div>
  )
}
export default App;

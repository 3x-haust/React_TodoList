import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

interface TodoData {
  [key: string]: boolean;
}

function MainApp() {
  const [todoList, setTodoList] = useState<string[]>([]);
  const [todoCheck, setTodoCheck] = useState<boolean[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  
  const fetchTodoData = async () => {
    try {
      const response = await axios.get<TodoData>('http://localhost:8080/getTodoList');
      setTodoList(Object.keys(response.data));
      setTodoCheck(Object.values(response.data));
    } catch (error) {
      //console.error('Fetching todo data failed:', error);
    }
  };

  useEffect(() => {
    fetchTodoData();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const todo = encodeURIComponent(inputValue);
    const insertUrl = `http://localhost:8080/insertTodo?todo=${todo}&check=false`;

    try {
      await axios.get(insertUrl);
      setInputValue('');
      fetchTodoData();
    } catch (error) {
      //console.error(`Failed to insert todo: ${todo}`, error);
    }
  };

  const handleCheckboxChange = async (index: number) => {
    const newTodoCheck = [...todoCheck];
    newTodoCheck[index] = !newTodoCheck[index];
    setTodoCheck(newTodoCheck);

    const todo = encodeURIComponent(todoList[index]);
    const check = newTodoCheck[index];
    const updateUrl = `http://localhost:8080/updateTodo?todo=${todo}&check=${check}`;

    try {
      await axios.get(updateUrl);
    } catch (error) {
      //console.error(`Failed to update todo: ${todo}`, error);
    }
  };

  const handleRemoveTodo = async (index: number) => {
    const newTodoList = [...todoList.slice(0, index), ...todoList.slice(index + 1)];

    const newTodoCheck = [...todoCheck.slice(0, index), ...todoCheck.slice(index + 1)];

    setTodoList(newTodoList);
    setTodoCheck(newTodoCheck);

    const todo = encodeURIComponent(todoList[index]);
    const deleteUrl = `http://localhost:8080/deleteTodo?todo=${todo}`;

    try {
      await axios.get(deleteUrl);
    } catch (error) {
      //console.error(`Failed to delete todo: ${todo}`, error);
    }
  };


  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">만들기</button>
      </form>
      <ol>
        {todoList.map((todo, index) => (
          <li key={index}>
            <span>{todo}</span>
            <input
              type="checkbox"
              checked={todoCheck[index]}
              style={{ marginLeft: '5vh' }}
              onChange={() => handleCheckboxChange(index)}
            />
            <button onClick={() => handleRemoveTodo(index)} style={{ marginLeft: '5vh' }} className="delete-button">X</button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default MainApp;

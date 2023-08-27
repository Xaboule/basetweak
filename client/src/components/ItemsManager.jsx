import { useState } from "react";
import axios from "axios";

function ItemsManager() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState(0);

  const [itemsList, setItemsList] = useState([]);

  const addItem = () => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/create`, {
        name: name,
        age: age,
        country: country,
        position: position,
        wage: wage,
      })
      .then(() => {

      });
  };
  const getItems = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/employees`, {}).then((res) => {
      setItemsList(res.data);
    });
  };

  return (
    <div className="itemsManager">
      <div className="informations">
        <label>Name:</label>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <label>Age:</label>
        <input type="number" onChange={(e) => setAge(e.target.value)} />
        <label>Country:</label>
        <input type="text" onChange={(e) => setCountry(e.target.value)} />
        <label>Position:</label>
        <input type="text" onChange={(e) => setPosition(e.target.value)} />
        <label>Price:</label>
        <input type="number" onChange={(e) => setWage(e.target.value)} />

        <button onClick={addItem}>Add Employee</button>
      </div>
      <div className="employees">
        <button onClick={getItems}>Show Employees</button>

        {itemsList.map((emp, key) => {
          return(
          <div className="emp" key={key}>
            <h3>{emp.name}</h3>
            <h3>{emp.age}</h3>
            <h3>{emp.country}</h3>
            <h3>{emp.position}</h3>
            <h3>{emp.price}$</h3>
            </div>)
        })}
      </div>
    </div>
  );
}

export default ItemsManager;

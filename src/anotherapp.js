import React, { useState } from "react";

const AddItem = () => {
  const [groceryItem, setGroceryItem] = useState("");
  const [howSoon, sethowSoon] = useState(null);

  const itemInputChange = (e) => {
    setGroceryItem(e.target.value);
  };


  const radioInputChange = (e) => {
    sethowSoon(parseInt(e.target.value));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
      setGroceryItem("");
      sethowSoon(null);
      return;
    }
  };

  return (
    <main className="add-item">
      <h1>Add Item</h1>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="addItem">
          Item Name:
          <input
            id="addItem"
            name="addItem"
            type="text"
            value={groceryItem}
            onChange={itemInputChange}
          />
        </label>

        <fieldset>
          <p>How soon will you buy this again?</p>
          <div className="radio-group-container">

          <label htmlFor="soon">Soon</label>
            <input
              id="soon"
              value="7"
              type="radio"
              name="howSoon"
              onChange={radioInputChange}
              checked={howSoon === 7}
              required
            />

            <label htmlFor="kinda-soon">Kind of Soon</label>
            <input
              id="kinda-soon"
              value="14"
              type="radio"
              name="howSoon"
              onChange={radioInputChange}
              checked={howSoon === 14}
            />
            
            <input
              id="not-soon"
              value="30"
              type="radio"
              name="howSoon"
              onChange={radioInputChange}
              checked={howSoon === 30}
            />
            <label htmlFor="not-soon">Not Soon</label>
          </div>
        </fieldset>
        <input type="submit" value="Add to Shopping List" />
      </form>
    </main>
  );

export default AddItem;
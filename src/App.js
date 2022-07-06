import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Collapsible from 'react-collapsible';
import logo from './img/logo.png';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API,
  authDomain: process.env.REACT_APP_DOMAIN,
  projectId: process.env.REACT_APP_ID,
  storageBucket: process.env.REACT_APP_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASURE_ID
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  if (!firebase.apps.length) {
    firebase.initializeApp({});
  }else {
    firebase.app(); // if already initialized, use that one
  }

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <img src={logo} alt="the main logo" />
        <SignOut />
      </header>

      <section>
        {user ? <DodoRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <p className={`signInHeading`}>Welcome to the <strong>Dodo Codes Club!</strong> 
      <br />
      You can fill out the form to enter your code for visitors! Be nice! 
      <br />
      Community guidelines do apply.</p>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>

    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function DodoRoom() {

  const dummy = useRef();

  const codesRef = firestore.collection('islandcodes');
  const query = codesRef.orderBy('createdAt').limit(50);
  const [islandcodes] = useCollectionData(query, { idField: 'id' });

  const [islandcode, setIslandCode] = useState('');
  const [visitors, setVisitors] = useState('');
  const [turnips, setTurnips] = useState('');
  const [fruit, setFruit] = useState('');
  const [hemisphere, setHemisphere] = useState('');
  const [message, setMessage] = useState('');

  const [trigger, setTrigger] = useState('➕');
  const [close, setClose] = useState(false);

  const sendIslandCode = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await codesRef.add({
      islandcode: islandcode,
      visitors: visitors,
      turnips: turnips,
      fruit: fruit,
      hemisphere: hemisphere,
      message: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setIslandCode("");
    setVisitors("");
    setTurnips("");
    setFruit("");
    setHemisphere("");
    setMessage("");
    setClose(false);

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  function hide() {
    setClose(true);
  }
  function openHandler() {
    setTrigger('❌');
  }

  function closeHandler() {
    setTrigger('➕')
  }

  return (
    <>
      <main>

        {islandcodes && islandcodes.map(msg => <DodoMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>

      </main>
      <Collapsible 
      open={close}
      handleTriggerClick={close ? null : hide}
      onOpen={openHandler} 
      onClose={closeHandler} 
      trigger={trigger}>
      <form className="createIslandCode" onSubmit={sendIslandCode}>
        <div className={`codeRow`}>
          <div className={`codeChild`}>
            
            <label>Your Island Code</label>
            <input
              value={islandcode}
              onChange={(e) => setIslandCode(e.target.value)}
            />
          </div>

          <div className={`codeChild`}>
            <button type="submit" onClick={hide} className={`addButton`} disabled={!islandcode}>Add Your Code</button>
          </div>
          
        </div>
        <div className={`restofForm`}>
        <label>Number of Visitors</label>
        <input
          type="number"
          min="0"
          max="7"
          value={visitors}
          onChange={(e) => setVisitors(e.target.value)}
        />

        <label>Turnip Price</label>
        <input
          type="number"
          min="0"
          max="100"
          value={turnips}
          onChange={(e) => setTurnips(e.target.value)}
        ></input>

        <label>Island Fruit</label>
        <select
          onChange={(e) => setFruit(e.target.value)}>
          <option value="🍐">Pear🍐</option>
          <option value="🍒">Cherry🍒</option>
          <option value="🍊">Orange🍊</option>
          <option value="🍎">Apple🍎</option>
          <option value="🍑">Peach🍑</option>
        </select>

        <label>Hemisphere</label>
        <select
          onChange={(e) => setHemisphere(e.target.value)}>
          <option value="Northern">Northern</option>
          <option value="Southern">Southern</option>
        </select>

        <label>Message</label>
        <textarea
          placeholder="Anything Else?"
          value={message}
          rows="3"
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        
          </div>
          



        {/* <label class="inquiryTitle">
					<h4>When are you riding?</h4>
				</label>
				<br></br>

<select id="type">
					<option value="">-- Select --</option>
					<option value="weekday">Weekdays</option>
					<option value="evening_weekend">Evenings/Weekend</option>
					<option value="anytime">Anytime</option>
				</select> */}

      </form>
      
      </Collapsible>


      {/* <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>💕</button>

    </form> */}
    </>
  )
}

function DodoMessage(props) {
  const { islandcode, visitors, turnips, fruit, hemisphere, message, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img className={`avatar`} src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="user avatar" />
        <div className={`inputCodes`}>
          <h4>{islandcode}</h4>
          <h3>Island Fruit</h3>
          <p className={`fruitEmoji`}>{fruit}</p>

          <div className={`row`}>
            <div className={`rowSection`}>
              <h3>Max. Visitors</h3>
              <br />
              <p>{visitors}</p>
            </div>

            <div className={`rowSection`}>
              <h3>Turnip Price</h3>
              <br />
              <p>{turnips}</p>
            </div>
          </div>
          <p>"{message}"</p>
          <h3>{hemisphere} Hemisphere</h3>

        </div>
      </div>
    </>
  )
}

export default App;

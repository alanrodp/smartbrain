import React, { useState } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import './App.css';

function App() {

  const [input, setInput] = useState('');
  const [imgURL, setImageURL] = useState('');
  const [box, setBox] = useState([]);
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setSignedIn] = useState(false);

  const app = new Clarifai.App({
    apiKey: 'ebb964897681408db9d26a19566c94d3'
  })

  const particlesOptions = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 600
        }
      }
    }
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onSubmit = () => {
    setImageURL(input);

    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => displayFaceBox(calculateFaceLocation(response)))
      .catch(err => console.log(err))

  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    }
  }

  const displayFaceBox = (box) => {
    setBox(box);
    console.log(box)
  }

  const onRouteChange = (route) => {
    switch(route) {
      case 'signout':
        setSignedIn(false);
        break;
      default:
        setSignedIn(true);
        break;
    }
    setRoute(route);
  }

  return (
    <div className="App">

      <Particles className='particles'
        params={particlesOptions} />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {
        route === 'home' ?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={onInputChange} onSubmit={onSubmit} />
            <FaceRecognition imgURL={imgURL} box={box} />
          </div>
          : (
            route === 'signin' ?
              <SignIn onRouteChange={onRouteChange} />
              : <Register onRouteChange={onRouteChange} />
          )
      }
    </div>
  );
}

export default App;

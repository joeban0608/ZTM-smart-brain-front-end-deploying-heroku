import './App.css';
import React,{Component} from 'react';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo'
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm'
import Rank from './component/Rank/Rank'
import FaceRecognition from './component/FaceRecognition/FaceRecognition'
import Register from './component/Register/Register';
import Particles from 'react-particles-js';
// import Clarifai from 'clarifai'
import Signin from './component/Signin/Signin'

// const app = new Clarifai.App({
// //  apiKey: 'YOUR_API_KEY'
//  apiKey: 'b8962c2705744018a0bd25cbc1434e74'
// });

// particles setting
const ParticlesOptions = {
  particles: {
    number : {
      value :80,
      density : {
        enable: true,
        value_area: 800
      }
    },
    size: {
        value: 3
    },
    opacity: {
      value: 1
    },
    move: {
      speed: 3
    },
  },
  interactivity:{
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box:{},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  // the callback fucntion in onButtonSubit method on setState function in order to calculate the data from Clarifai api
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = image.width;
    const height = image.height;
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: (1 - clarifaiFace.right_col) * width ,
      bottomRow: (1 - clarifaiFace.bottom_row) * height
    }
  }

  //the callback fucntion in onButtonSubmit to set the state for box in order to displayFaceBox
  setStateBox = (box) => {
    this.setState({box:box})
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  //submit picture to detect the face
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
      // fetch('http://localhost:2999/imageurl', {
      fetch('https://desolate-plains-67939.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
            })
         })
      .then(response => response.json())
      .then(response => {
        if (response) {
          // fetch('http://localhost:2999/image', {
          fetch('https://desolate-plains-67939.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            console.log('count:', count)
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        this.setStateBox(this.calculateFaceLocation(response))
      }})
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn:true})
    }
    this.setState({route: route})
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
        <div className="App">
          <Particles className="particles" params={ParticlesOptions}/>
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          { route === 'home' 
            ? <div>
                <Logo/>
                <Rank 
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
                <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition box={box} imageUrl={imageUrl} />
              </div>
            : (
                route === 'signin'
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
          }
        </div>
    );
  }
}

export default App;

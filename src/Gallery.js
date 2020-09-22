import React from 'react';
import './Gallery.css';

class Gallery extends React.Component {
  constructor() {
    super();
    this.state = {
      image: '',
      loading: true,
      breed: '',
    };
    this.fetchAPI = this.fetchAPI.bind(this);
    this.includeNewDog = this.includeNewDog.bind(this);
  }

  async fetchAPI() {
    const myObject = {headers: {'Accept': 'application/json'}};
    const API_URL = 'https://dog.ceo/api/';
    const breedsEndPoint = 'breeds/image/random';
    const breed = 'terrier';
    const specificBreedEndPoint = 'breed/' + breed + '/image/random';
    const URL = API_URL + breedsEndPoint; // specificBreedEndPoint;
    const responseAPI = await fetch(URL, myObject);
    const jsObject = await responseAPI.json();
    const status = jsObject.status;
    const imgSource = jsObject.message;
    let actualBreed = imgSource.split('/')[4];
    if (status !== 'success') return new Error('Não foi possível obter uma imagem.');
    this.setState(actualState => {
      if (actualBreed.includes('-')) {
        actualBreed = imgSource.split('/')[4].split('-');
        actualBreed = actualBreed[0][0].toUpperCase() + actualBreed[0].slice(1) + ' ' + actualBreed[1][0].toUpperCase() + actualBreed[1].slice(1);
      } else {
        actualBreed = actualBreed[0].toUpperCase() + actualBreed.slice(1)
      }
      return ({image: imgSource, breed: actualBreed, loading: false});
    });
    return 0;
  }

  includeNewDog() {
    this.setState({loading: true, breed: ''}, () => this.fetchAPI());
  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdate');
    return this.state.image.includes('terrier') ? false : true;
  }

  render() {
    console.log('render');
    return(
      <div className='img-container'>
        {this.state.loading ? '' : <img src={this.state.image} alt="dog" />}
        <p>{this.state.loading ? 'Loading...' : ''}</p>
        <button onClick={this.includeNewDog}>Veja outro dog!</button>
      </div>
    );
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    window.localStorage.lastImage = this.state.image;
    if (this.state.breed) window.alert(this.state.breed);
  }

  componentDidMount() {
    console.log('componentDidMount');
    if (window.localStorage.lastImage) {
      this.setState({image: window.localStorage.lastImage, loading: false})
    } else {
      this.fetchAPI();
    }
  }
}

export default Gallery;
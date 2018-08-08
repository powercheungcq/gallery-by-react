require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

var imgDatas = require("../data/imgData.json");

imgDatas = (function(imgArr){
  for (var i = 0; i < imgArr.length; i++) {
    let signleImg = imgArr[i];
    signleImg.imgurl = require("../images/"+signleImg.fileName);
    imgArr[i] = signleImg;
  }
  return imgArr;
})(imgDatas);

class ImgGroup extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    const imgList = imgDatas.map((signleImg) => {
      return (<img key={signleImg.fileName} src={signleImg.imgurl} />);
    });
    return (<div>
        {imgList}
      </div>);
  }
}

class AppComponent extends React.Component {
  render() {
    return (
      <section className = "stage">
        <section className = "img-sec"><ImgGroup /> </section>
        <nav className = "controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

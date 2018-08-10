require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import {findDOMNode} from 'react-dom';
var imgDatas = require('../data/imgData.json');

imgDatas = (function(imgArr){
  for (var i = 0; i < imgArr.length; i++) {
    let signleImg = imgArr[i];
    signleImg.imgurl = require('../images/'+signleImg.fileName);
    imgArr[i] = signleImg;
  }
  return imgArr;
})(imgDatas);


/*
*图片组件
*/
class ImgFigure extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  /*
  *imgFigure 的点击处理函数
  */
  handleClick(e){
    if(!this.props.rangeArr.isCenter){
      this.props.center();
    }else{
      this.props.inverse();
    }

    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    var styleObj = {},borwerPrefix = ['Webkit','Moz','Ms',''];

    //如果有位置信息，则定位图片
    if(this.props.rangeArr.pos){
      styleObj = this.props.rangeArr.pos;
    }

    //如果有旋转角度，且不为0，则添加旋转角度
    if(this.props.rangeArr.rotate){
      borwerPrefix.forEach( (value) => {
          styleObj[value+'Transform'] = 'rotate(' + this.props.rangeArr.rotate + 'deg)';
      });
    }

    //为中间图片添加zindex
    if(this.props.rangeArr.isCenter){
      styleObj['zIndex'] = '11';
      borwerPrefix.forEach( (value) => {

        styleObj[value+'BoxShadow'] = '0 0 5px #878787';
      })
    }

    //如果需要翻转则添加翻转class
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.rangeArr.isInverse ? ' is-inverse':'';

    return (
      <figure className={imgFigureClassName} onClick = {this.handleClick} style = {styleObj}>
        <img src={this.props.data.imgurl}
            alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick = {this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

/*
*取位于两个数之间的随机值
*@prom low:最小值
*       high :最大值
*/
function getRangeRandom(low,high){
  return Math.ceil(Math.random()*(high - low) + low);
}

/*
*获取0 ~ 30°之间的正负值
*/
function getRotate(){
  return (Math.random() > 0.5? '':'-') + Math.ceil(Math.random()*30);
}


//主控制组件
class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.Constant = {
      centerPos:{
        left:0,
        top:0
      },
      hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0],
        secY:[0,0]
      },
      vPosRange:{
        secX:[0,0],
        secY:[0,0]
      }
    };
    this.State = {
      imgsArrangeArr:[
        /*{
          pos:{
            left:'0',
            top:'0'
          },
          rotate:0, //旋转角度
          isInverse:false, //是否翻转
          isCenter:false  //是否为居中图片
        }*/
      ]
    };

    this.rearrange = this.rearrange.bind(this);
    this.inverse = this.inverse.bind(this);
    this.center = this.center.bind(this);
  }

  /*
  *翻转函数
  *@pram index : 需要翻转图片位于数组的index
  *
  *return {function} , 返回一个函数（因为数组index值会随循环变化，所以定义为闭包函数---（函数定义后其参数不发生变化））
  */
  inverse(index){
    return () => {
      var imgsArrangeArr = this.State.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({imgsArrangeArr:imgsArrangeArr});
    }
  }
  center(index){
    return () => {
      this.rearrange(index);
    }
  }
  /*
  *为所有图片定位
  *@pram centerIndex : 需要定位到中间的图片 index
  */
  rearrange(centerIndex){
    var imgsArrangeArr = this.State.imgsArrangeArr,
    Constant = this.Constant,
    centerPos = Constant.centerPos,
    hPosRange = Constant.hPosRange,
    vPosRange = Constant.vPosRange,
    hPosRangeLeftSecX = hPosRange.leftSecX,
    hPosRangeRightSecX = hPosRange.rightSecX,
    hPosRangeY = hPosRange.secY,
    vPosRangeSecY = vPosRange.secY,
    vPosRangeSecX = vPosRange.secX,
    imgsArrangeTopArr = [],    //取一个或者不取
    topImgNum = Math.ceil(Math.random() * 2)-1,
    topImgSpliceIndex = 0,
    imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

    //console.log(topImgNum);
    //首先居中centerIndex的图片
    imgsArrangeCenterArr[0] = {
      pos : centerPos,
      rotate : 0,
      isInverse : false,
      isCenter : true
    }
    //取出要布局上侧的图片信息
    topImgSpliceIndex =  Math.ceil(Math.random()*(imgsArrangeArr - topImgNum)),
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value,index)=>{
      imgsArrangeTopArr[index] ={
        pos:{
            top:getRangeRandom(vPosRangeSecY[0],vPosRangeSecY[1]),
            left:getRangeRandom(vPosRangeSecX[0],vPosRangeSecX[1])
        },
        rotate:getRotate(),
        isInverse:false,
        isCenter:false
      }
    });

    //布局左右的图片
    for (var i = 0,j = imgsArrangeArr.length,k = j /2 ;i < j; i++) {
      if( i < k ){
        imgsArrangeArr[i] = {
          pos:{
            left:getRangeRandom(hPosRangeLeftSecX[0],hPosRangeLeftSecX[1]),
            top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
          },
          rotate:getRotate(),
          isInverse:false,
          isCenter:false
        };
      }else{
        imgsArrangeArr[i] = {
          pos:{
            left:getRangeRandom(hPosRangeRightSecX[0],hPosRangeRightSecX[1]),
            top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
          },
          rotate:getRotate(),
          isInverse:false,
          isCenter:false
        }
      }

    }
    //把中间、顶部 的图片添加回数组 （*必须按取出顺序放回，否则顺序会乱*）
    if(imgsArrangeTopArr && topImgNum == 1 ){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
    this.setState({imgsArrangeArr:imgsArrangeArr});
  }
  componentWillMount(){
    //初始化state
    imgDatas.forEach((value,index)=>{
    //  console.log(index);
      if(!this.State.imgsArrangeArr[index]){

        let imgArr = this.State.imgsArrangeArr;

        imgArr[index] = {
          pos:{
            left:'0',
            top:'0'
          },
          rotate:'0',
          isInverse:false,
          isCenter:false
        };
        this.setState({'imgsArrangeArr':imgArr});

      }
    });

  }
  componentDidMount(){

    //组件加载以后，为每张图片计算位置

    //获取中间展示区域大小
    const stageDom = findDOMNode(this.refs.stage),
          stageW = stageDom.scrollWidth,
          stageH = stageDom.scrollHeight,
          halfStageW = Math.ceil(stageW / 2),
          halfStageH = Math.ceil(stageH / 2);

    //获取一个imgFigure的宽高
    const imgFigureDom = findDOMNode(this.refs.imgFigure0),
          imgW = imgFigureDom.scrollWidth,
          imgH = imgFigureDom.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH = Math.ceil(imgH / 2);

    //中间图片位置计算
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    }

    //左侧，右侧figure位置计算
    this.Constant.hPosRange.leftSecX[0] = - halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.secY[0] = -halfImgH;
    this.Constant.hPosRange.secY[1] = stageH - halfImgH;

    //上侧位置
    this.Constant.vPosRange.secY[0] = - halfImgH;
    this.Constant.vPosRange.secY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.secX[0] = halfStageW - imgW;
    this.Constant.vPosRange.secX[1] = halfStageW;

    this.rearrange(0);

  }
  render() {

      var ImgFigcaptions = imgDatas.map((value,index)=>{
          return (<ImgFigure key={value.fileName} data = {value} center = {this.center(index)} inverse = {this.inverse(index)}
             rangeArr = {this.State.imgsArrangeArr[index]} ref = {'imgFigure' + index}/>
           );
      });
    return (
      <section className = "stage" ref = "stage">
        <section className = "img-sec">
          {ImgFigcaptions}
        </section>
        <nav className = "controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

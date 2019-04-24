var zoom={
  OFFSET:0,//ul的起始left 20
  LIWIDTH:0,//li的宽度 62
  $ul:null,//#icon_list的ul
  LICOUNT:0,//li的个数 8
  moved:0,//左移的个数
  $mask:null,//#mask的小div
  MSIZE:0,//mask的大小
  MAX:0,//mask可用的最大top和left
  $large:null,//#largeDiv
  init(){
    //获取id为icon_list的元素保存在$ul属性中
    this.$ul=$("#icon_list");
    //获得id为largeDiv的元素保存在$large中
    this.$large=$("#largeDiv");
    this.$mask=$("#mask");//获取id为mask的小div
    //获得$mask的宽，转为浮点数保存在MSIZE属性中
    this.MSIZE=parseFloat(
      this.$mask.css("width")
    );
    //获得id为superMask的宽转为浮点数-MSIZE保存到MAX中
    this.MAX=parseFloat(
      $("#superMask").css("width")
    )-this.MSIZE;
    //获得$ul下所有li的个数保存在LICOUNT中
    this.LICOUNT=this.$ul.children().size();
    //获取$ul的left，转为浮点数保存在OFFSET中
    this.OFFSET=parseFloat(this.$ul.css("left"));
    //获取$ul下第一个li的width，转为浮点数保存在LIWIDTH中
    this.LIWIDTH=parseFloat(
      this.$ul.children(":first").css("width")
    );
    //为id为preview下的h1下的第2个a绑定单击事件为moveLeft
    $("#preview>h1>a:last").click(
      {dir:1},//data
      this.move.bind(this)
    );
    $("#preview>h1>a:first").click(
      {dir:-1},//data
      (e)=>this.move(e)
      /*function(e){this.move(e);}.bind(this)*/
    );
    //为$ul添加鼠标进入事件委托:
    this.$ul.on(//要求: 只有li下的img才能响应事件
      //处理函数: changeMImg
      "mouseover","li>img",this.changeMImg
    );
    //为id为superMask的div绑定hover
    //继续为id为supermask的div绑定mousemove为maskMove
    $("#superMask")
      .hover(()=>this.showMask())
      .mousemove((e)=>this.maskMove(e));
  },
  //显示隐藏mask，顺便操作large
  showMask:function(){
    this.$mask.css("display",
      this.$mask.css("display")=="block"?
            "none":"block"
    );
    var src=$("#mImg").attr("src");
    var i=src.lastIndexOf(".");
    this.$large.css("backgroundImage",
      `url(${src.slice(0,i-1)}l${src.slice(i)})`
    )
    this.$large.css("display",
      this.$mask.css("display")
    );
  },
  maskMove:function(e){//响应鼠标移动事件
    var y=e.offsetY,//获得鼠标相对于父元素的y
        x=e.offsetX,//获得鼠标相对于父元素的x
        top=y-this.MSIZE/2,
        left=x-this.MSIZE/2;
    top=top<0?0:top>this.MAX?this.MAX:top;
    left=left<0?0:left>this.MAX?this.MAX:left;
    //修改$mask的top为y-MSIZE/2,left为x-MSIZE/2
    this.$mask.css({top:top,left:left,});
    //修改$large的背景定位
    this.$large.css("backgroundPosition",
      `${-left*16/7}px ${-top*16/7}px`
    )
  },
  changeMImg:function(){//更换中图片: this->img
    var src=this.src;//获得当前img元素的src
    //查找最后一个.的位置保存在i中
    var i=src.lastIndexOf(".");
    $("#mImg").attr(//设置id为mImg的src为:
      //截取src中0~i的子字符串，拼-m，拼src中i到结尾的剩余字符
      "src",src.slice(0,i)+"-m"+src.slice(i));
  },
  move(e){
    var $a=$(e.target)
    //如果当前a的class中没有disabled
    if($a.attr("class").indexOf("disabled")==-1){
      this.moved+=e.data.dir*1;//将moved+1
      //将ul的left修改为: -moved*LIWIDTH+OFFSET
      this.$ul.css("left",
        -this.moved*this.LIWIDTH+this.OFFSET
      );
      this.checkA()
    }
  },
  checkA(){//检查两个a的禁用状态
    //如果LICOUNT-moved==5
    if(this.LICOUNT-this.moved==5){
      $("#preview>h1>a:last").attr(
        "class","forward_disabled");
    }else if(this.moved==0){//否则，如果moved==0
      $("#preview>h1>a:first").attr(
        "class","backward_disabled");
    }else{//否则
      //$("#preview>h1>a:last")的class改为forward
      //$("#preview>h1>a:first")的class改为backward
      $("#preview>h1>a:first")
        .attr("class","backward")
        .next().attr("class","forward");
       }
  }
}
zoom.init();

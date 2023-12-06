var app = {
  start: function () {
    $('.sBtn').click(function () {
      $('.mark').show();
    });
    $('.djks').click(function () {
      var name = $('input').val();
      window.sessionStorage.setItem('name', name);
      location.href = './answer.html';
    });
  },
  answer2: function () {
    $('.answerBox ul').on('click', 'li', function () {
      $(this).addClass('active').siblings().removeClass('active');
    });
    var n = 0;
    $('.nexBtn').click(function () {
      n++;
      console.log(data[n]);
      if (n > 9) {
        console.log('最后一题');
        location.href = './result.html';
      } else {
        $('.answerBox .answerA').hide();
        $('.answerBox ul').hide();
        $('.answerBox .answerA').text(data[n].a);
        for (var i = 0; i < data[n].q.length; i++) {
          $('.answerBox ul li').eq(i).find('span').text(data[n].q[i]);
        }
        if (n >= 9) {
          $(this).addClass('active');
        }
        $('.answerBox .answerA').show();
        $('.answerBox ul').show();
      }

    });
  },
  result: function () {
    var name = window.sessionStorage.getItem('name');
    console.log(name);
    $('.reBox h3 span').text(name);
    var ca = '';
    html2canvas($(".bg")[0], {
      onrendered: function (canvas) {
        //把截取到的图片替换到a标签的路径下载 
        ca = canvas.toDataURL();
        $(".save a").attr('href', canvas.toDataURL());
        //下载下来的图片名字 
        $(".save a").attr('download', 'share.png');
        //document.body.appendChild(canvas);
      }
      //可以带上宽高截取你所需要的部分内容 
      //     , 
      //     width: 300, 
      //     height: 300 
    });
    $('.save').click(function () {
      $('.mark').show();
      Window.href=ca;
    });
    $('.mark').click(function () {
      $('.mark').hide();
    });
    $('.mark div').click(function(event){
      event.stopPropagation()
    });
    var index = Math.floor((Math.random()*hudata.length)); 
    console.log(hudata[index]);
    // console.log(hudata);
    $('.imgBox img').attr('src','images/'+(index+1)+hudata[index].t+'.png');
    $('.huname div').text(hudata[index].t);
    $('.content div').text(hudata[index].r);
  },
  answer: function () {
    var mySwiper = new Swiper('.swiper-container', {
      direction: 'vertical',
    lazyLoading : true,
    mousewheelControl: true,
    watchSlidesProgress: true,
    onInit: function(swiper) {
      swiper.myactive = 0;
    },
    onProgress: function(swiper) {
      for (var i = 0; i < swiper.slides.length; i++) {
        var slide = swiper.slides[i];
        var progress = slide.progress;
        var translate, boxShadow;

        translate = progress * swiper.height * 0.8;
        scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
        boxShadowOpacity = 0;

        slide.style.boxShadow = '0px 0px 10px rgba(0,0,0,' + boxShadowOpacity + ')';

        if (i == swiper.myactive) {
          es = slide.style;
          es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,' + (translate) + 'px,0) scale(' + scale + ')';
          es.zIndex=0;


        }else{
          es = slide.style;
          es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform ='';
          es.zIndex=1;
          
        }

      }

    },


    onTransitionEnd: function(swiper, speed) {
      for (var i = 0; i < swiper.slides.length; i++) {
      //	es = swiper.slides[i].style;
      //	es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = '';

      //	swiper.slides[i].style.zIndex = Math.abs(swiper.slides[i].progress);

        
      }

      swiper.myactive = swiper.activeIndex;

    },
    onSetTransition: function(swiper, speed) {

      for (var i = 0; i < swiper.slides.length; i++) {
        //if (i == swiper.myactive) {

          es = swiper.slides[i].style;
          es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
        //}
      }

    }
})
  }
}
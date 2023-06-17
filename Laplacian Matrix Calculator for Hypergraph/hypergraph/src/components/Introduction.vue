<!--
 * @FileDescription: 介绍拉普拉斯矩阵页面内容【周天立】
 * @Author: May
 * @Date: 2022.04.04
 * @LastEditors: May
 * @LastEditTime: 2022.04.04
 -->
<template>
	<div class="Intro_text">
      <div class=back>
      <div class="slideshow-container">
        <div class="mySlides fade">
        <div class="numbertext">1 / 12</div>
        <div class="text">某地有着不同高度的6个水塔</div>
        <div><img src="../assets/Introduction/L1.png"></div>
        </div>
      
        <div class="mySlides fade">
        <div class="numbertext">2 / 12</div>
        <div class="text">其中一些水塔间连有水渠，假设水塔中水足够,
          水的流动速度与两端塔的高度相关,
          如何通过水塔与周围水塔的连接关系,
          得知每个水塔是流入还是流出水,
          流入或流出多少水呢？
        </div>
        <div><img src="../assets/Introduction/L2.png"></div>
        </div>
      
        <div class="mySlides fade">
        <div class="numbertext">3 / 12</div>
        <div class="text">例如水塔h2,
                考虑和它(一阶)邻连的水渠的水塔h1,h5,h3
        </div>
        <div><img src="../assets/Introduction/L3.png" ></div>
        </div>

        <div class="mySlides fade">
        <div class="numbertext">4 / 12</div>
        <div><img src="../assets/Introduction/L4.png" ></div>
        <div class="text">假设水速与高度差成正比</div>
        </div>
        
        <div class="mySlides fade">
          <div class="numbertext">5 / 12</div>
          <div class="text">把周围水塔流入或流出水量加起来，
                  这样就可以得到水塔h2的水流变化量
          </div>
          <div><img src="../assets/Introduction/L5.png" ></div>
        </div>

        <div class="mySlides fade">
          <div class="numbertext">6 / 12</div>
          <div class="text">但是有6个水塔,
            逐元素计算表示十分麻烦,
            因此采用矩阵的方法去表示
          </div>
          <div><img src="../assets/Introduction/L6.png" ></div>
        </div>

        <div class="mySlides fade">
          <div class="numbertext">7 / 12</div>
          <div class="text">将其中元素转化为矩阵形式</div>
          <div><img src="../assets/Introduction/L7.png" ></div>
        </div>

        <div class="mySlides fade">
          <div class="numbertext">8 / 12</div>
          <div class="text">利用拉普拉斯矩阵作用在节点属性上，
                  就得到了所有节点的一阶变化量</div>
          <div><img src="../assets/Introduction/L8.png" ></div>
        </div>

        <div class="mySlides fade">
          <div class="numbertext">9 / 12</div>
          <div class="text">现在再加上超边的概念</div>
          <div><img src="../assets/Introduction/L9.png" ></div>
        </div>

        <div class="mySlides fade">
          <div class="numbertext">10 / 12</div>
          <div class="text">超边相当于给某几个水塔修了一个公用的蓄水池，
                  这些水塔共同所有这个蓄水池（即采用star expansion方式将超图展开为普通图）
                  </div>
          <div><img src="../assets/Introduction/L10.png" ></div>
        </div>

        <div class="mySlides fade">
          <div class="numbertext">11 / 12</div>
          <div class="text">各节点的连接关系和各超边的节点共同组成了超图的连接关系</div>
          <div><img src="../assets/Introduction/L11.png" ></div>
        </div>

        <div class="mySlides fade">
          <div class="numbertext">12 / 12</div>
          <div class="text">同样，
                  利用超图拉普拉斯矩阵作用在超图节点属性上，
                  就得到了超图中所有节点的一阶变化量</div>
          <div><img src="../assets/Introduction/L12.png" ></div>
        </div>
        <a class="prev" v-on:click="plusSlides(-1)">❮</a>
        <a class="next" v-on:click="plusSlides(1)">❯</a>
      </div>
      <br>
      
      <div style="text-align:center">
        <span class="dot" v-on:click="currentSlide(1)"></span> 
        <span class="dot" v-on:click="currentSlide(2)"></span> 
        <span class="dot" v-on:click="currentSlide(3)"></span> 
        <span class="dot" v-on:click="currentSlide(4)"></span> 
        <span class="dot" v-on:click="currentSlide(5)"></span> 
        <span class="dot" v-on:click="currentSlide(6)"></span> 
        <span class="dot" v-on:click="currentSlide(7)"></span> 
        <span class="dot" v-on:click="currentSlide(8)"></span> 
        <span class="dot" v-on:click="currentSlide(9)"></span> 
        <span class="dot" v-on:click="currentSlide(10)"></span> 
        <span class="dot" v-on:click="currentSlide(11)"></span>
        <span class="dot" v-on:click="currentSlide(12)"></span>  
      </div>
    </div>
	</div>
</template>

<script>
export default {
  name: 'Introduction',
  data(){
    return{
      slideIndex: 1
    };
  },
  mounted(){
    this.showSlides(this.slideIndex);
  },
  methods:{
    plusSlides(n){
      this.showSlides(this.slideIndex += n);
    },
    currentSlide(n){
      this.showSlides(this.slideIndex = n);
    },
    showSlides(n){
      var i;
      var slides = document.getElementsByClassName("mySlides");
      var dots = document.getElementsByClassName("dot");
      if (n > slides.length) {this.slideIndex = 1} 
      if (n < 1) {this.slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none"; 
      }
      for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[this.slideIndex-1].style.display = "block"; 
      dots[this.slideIndex-1].className += " active";
    }
  }
}
</script>

<!--
	现在的style只是一个示范，布局这些并没有写
-->
<style scoped>
h2{
	color: #2c3e50;
}
.Intro_text{
	background-color: #FFFAF0;
}

.back{
  font-family: Verdana,sans-serif;
}
.mySlides {display:none}
/* 幻灯片容器 */
.slideshow-container {
  width: 100%;
  position: relative;
  text-align: center;
}

/* 下一张 & 上一张 按钮 */
.prev, .next {
  cursor: pointer;
  position: absolute;
  text-align: 10%;
  top: 50%;
  width: 1%;
  margin-top: -22px;
  padding: 16px;
  color: grey;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
}


/* 背景图片 */
.back{
  
  background: url('../assets/Introduction/back.jpeg');
  background-size: 90% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

/* 幻灯片图片 */
img{
  margin-top: 2%;
  text-align: center;
  width: 60%;
  height: 38%;
}

/* 定位 "上一张" 按钮靠左 */
.prev {
  left: 0;
  border-radius: 3px 0 0 3px;
}

/* 定位 "下一张" 按钮靠右 */
.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}

/* On hover, add a black background color with a little bit see-through */
.prev:hover, .next:hover {
  background-color: rgba(0,0,0,0.8);
}

/*  */
.text {
  color: black;
  font-size: 18px;
  position: absolute;
  width: 80%;
  left: 10%;
  right: 10%;
  bottom: 3%;
  font-family: 宋体;
}


/* 数字文本 (1/12 等) */
.numbertext {
  color: black;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  bottom: 0;
  right: 10%;
}

/* 标记符号 */
.dot {
  cursor:pointer;
  height: 13px;
  width: 13px;
  margin: 0 0px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active, .dot:hover {
  background-color: #717171;
}

/* 淡出动画 */
.fade {
  -webkit-animation-name: fade;
  -webkit-animation-duration: 1.5s;
  animation-name: fade;
  animation-duration: 1.5s;
}

@-webkit-keyframes fade {
  from {opacity: .4} 
  to {opacity: 1}
}

@keyframes fade {
  from {opacity: .4} 
  to {opacity: 1}
}
</style>

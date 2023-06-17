<!--
 * @FileDescription: 超图+H矩阵【徐沁玫 石大川 史伊凡】
 * @Author: May
 * @Date: 2022.04.04
 -->
<template>
	<div class="graph">
    <el-row>
      <el-button size="small" type="success" v-on:click="addVertex">增加点</el-button>
      <el-button size="small" type="danger" v-on:click="deleteVertex">删除点</el-button>
    </el-row>
  </div>
  <div class="matrix_text">

  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import * as d3 from 'd3'


export default {
  name: 'Hypergraph',
  data(){
    // 拿到数据
    var vertex_data = getCurrentInstance()?.appContext.config.globalProperties.$vertexs;
    return {
      vertex_data : vertex_data,
    }
  },
  watch:{
    // 监听数据，如果数据更新则调用handler
    vertex_data:{
      handler(newVal){
        // console.log("Change");
        // 【改变数据】 数据发生改变就会调用
        // 转换数据成数组
        var v_data = this.vertex_data;
        var dataset = [{vertex: "vertex1", show:this.vertex_data.vertex1.show,edge:this.vertex_data.vertex1.edge}, {vertex: "vertex2", show:this.vertex_data.vertex2.show,edge:this.vertex_data.vertex2.edge},{vertex: "vertex3", show:this.vertex_data.vertex3.show,edge:this.vertex_data.vertex3.edge},{vertex: "vertex4", show:this.vertex_data.vertex4.show,edge:this.vertex_data.vertex4.edge},{vertex: "vertex5", show:this.vertex_data.vertex5.show,edge:this.vertex_data.vertex5.edge}];

        // console.log(this.vertex_data);
        var pos = [{x: 20, y:130},{x:35, y:50},{x:130, y:50},{x:85, y:125},{x:82.5, y: 40},{x:55, y:90},{x:110, y:90},{x:85, y:85}];
        // 动画函数设定
        var t = d3.transition()
                  .duration(1000)
                  .ease(d3.easePolyOut);
        // 选中所有点，判断它们的位置和状态是否跟数据一致
        d3.select("#h_svg").selectAll(".vertex").each(function(d, i){
          d3.select(this).select('circle')
            .attr("visibility", function(){
              // console.log(i);
              d.show = dataset[i].show;
              if(d.show == true){
                d3.select(this.parentNode).select('text').attr("visibility","visible");
                return "visible";
              }
              else{
                d3.select(this.parentNode).select('text').attr("visibility","hidden");
                return "hidden";
              }
            })
          
          // 计算位置
          var curr_vx = d3.select(this).select('circle').attr('cx');
          var curr_vy = d3.select(this).select('circle').attr('cy');
          // 判断点在哪个区域
          // 判断现在点在哪个区域里
          var curr_edge = 0;
          var r_1 = document.getElementById("region1");
          var r_2 = document.getElementById("region2");
          var r_3 = document.getElementById("region3");
          var r_4 = document.getElementById("region4");
          var r_5 = document.getElementById("region5");
          var r_6 = document.getElementById("region6");
          var r_7 = document.getElementById("region7");
          var svg_d = document.getElementById("h_svg");
          var point = svg_d.createSVGPoint();
          point.x = curr_vx;
          point.y = curr_vy;
          if(r_1.isPointInFill(point))
            curr_edge = 1;
          else if(r_2.isPointInFill(point))
            curr_edge = 2;
          else if(r_3.isPointInFill(point))
            curr_edge = 3;
          else if(r_4.isPointInFill(point))
            curr_edge = 4;
          else if(r_5.isPointInFill(point))
            curr_edge = 5;
          else if(r_6.isPointInFill(point))
            curr_edge = 6;
          else if(r_7.isPointInFill(point))
            curr_edge = 7;

          // 判断现在数据里点应该在哪个区域里
          var in_e1 = false;
          var in_e2 = false;
          var in_e3 = false;
          d.edge = dataset[i].edge;
          for(var i = 0; i < d.edge.length; i++){
            if(d.edge[i] == "e1")
              in_e1 = true;
            else if(d.edge[i] == "e2")
              in_e2 = true;
            else if(d.edge[i] == "e3")
              in_e3 = true;
          }
          var store_edge = 0;
          if(in_e1 == true && in_e2 == false && in_e3 == false)
            store_edge = 1;
          else if(in_e1 == false && in_e2 == true && in_e3 == false)
            store_edge = 2;
          else if(in_e1 == false && in_e2 == false && in_e3 == true)
            store_edge = 3;
          else if(in_e1 == true && in_e2 == true && in_e3 == false)
            store_edge = 4;
          else if(in_e1 == true && in_e2 == false && in_e3 == true)
            store_edge = 5;
          else if(in_e1 == false && in_e2 == true && in_e3 == true)
            store_edge = 6;
          else if(in_e1 == true && in_e2 == true && in_e3 == true)
            store_edge = 7;

          // 如果区域不同那么就要换地方
          if(store_edge != curr_edge){
            d3.select(this).select("circle").transition(t)
              .attr("cx", pos[store_edge].x)
              .attr("cy", pos[store_edge].y);

            d3.select(this).select("text").transition(t)
              .attr("x",function(){
                var x = pos[store_edge].x - 13 > 0 ? pos[store_edge].x - 13 : 0;
                return x;
                })
              .attr("y", function(){
                var y = pos[store_edge].y - 5 > 0 ? pos[store_edge].y - 5 : 0;
                return y;
              })
            }
        })
      },
      deep: true
    }
  },
  mounted(){
    // 增加svg
    var svg = d3.select(".graph").append('svg').attr("id","h_svg");
    svg.style("width","100%");
    svg.style("height","100%");

    /*画三个超边 begin*/
    var r = 50;
    var e1_x = 60;
    var e1_y = 60;
    // 先画好着色区域
    // 填充色
    svg.append("circle")
        .attr("r", r)
        .attr("cx", e1_x)
        .attr("cy", e1_y)
        .attr("fill","#FA8072")
        .attr("fill-opacity",0)
        .attr("id","e1");

    svg.append("circle")
        .attr("r", r)
        .attr("cx", function(){
          return e1_x + r;
        })
        .attr("cy", function(){
          return e1_y;
        })
        .attr("fill","#87CEFA")
        .attr("fill-opacity",0)
        .attr("id","e2");

    svg.append("circle")
        .attr("r", r)
        .attr("cx", function(){
          return e1_x + r / 2;
        })
        .attr("cy", function(){
          return e1_y + Math.sqrt(3) * r * 0.5;
        })
        .attr("fill-opacity",0)
        .attr("fill","#F0E68C")
        .attr("id","e3");

    // 边线
    svg.append("circle")
        .attr("r", r)
        .attr("cx", e1_x)
        .attr("cy", e1_y)
        .attr("stroke", "#FF4500")
        .attr("fill","none")
        .attr("stroke-width",1.5);

    svg.append("circle")
        .attr("r", r)
        .attr("cx", function(){
          return e1_x + r;
        })
        .attr("cy", function(){
          return e1_y;
        })
        .attr("stroke", "#1E90FF")
        .attr("fill","none")
        .attr("stroke-width",1.5);

    svg.append("circle")
        .attr("r", r)
        .attr("cx", function(){
          return e1_x + r / 2;
        })
        .attr("cy", function(){
          return e1_y + Math.sqrt(3) * r * 0.5;
        })
        .attr("stroke", "#DAA520")
        .attr("fill","none")
        .attr("stroke-width",1.5);

    // label
    svg.append("text")
       .attr("text-anchor","middle")
       .attr("x",e1_x - r + 5)
       .attr("y",e1_y - r + 13)
       .attr("fill","#FF4500")
       .attr("font-size",17)
       .attr("font-family","v-sans")
       .text("e₁");

    svg.append("text")
       .attr("text-anchor","middle")
       .attr("x",e1_x + 2 * r - 2)
       .attr("y",e1_y - r + 13)
       .attr("fill","#1E90FF")
       .attr("font-size",17)
       .attr("font-family","v-sans")
       .text("e₂");

    svg.append("text")
       .attr("text-anchor","middle")
       .attr("x",e1_x + r / 2)
       .attr("y",e1_y + 2 * r + 5)
       .attr("fill","#DAA520")
       .attr("font-size",17)
       .attr("font-family","v-sans")
       .text("e₃");

    // 画六个响应区域
    // 先确定六个path
    // 仅红边
    var path_1 ="M "+(e1_x+r/2)+","+(e1_y-Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 0 "+((-1)*r)+","+(Math.sqrt(3)*r)+" a "+r+","+r+" 0 0 1 "+(0.5*r)+","+(Math.sqrt(3)*r*0.5*(-1))+" a "+r+","+r+" 0 0 1 "+(0.5*r)+","+(Math.sqrt(3)*r*0.5*(-1))+" Z";
    
    svg.append("path")
        .attr("d",path_1)
        .attr("id","region1")
        .attr("fill","none")
        .attr("pointer-events","all")
        .on("mouseover",function(){
          d3.select("#e1").attr("fill-opacity",0.5);
        })
        .on("mouseleave",function(){
          d3.select("#e1").attr("fill-opacity",0);
        });

    // 仅蓝边
    var path_2 = "M "+(e1_x+r/2)+","+(e1_y-Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 1 "+r+","+(Math.sqrt(3)*r)+" a "+r+","+r+" 0 0 0 "+((-1)*r*0.5)+","+(Math.sqrt(3)*r*0.5*(-1))+" a "+r+","+r+" 0 0 0 "+((-1)*r*0.5)+","+(Math.sqrt(3)*r*0.5*(-1))+" Z";
    svg.append("path")
       .attr("d",path_2)
       .attr("id","region2")
       .attr("fill","none")
       .attr("pointer-events","all")
       .on("mouseover",function(){
          d3.select("#e2").attr("fill-opacity",0.5);
        })
       .on("mouseleave",function(){
          d3.select("#e2").attr("fill-opacity",0);
        });

    // 仅黄边
    var path_3 ="M "+(e1_x-r/2)+","+(e1_y+Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 0 "+(2*r)+",0"+" a "+r+","+r+" 0 0 1 "+((-1)*r)+",0"+" a "+r+","+r+" 0 0 1 "+((-1)*r)+",0"+" Z";

    svg.append("path")
       .attr("d",path_3)
       .attr("id","region3")
        .attr("fill","none")
        .attr("pointer-events","all")
        .on("mouseover",function(){
          d3.select("#e3").attr("fill-opacity",0.5);
        })
        .on("mouseleave",function(){
          d3.select("#e3").attr("fill-opacity",0);
        });

    // 红+蓝
    var path_4 = "M "+(e1_x+r/2)+","+(e1_y-Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 0"+((-1)*0.5*r)+","+(Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 1"+r+","+0+" a "+r+","+r+" 0 0 0"+((-1)*0.5*r)+","+(Math.sqrt(3)*r*0.5*(-1))+" Z";

    svg.append("path")
       .attr("d",path_4)
       .attr("id","region4")
        .attr("fill","none")
        .attr("pointer-events","all")
        .on("mouseover",function(){
          d3.select("#e1").attr("fill-opacity",0.5);
          d3.select("#e2").attr("fill-opacity",0.5);
        })
        .on("mouseleave",function(){
          d3.select("#e1").attr("fill-opacity",0);
          d3.select("#e2").attr("fill-opacity",0);
        });

    // 红+黄
    var path_5 = "M "+(e1_x-r/2)+","+(e1_y+Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 1"+(0.5*r)+","+((-1)*Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 0 "+(0.5*r)+","+(Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 1 "+((-1)*r)+","+"0 Z";

    svg.append("path")
       .attr("d",path_5)
       .attr("id","region5")
        .attr("fill","none")
        .attr("pointer-events","all")
        .on("mouseover",function(){
          d3.select("#e1").attr("fill-opacity",0.5);
          d3.select("#e3").attr("fill-opacity",0.5);
        })
        .on("mouseleave",function(){
          d3.select("#e1").attr("fill-opacity",0);
          d3.select("#e3").attr("fill-opacity",0);
        });

    // 黄+蓝
    var path_6 = "M "+(e1_x+r/2)+","+(e1_y+Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 0"+(0.5*r)+","+((-1)*Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 1 "+r/2+","+(Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 1 "+((-1)*r)+","+0+"Z";

    svg.append("path")
       .attr("d",path_6)
       .attr("id","region6")
        .attr("fill","none")
        .attr("pointer-events","all")
        .on("mouseover",function(){
          d3.select("#e2").attr("fill-opacity",0.5);
          d3.select("#e3").attr("fill-opacity",0.5);
        })
        .on("mouseleave",function(){
          d3.select("#e2").attr("fill-opacity",0);
          d3.select("#e3").attr("fill-opacity",0);
        });

      // 红+黄+蓝
      var path_7 = "M "+(e1_x+r/2)+","+(e1_y+Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 0"+(0.5*r)+","+((-1)*Math.sqrt(3)*r*0.5)+" a "+r+","+r+" 0 0 0"+((-1)*r)+","+0+" a "+r+","+r+" 0 0 0"+(0.5*r)+","+(Math.sqrt(3)*r*0.5)+"Z";

      svg.append("path")
       .attr("d",path_7)
       .attr("id","region7")
        .attr("fill","none")
        .attr("pointer-events","all")
        .on("mouseover",function(){
          d3.select("#e1").attr("fill-opacity",0.5);
          d3.select("#e2").attr("fill-opacity",0.5);
          d3.select("#e3").attr("fill-opacity",0.5);
        })
        .on("mouseleave",function(){
          d3.select("#e1").attr("fill-opacity",0);
          d3.select("#e2").attr("fill-opacity",0);
          d3.select("#e3").attr("fill-opacity",0);
        });

    /*画三个超边 end*/

    /*初始化点 begin*/
    // 这里还需要看之后初始数据需不需要改动
    // 【改变数据】 v_data是数据 is_h_change是data()里面存的那个Boolean值，它用于表示数据的改变是否是由于在hypergraph上进行改动造成的。true表示是，false表示否
    var init_pos = [{x:35,y:50},{x:130,y:50},{x:85,y:125},{x:20,y:130},{x:20,y:130}];
    var v_data = this.vertex_data;
    var dataset = [{vertex: "vertex1", show:this.vertex_data.vertex1.show,edge:this.vertex_data.vertex1.edge}, {vertex: "vertex2", show:this.vertex_data.vertex2.show,edge:this.vertex_data.vertex2.edge},{vertex: "vertex3", show:this.vertex_data.vertex3.show,edge:this.vertex_data.vertex3.edge},{vertex: "vertex4", show:this.vertex_data.vertex4.show,edge:this.vertex_data.vertex4.edge},{vertex: "vertex5", show:this.vertex_data.vertex5.show,edge:this.vertex_data.vertex5.edge}];

    // 增加点，注意交互问题：还是需要设置mouseover
    var v_selection = svg.selectAll(".vertex")
                          .data(dataset)
                          .enter().append("g")
                          .attr("class","vertex");
      // 文本
      v_selection.append("text")
                  .text(function(d, i){
                    if(d.vertex == "vertex1")
                      return "v₁";
                    else if(d.vertex == "vertex2")
                      return "v₂";
                    else if(d.vertex == "vertex3")
                      return "v₃";
                    else if(d.vertex == "vertex4")
                      return "v₄";
                    else if(d.vertex == "vertex5")
                      return "v₅";
                  })
                  .attr("x", function(d, i){
                    return init_pos[i].x - 13;
                  })
                  .attr("y", function(d, i){
                    return init_pos[i].y - 5;
                  })
                  .attr("font-size",13)
                  .attr("font-family","v-sans")
                  .attr("fill","#3d3d3d")
                  .attr("visibility", function(d,i){
                      if(d.show == true)
                        return "visible";
                      else
                        return "hidden";
                  })
                  .attr("pointer-events","none");


      // 点
      v_selection.append("circle")
                  .attr("r" , 3)
                  .attr("fill"," #3d3d3d")
                  .attr("cx" , function(d,i){
                      return init_pos[i].x;
                  })
                  .attr("cy", function(d, i){
                      return init_pos[i].y;
                  })
                  .attr("visibility", function(d,i){
                      if(d.show == true)
                        return "visible";
                      else
                        return "hidden";
                  })
                  .on('mouseover', function(event, d){
                        var r_1 = document.getElementById("region1");
                        var r_2 = document.getElementById("region2");
                        var r_3 = document.getElementById("region3");
                        var r_4 = document.getElementById("region4");
                        var r_5 = document.getElementById("region5");
                        var r_6 = document.getElementById("region6");
                        var r_7 = document.getElementById("region7");
                        var svg_d = document.getElementById("h_svg");
                        var point = svg_d.createSVGPoint();
                        point.x = event.layerX;
                        point.y = event.layerY;
                        if(r_1.isPointInFill(point)){
                          d3.select("#e1").attr("fill-opacity",0.5);
                        }
                        else if(r_2.isPointInFill(point)){
                          d3.select("#e2").attr("fill-opacity",0.5);
                        }
                        else if(r_3.isPointInFill(point)){
                          d3.select("#e3").attr("fill-opacity",0.5);
                        }
                        else if(r_4.isPointInFill(point)){
                          d3.select("#e1").attr("fill-opacity",0.5);
                          d3.select("#e2").attr("fill-opacity",0.5);
                        }
                        else if(r_5.isPointInFill(point)){
                          d3.select("#e1").attr("fill-opacity",0.5);
                          d3.select("#e3").attr("fill-opacity",0.5);
                        }
                        else if(r_6.isPointInFill(point)){
                          d3.select("#e2").attr("fill-opacity",0.5);
                          d3.select("#e3").attr("fill-opacity",0.5);
                        }
                        else if(r_7.isPointInFill(point)){
                          d3.select("#e1").attr("fill-opacity",0.5);
                          d3.select("#e2").attr("fill-opacity",0.5);
                          d3.select("#e3").attr("fill-opacity",0.5);
                        }
                  })
                  .on('mouseleave', function(){
                    d3.select("#e1").attr("fill-opacity",0);
                    d3.select("#e2").attr("fill-opacity",0);
                    d3.select("#e3").attr("fill-opacity",0);
                  })
                  .call(
                      d3.drag()
                        .on('start',() => {})
                        .on('end', function(event, d){
                            var r_1 = document.getElementById("region1");
                            var r_2 = document.getElementById("region2");
                            var r_3 = document.getElementById("region3");
                            var r_4 = document.getElementById("region4");
                            var r_5 = document.getElementById("region5");
                            var r_6 = document.getElementById("region6");
                            var r_7 = document.getElementById("region7");
                            var svg_d = document.getElementById("h_svg");
                            var point = svg_d.createSVGPoint();
                            point.x = event.x;
                            point.y = event.y;

                            // 判断现在点在什么位置
                            var curr_edge = 0;
                            if(r_1.isPointInFill(point))
                              curr_edge = 1;
                            else if(r_2.isPointInFill(point))
                              curr_edge = 2;
                            else if(r_3.isPointInFill(point))
                              curr_edge = 3;
                            else if(r_4.isPointInFill(point))
                              curr_edge = 4;
                            else if(r_5.isPointInFill(point))
                              curr_edge = 5;
                            else if(r_6.isPointInFill(point))
                              curr_edge = 6;
                            else if(r_7.isPointInFill(point))
                              curr_edge = 7;

                            // 判断存的点在什么位置
                            var in_e1 = false;
                            var in_e2 = false;
                            var in_e3 = false;
                            for(var i = 0; i < d.edge.length; i++){
                              if(d.edge[i] == "e1")
                                in_e1 = true;
                              else if(d.edge[i] == "e2")
                                in_e2 = true;
                              else if(d.edge[i] == "e3")
                                in_e3 = true;
                            }
                            var store_edge = 0;
                            if(in_e1 == true && in_e2 == false && in_e3 == false)
                              store_edge = 1;
                            else if(in_e1 == false && in_e2 == true && in_e3 == false)
                              store_edge = 2;
                            else if(in_e1 == false && in_e2 == false && in_e3 == true)
                              store_edge = 3;
                            else if(in_e1 == true && in_e2 == true && in_e3 == false)
                              store_edge = 4;
                            else if(in_e1 == true && in_e2 == false && in_e3 == true)
                              store_edge = 5;
                            else if(in_e1 == false && in_e2 == true && in_e3 == true)
                              store_edge = 6;
                            else if(in_e1 == true && in_e2 == true && in_e3 == true)
                              store_edge = 7;

                            // 【改变数据】 如果当前点的位置与存的数据不同，就要改变数据了
                            if(curr_edge !== store_edge){
                              if(curr_edge == 0){
                                d.edge = [];
                                v_data[d.vertex].edge = [];
                              }
                              else if(curr_edge == 1){
                                d.edge = ["e1"];
                                v_data[d.vertex].edge = ["e1"];
                              }
                              else if(curr_edge == 2){
                                d.edge = ["e2"];
                                v_data[d.vertex].edge = ["e2"];
                              }
                              else if(curr_edge == 3){
                                d.edge = ["e3"];
                                v_data[d.vertex].edge = ["e3"];
                              }
                              else if(curr_edge == 4){
                                d.edge = ["e1","e2"];
                                v_data[d.vertex].edge = ["e1","e2"];
                              }
                              else if(curr_edge == 5){
                                d.edge = ["e1","e3"];
                                v_data[d.vertex].edge = ["e1","e3"];
                              }
                              else if(curr_edge == 6){
                                d.edge = ["e2","e3"];
                                v_data[d.vertex].edge = ["e2","e3"];
                              }
                              else if(curr_edge == 7){
                                d.edge = ["e1","e2","e3"];
                                v_data[d.vertex].edge = ["e1","e2","e3"];
                              }
                            }
                          })
                        .on('drag', function(event, d){
                            d3.select(this)
                            .attr('cx', event.x)
                            .attr('cy', event.y);
                            d3.select(this.parentNode).select('text').attr("x", event.x - 13).attr("y", event.y - 5);

                            var r_1 = document.getElementById("region1");
                            var r_2 = document.getElementById("region2");
                            var r_3 = document.getElementById("region3");
                            var r_4 = document.getElementById("region4");
                            var r_5 = document.getElementById("region5");
                            var r_6 = document.getElementById("region6");
                            var r_7 = document.getElementById("region7");
                            var svg_d = document.getElementById("h_svg");
                            var point = svg_d.createSVGPoint();
                            point.x = event.x;
                            point.y = event.y;
                            if(r_1.isPointInFill(point)){
                              d3.select("#e1").attr("fill-opacity",0.5);
                              d3.select("#e2").attr("fill-opacity",0);
                              d3.select("#e3").attr("fill-opacity",0);
                            }
                            else if(r_2.isPointInFill(point)){
                              d3.select("#e1").attr("fill-opacity",0);
                              d3.select("#e2").attr("fill-opacity",0.5);
                              d3.select("#e3").attr("fill-opacity",0);
                            }
                            else if(r_3.isPointInFill(point)){
                              d3.select("#e1").attr("fill-opacity",0);
                              d3.select("#e2").attr("fill-opacity",0);
                              d3.select("#e3").attr("fill-opacity",0.5);
                            }
                            else if(r_4.isPointInFill(point)){
                              d3.select("#e1").attr("fill-opacity",0.5);
                              d3.select("#e2").attr("fill-opacity",0.5);
                              d3.select("#e3").attr("fill-opacity",0);
                            }
                            else if(r_5.isPointInFill(point)){
                              d3.select("#e1").attr("fill-opacity",0.5);
                              d3.select("#e2").attr("fill-opacity",0);
                              d3.select("#e3").attr("fill-opacity",0.5);
                            }
                            else if(r_6.isPointInFill(point)){
                              d3.select("#e1").attr("fill-opacity",0);
                              d3.select("#e2").attr("fill-opacity",0.5);
                              d3.select("#e3").attr("fill-opacity",0.5);
                            }
                            else if(r_7.isPointInFill(point)){
                              d3.select("#e1").attr("fill-opacity",0.5);
                              d3.select("#e2").attr("fill-opacity",0.5);
                              d3.select("#e3").attr("fill-opacity",0.5);
                            }
                          })
        );
    /*初始化点 end*/
  },
  methods:{
    //【改变数据】增删点 注意删点的时候edge也清空！！！
    addVertex(){
      var data = this.vertex_data;
      if(data.vertex1.show == false){
        data.vertex1.show = true;
      }
      else if(data.vertex2.show == false){
        data.vertex2.show = true;
      }
      else if(data.vertex3.show == false){
        data.vertex3.show = true;
      }
      else if(data.vertex4.show == false){
        data.vertex4.show = true;
      }
      else if(data.vertex5.show == false){
        data.vertex5.show = true;
      }
    },
    deleteVertex(){
      var data = this.vertex_data;
      if(data.vertex5.show == true){
        data.vertex5.show = false;
        data.vertex5.edge = [];
      }
      else if(data.vertex4.show == true){
        data.vertex4.show = false;
        data.vertex4.edge = [];
      }
      else if(data.vertex3.show == true){
        data.vertex3.show = false;
        data.vertex3.edge = [];
      }
      else if(data.vertex2.show == true){
        data.vertex2.show = false;
        data.vertex2.edge = [];
      }
      else if(data.vertex1.show == true){
        data.vertex1.show = false;
        data.vertex1.edge = [];
      }
    }
  }
}
</script>

<!--
	现在的style只是一个示范，布局这些并没有写
-->
<style scoped>
.graph{
  width: 100%;
  height: 100%;
}
</style>
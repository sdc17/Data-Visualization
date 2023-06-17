<!--
 * @FileDescription: 矩阵计算【石大川 史伊凡】
 * @Author: May
 * @Date: 2022.04.18
 * @LastEditors: syf
 * @LastEditTime: 2022.04.18
 -->
<template>
	<div class="Matrix"> </div>
  <h2><span style="font-size: 25px;">MATRIX COMPUTATION</span></h2>
  <n-divider />
  <div style="width: 290px;height: 100%;margin-left: 10px;float: left;">
    <div class='Box_H'> 
      <h3><span style="margin-left: 5px"> Incidence Matrix {{H_text}} : </span></h3>
      <div v-html='H'></div>
    </div>
    <div style="height: 10px;"></div>
    <div class='Box_De'> 
      <h3><span style="margin-left: 3px"> Matrix of the degree of hyperedge {{De_text}} : </span></h3>
      <div v-html='De'></div>
    </div>
    <div style="height: 30px;"></div>
    <div class='Box_Dv'> 
      <h3><span style="margin-left: 5px"> Matrix of the degree of vertex {{Dv_text}} : </span></h3>
      <div v-html='Dv'></div>
    </div>
  </div>
  <div style="width: 315px;height: 100%;margin-left: 20px;float: left;">
    <div class='Box_Htran'> 
      <h3><span style="margin-left: 5px"> Transpose Matrix of {{H_text}} : </span></h3>
      <div v-html='H_tran'></div>
    </div>
    <div style="height: 10px;"></div>
    <div class='Box_Deinv'> 
      <h3><span style="margin-left: 5px"> Inverse Matrix of {{De_text}} : </span></h3>
      <div v-html='De_i'></div>
    </div>
    <div style="height: 30px;"></div>
    <div class='Box_W'> 
      <h3> Matrix of the hyperedge weights {{W_text}} (fixed): </h3>
      <div v-html='W'></div>
    </div>
  </div>
  <div style="width: 300px;height: 100%;margin-left: 80px;float: left;">
    <div style="height: 20%;"></div>
    <div class='Box_Delta'> 
      <h3><span style="font-size: 24px;margin-left:5px"> Laplacian Matrix : </span></h3>
      <span style="font-size: 19px;margin-left: 70px">{{L_func}}</span>
    <div v-html='Delta'></div>
    </div>
  </div>
</template>


<!--
<script>
export default {
  name: 'Matrix',
  props: {
    msg: String
  }
}
</script>
 -->

<script>
import { getCurrentInstance } from 'vue'
const matrix = require('matrix-js')
const maxEdges = 3;


function weightMatrix(){
  var W = []
  for (var i = 0; i < maxEdges; i++){
    var row = []
    for (var j = 0; j < maxEdges; j++){
      if (i == j){
        row.push(1);
      }
      else{
        row.push(0);
      }
    }
    W.push(row);
  }
  // console.log(W);
  return W;
}

function incidenceMatrix(vertexs, edges){
  var H = []
  for (var i = 0; i < vertexs.length; i++){
    var row = []
    for (var j = 0; j < maxEdges; j++){
      row.push(0)
    }
    if (vertexs[i] == true && edges[i].length > 0){
      H.push(row)
    }
  }
  for (var i = 0; i < edges.length; i++){
    for (var j in edges[i]){
      var currentEdge = Number(edges[i][j].slice(1)) - 1;
      H[i][currentEdge] = 1;
    }
  }
  // console.log(H)
  return H
}

function matrixHyperedge(incidenceMatrix){
  var De = [];
  for (var i = 0; i < maxEdges; i++){
    var row = []
    for (var j = 0; j < maxEdges; j++){
      if (i == j){
        var value = 0;
        for (var k = 0; k < incidenceMatrix.length; k++){
          value += incidenceMatrix[k][j];
        }
        row.push(value);
      }
      else{
        row.push(0);
      }
    }
    De.push(row);
  }
  // console.log(De)
  return De
}

function matrixVertex(W, incidenceMatrix){
  var Dv = [];
  for (var i = 0; i < incidenceMatrix.length; i++){
    var row = []
    for (var j = 0; j < incidenceMatrix.length; j++){
      if (i == j){
        var value = 0;
        for (var k = 0; k < maxEdges; k++){
          value += (W[k][k] * incidenceMatrix[j][k]);
        }
        row.push(value);
      }
      else{
        row.push(0);
      }
    }
    Dv.push(row);
    // console.log(<br/>);
  }
  // console.log(Dv);
  return Dv
}

function matrixLaplacian(W, H, De, Dv){
  var W = matrix(W);
  var H = matrix(H);
  var De = matrix(De);
  var Dv = matrix(Dv);
  
  var delta = Dv.sub(matrix(matrix(matrix(H.prod(W)).prod(matrix(De.inv()))).prod(matrix(H.trans()))))
  for (var i = 0; i < delta.length; i++){
    for (var j = 0; j < delta[i].length; j++){
      delta[i][j] = delta[i][j].toFixed(4);
    }
  }
  // console.log(delta);
  return delta
}

function matrix2latex(M){
  var lstr = "$$\\begin{bmatrix} ";
  for(var i = 0; i < M.length; i++){
    for(var j = 0; j < M[i].length; j++){
      lstr += M[i][j].toString() + " ";
      if(j != M[i].length - 1)
        lstr += "& ";
    }
    if(i != M.length - 1)
      lstr += "\\\\ ";
  }
  lstr += "\\end{bmatrix}$$";

  return lstr;
}

export default {
  name: 'Matrix',
  data(){
    var vertex_data = getCurrentInstance()?.appContext.config.globalProperties.$vertexs;
    return {
      vertex_data : vertex_data,
      H: null,
      W: null,
      bStr: null,
      De: null,
      Dv: null,
      Delta: null,
      H_tran: null,
      De_i: null,
      W_text: '\\(W\\)',
      H_text: '\\(H\\)',
      De_text: '\\(D_e\\)',
      Dv_text: '\\(D_v\\)',
      L_text:'\\(\\Delta\\)',
      L_func:'\\(\\Delta=D_v-HWD_e^{-1}H^T\\)'
    }
  },
  watch:{
    vertex_data:{
      handler(newVal){
        var v_data = this.vertex_data;
        var vertexs = [
          this.vertex_data.vertex1.show,
          this.vertex_data.vertex2.show,
          this.vertex_data.vertex3.show,
          this.vertex_data.vertex4.show,
          this.vertex_data.vertex5.show
          ];
        var edges = [
          this.vertex_data.vertex1.edge,
          this.vertex_data.vertex2.edge,
          this.vertex_data.vertex3.edge,
          this.vertex_data.vertex4.edge,
          this.vertex_data.vertex5.edge
          ];
        var W = weightMatrix();
        var H = incidenceMatrix(vertexs, edges);
        var De = matrixHyperedge(H);
        var Dv = matrixVertex(W, H);
        var Delta = matrixLaplacian(W, H, De, Dv);
        var temp_H = matrix(H);
        var H_tran = temp_H.trans();
        var temp_De = matrix(De);
        var De_inv = temp_De.inv();
        for (var i = 0; i < De_inv.length; i++){
          for (var j = 0; j < De_inv[i].length; j++){
            De_inv[i][j] = De_inv[i][j].toFixed(4);
          }
        }

        /*
        console.log('Matrix of the hyperedge weights W: ')
        console.log(W)
        console.log('Incidence Matrix H: ')
        console.log(H)
        console.log('Matrix of the degree of hyperedge De: ')
        console.log(De)
        console.log('Matrix of the degree of hyperedge vertex Dv: ')
        console.log(Dv)
        console.log('Laplacian Matrix: ')
        console.log(Delta)*/ 

        this.$data.W = matrix2latex(W)
        this.$data.H = matrix2latex(H)
        this.$data.De = matrix2latex(De)
        this.$data.Dv = matrix2latex(Dv)
        this.$data.Delta = matrix2latex(Delta)
        this.$data.H_tran = matrix2latex(H_tran)
        this.$data.De_i = matrix2latex(De_inv)
      },
      deep: true
    }
  },
  updated(){
    var MathJax = getCurrentInstance()?.appContext.config.globalProperties.$MathJax;
    if(MathJax.isMathjaxConfig){
      MathJax.initMathjaxConfig();
    }
    MathJax.TypeSet();
  },
  mounted(){
    window.addEventListener('scroll', this.handleScroll);
    var MathJax = getCurrentInstance()?.appContext.config.globalProperties.$MathJax;
    if(MathJax.isMathjaxConfig){
      MathJax.initMathjaxConfig();
    }
    MathJax.TypeSet();
    var v_data = this.vertex_data;
        var vertexs = [
          this.vertex_data.vertex1.show,
          this.vertex_data.vertex2.show,
          this.vertex_data.vertex3.show,
          this.vertex_data.vertex4.show,
          this.vertex_data.vertex5.show
          ];
        var edges = [
          this.vertex_data.vertex1.edge,
          this.vertex_data.vertex2.edge,
          this.vertex_data.vertex3.edge,
          this.vertex_data.vertex4.edge,
          this.vertex_data.vertex5.edge
          ];
        var W = weightMatrix();
        var H = incidenceMatrix(vertexs, edges);
        var De = matrixHyperedge(H);
        var Dv = matrixVertex(W, H);
        var Delta = matrixLaplacian(W, H, De, Dv);
        var temp_H = matrix(H);
        var H_tran = temp_H.trans();
        var temp_De = matrix(De);
        var De_inv = temp_De.inv();
        for (var i = 0; i < De_inv.length; i++){
          for (var j = 0; j < De_inv[i].length; j++){
            De_inv[i][j] = De_inv[i][j].toFixed(4);
          }
        }

        this.$data.W = matrix2latex(W)
        this.$data.H = matrix2latex(H)
        this.$data.De = matrix2latex(De)
        this.$data.Dv = matrix2latex(Dv)
        this.$data.Delta = matrix2latex(Delta)
        this.$data.H_tran = matrix2latex(H_tran)
        this.$data.De_i = matrix2latex(De_inv)
  }

}
</script>


<style scoped>
.Box_W{
  width: 315px;
  height: 160px;
  background-color: #FFFAF0;
  border-radius: 10px;
}
.Box_H{
  width: 290px;
  height: 160px;
  background-color: #FFFAF0;
  border-radius: 10px;
}
.Box_Htran{
  height: 160px;
  background-color: #FFFAF0;
  border-radius: 10px;
}
.Box_Deinv{
  height: 110px;
  background-color: #FFFAF0;
  border-radius: 10px;
}
.Box_De{
  width: 290px;
  height: 110px;
  background-color: #FFFAF0;
  border-radius: 10px;
}
.Box_Dv{
  width: 290px;
  height: 160px;
  background-color: #FFFAF0;
  border-radius: 10px;
}
.Box_Delta{
  width: 380px;
  height: 215px;
  background-color: #EE6363;
  color:  #FFFAFA;
  border-radius: 10px;
}

</style>

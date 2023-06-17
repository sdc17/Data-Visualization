<!--
 * @FileDescription: 主页面框架划分，除了May其他人最好不要动这个文件！
 * @Author: May
 * @Date: 2022.04.04
 -->

<template>
  <!--标题-->
  <h1>Laplacian Matrix Calculator for Hypergraph</h1>
  <!--介绍拉普拉斯矩阵-->
  <n-divider />
  <n-collapse arrow-placement="right">
    <n-collapse-item title="What is Laplacian Matrix?" name="1">
      <Introduction msg="Welcome!"></Introduction>
    </n-collapse-item>
  </n-collapse>
  <n-divider />
  <div style="width: 22%; height: 100%; float: left;">
    <!--超图部分-->
    <div class = "Hypergraph_part">
      <Hypergraph></Hypergraph>
    </div>
    <!--表格部分-->
    <div class = "ETable_part">
      <ETable></ETable>
    </div>
    <div class = "VTable_part">
      <VTable></VTable>
    </div>
  </div>
  <!--矩阵计算部分-->
  <div class = "Matrix_part">
    <Matrix></Matrix>
  </div>
</template>

<script>
import Introduction from './components/Introduction.vue'
import Hypergraph from './components/Hypergraph.vue'
import VTable from './components/VTable.vue'
import ETable from './components/ETable.vue'
import Matrix from './components/Matrix.vue'

export default {
  name: 'App',
  components: {
    Introduction,
    Hypergraph,
    VTable,
    ETable,
    Matrix
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 94%;
  height: 94%;
  margin-left: 3%;
}
h1{
  text-align: center;
  font-size: 30px;
}
.Hypergraph_part{
  width: 200px;
  height: 200px;
  margin-left: 75px;
  margin-top: 70px;
}
.VTable_part{
  width: 330px;
  height: 250px;
}
.ETable_part{
  width: 330px;
  height: 180px;
}
.Matrix_part{
  width: 78%;
  height: 100%;
  float: left;
}
</style>

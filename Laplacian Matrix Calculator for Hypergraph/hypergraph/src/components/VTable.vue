<!--
 * @FileDescription: 点表+对角阵【张炜晨 石大川 史伊凡】
 * @Author: May
 * @Date: 2022.04.04
 -->
<template>
	<div class="vtable">
    <!--一些测试用的代码，之后记得删除-->
    <!--<n-button size="tiny" type="primary" color="#3CB371" v-on:click="test">Test</n-button>-->
    <!--测试代码到此为止-->
    <el-table :data="table_data" border style="width: 100%;">
      <el-table-column fixed prop="vertexs" label="顶点" width="80">
        <template #default="scope">
            <div style="display: flex; align-items: left;">
              {{scope.row.vertexs}}
            </div>
        </template>
      </el-table-column>
      <el-table-column prop="edges" label="超边" width="250">
        <template #default="scope">
          <div style="display: flex; align-items: left;">
            <el-tag 
                  closable
                  :key="item"
                  v-for="item in scope.row.edges"
                  :disable-transitions="false"
                  @close="handleClose(item,scope)"
                  :type="(item == '0' ? '' : 
                  (item == 'e1' ? 'danger' : 
                  (item == 'e2' ? '' : 
                  (item == 'e3' ? 'warning' : 'danger'))))"
                  >
                    {{ item }}
            </el-tag>
            <el-select placeholder="Select" size="small">
              <el-option
                v-for="item in scope.row.edge_option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
                @click.native="select_edge(item, scope)"
              />
            </el-select>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="matrix_text">
  </div>
</template>

<script>
import { getCurrentInstance, defineComponent, h, vShow } from 'vue'
function jsonChange(jsonData){
    var jsonEV = new Array();
    for(var v in jsonData){
        for(var e in jsonData[v]['edge']){
            if(jsonData[v]['edge'][e] in jsonEV){
                jsonEV[jsonData[v]['edge'][e]]['vertex'].push(v)
            }
            else{
                jsonEV[jsonData[v]['edge'][e]] = {vertex:[v]}
            }
        }
    }
    var key = Object.keys(jsonEV).sort();
    var new_json = new Array();
    for(var i = 0; i < key.length; i++) {
        new_json[key[i]] = jsonEV[key[i]]; 
    }
    return new_json
}
function json2table(jsonData){
  var table_data = [];
  for(var v in jsonData){
    if(jsonData[v]['show'] == true){
        var edge_option = [
        {
          value : 'e1',
          label : 'e1',
          disabled : false
        },
        {
          value : 'e2',
          label : 'e2',
          disabled : false
        },
        {
          value : 'e3',
          label : 'e3',
          disabled : false
        }]
        for(var i = 0; i < jsonData[v]['edge'].length; i++){
          if(jsonData[v]['edge'][i] == 'e1'){
            edge_option[0].disabled = true;
          }
          else if(jsonData[v]['edge'][i] == 'e2'){
            edge_option[1].disabled = true;
          }
          if(jsonData[v]['edge'][i] == 'e3'){
            edge_option[2].disabled = true;
          }
        }
        var pair = {vertexs: v, edges: jsonData[v]['edge'], edge_option: edge_option};
        table_data.push(pair);
      }
    }
  return table_data;
}

function table2json(tableData){
  // 初始化
  var jsonData = {
    vertex1: {
      show: false,
      edge: []
    },
    vertex2: {
      show: false,
      edge: []
    },
    vertex3: {
      show: false,
      edge: []
    },
    vertex4: {
      show: false,
      edge: []
    },
    vertex5: {
      show: false,
      edge: []
    }
  }
  // 遍历tableData的所有元素
  for(var i = 0;i < tableData.length; i++){
    var curr_v = tableData[i];
    if(curr_v.vertexs == 'vertex1'){
      jsonData.vertex1.show = true;
      jsonData.vertex1.edge = curr_v.edges;
    }
    else if(curr_v.vertexs == 'vertex2'){
      jsonData.vertex2.show = true;
      jsonData.vertex2.edge = curr_v.edges;
    }
    else if(curr_v.vertexs == 'vertex3'){
      jsonData.vertex3.show = true;
      jsonData.vertex3.edge = curr_v.edges;
    }
    else if(curr_v.vertexs == 'vertex4'){
      jsonData.vertex4.show = true;
      jsonData.vertex4.edge = curr_v.edges;
    }
    else if(curr_v.vertexs == 'vertex5'){
      jsonData.vertex5.show = true;
      jsonData.vertex5.edge = curr_v.edges;
    }
  }

  return jsonData;
}

export default {
  name: 'VTable',
  // 测试用代码begin
  data(){
    // 拿到数据
    var vertex_data = getCurrentInstance()?.appContext.config.globalProperties.$vertexs;
    // 将数据转换成{vertexs:'value', edges:'values'}的格式
    var table_data = json2table(vertex_data);
    var edges_option = ['e1','e2','e3']
    return {
      vertex_data : vertex_data,
      table_data: table_data,
      fromVTable: false,
      edges_option: edges_option,
    }
  },
  watch:{
    vertex_data:{
      handler(newVal){
        // console.log("HI");
        // console.log(this.test);
        if(this.fromVTable == false){
          this.table_data = json2table(newVal);
        }
        else{
          // console.log("表格变化！")
          this.fromVTable = false;
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleClose(item,scope){
      // console.log(`当前页: ${item},${scope.$index}`);
      if(item.disabled)
        return;
      this.table_data[scope.$index]['edge_option'][Number(item[1]) - 1].disabled = false;
      this.table_data[scope.$index]['edges'].splice(this.table_data[scope.$index]['edges'].indexOf(item), 1);

      // 这个地方不能直接让vertex_data = table2json(),这么实现会导致跟其他图表的数据交换出问题
      var json_data = table2json(this.table_data);
      // 没想到什么好的办法，只好一个一个对
      for(var vertex in this.vertex_data){
        if(json_data[vertex] != this.vertex_data[vertex]){
          this.fromVTable = true;
          this.vertex_data[vertex] = json_data[vertex];
        }
      }
    },
    select_edge(item, scope){
      // console.log(`当前页: ${item.value},${scope.$index}`);
      if(item.disabled)
        return;
      this.table_data[scope.$index]['edge_option'][Number(item.value[1]) - 1].disabled = true;
      this.table_data[scope.$index]['edges'].push(item.value);

      // 这个地方不能直接让vertex_data = table2json(),这么实现会导致跟其他图表的数据交换出问题
      var json_data = table2json(this.table_data);
      // 没想到什么好的办法，只好一个一个对
      for(var vertex in this.vertex_data){
        if(json_data[vertex] != this.vertex_data[vertex]){
          this.fromVTable = true;
          this.vertex_data[vertex] = json_data[vertex];
        }
      }
    }
  }
  // 测试用代码end
}
</script>

<style scoped>
.vtable{
  width : 100%;
  height: 100%;
}
</style>
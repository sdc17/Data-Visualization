<!--
 * @FileDescription: 点表+对角阵【张炜晨 石大川 史伊凡】
 * @Author: May
 * @Date: 2022.04.04
 -->
<template>
	<div class="etable">
    <!--一些测试用的代码，之后记得删除-->
    <!--<n-button size="tiny" type="primary" color="#3CB371" v-on:click="test">Test</n-button>-->
    <!--测试代码到此为止-->
    <el-table :data="table_data" border style="width: 100%;">
      <el-table-column fixed prop="edges" label="超边" width="80">
        <template #default="scope">
            <div style="display: flex; align-items: left;">
              {{scope.row.edges}}
            </div>
        </template>
      </el-table-column>
      <el-table-column prop="vertexs" label="顶点" width="250">
        <template #default="scope">
          <div style="display: flex; align-items: left;">
            <el-tag 
                  closable
                  :key="item"
                  v-for="item in scope.row.vertexs"
                  :disable-transitions="false"
                  @close="handleClose(item,scope)"
                  >
                    {{ item }}
            </el-tag>
            <el-select placeholder="Select" size="small">
              <el-option
                v-for="item in scope.row.vertex_option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
                @click.native="select_vertex(item, scope)"
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
const vertex2v = {
  'vertex1':'v1',
  'vertex2':'v2',
  'vertex3':'v3',
  'vertex4':'v4',
  'vertex5':'v5',
}
const v2vertex = {
  'v1':'vertex1',
  'v2':'vertex2',
  'v3':'vertex3',
  'v4':'vertex4',
  'v5':'vertex5',
}
import { getCurrentInstance, defineComponent, h, vShow } from 'vue'
function jsonChange(jsonData){
    var jsonEV = new Array();
    for(var v in jsonData){
        for(var e in jsonData[v]['edge']){
            var simv = vertex2v[v]
            if(jsonData[v]['edge'][e] in jsonEV){
                jsonEV[jsonData[v]['edge'][e]]['vertex'].push(simv)
            }
            else{
                jsonEV[jsonData[v]['edge'][e]] = {vertex:[simv]}
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
  for(var e in jsonData){
        var vertex_option = [
        {
          value : 'v1',
          label : 'v1',
          disabled : false
        },
        {
          value : 'v2',
          label : 'v2',
          disabled : false
        },
        {
          value : 'v3',
          label : 'v3',
          disabled : false
        },
        {
          value : 'v4',
          label : 'v4',
          disabled : false
        },
        {
          value : 'v5',
          label : 'v5',
          disabled : false
        }]
        for(var i = 0; i < jsonData[e]['vertex'].length; i++){
          if(jsonData[e]['vertex'][i] == 'v1'){
            vertex_option[0].disabled = true;
          }
          else if(jsonData[e]['vertex'][i] == 'v2'){
            vertex_option[1].disabled = true;
          }
          if(jsonData[e]['vertex'][i] == 'v3'){
            vertex_option[2].disabled = true;
          }
          if(jsonData[e]['vertex'][i] == 'v4'){
            vertex_option[3].disabled = true;
          }
          if(jsonData[e]['vertex'][i] == 'v5'){
            vertex_option[4].disabled = true;
          }
        }
        var pair = {edges: e, vertexs: jsonData[e]['vertex'], vertex_option: vertex_option};
        table_data.push(pair);
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
    var curr_e = tableData[i].edges;

    for(var j = 0;j < tableData[i].vertexs.length;j++){
      var fullv = v2vertex[tableData[i].vertexs[j]];

      jsonData[fullv].show = true
      jsonData[fullv]['edge'].push(curr_e);
    }
  }
  return jsonData;
}

export default {
  name: 'ETable',
  // 测试用代码begin
  data(){
    // 拿到数据
    var vertex_data = getCurrentInstance()?.appContext.config.globalProperties.$vertexs;
    // 将数据转换成{vertexs:'value', edges:'values'}的格式
    var table_data = json2table(jsonChange(vertex_data));
    var vertexs_option = ['vertex1','vertex2','vertex3','vertex4','vertex5']
    return {
      vertex_data : vertex_data,
      table_data: table_data,
      fromETable: false,
      vertexs_option: vertexs_option,
    }
  },
  watch:{
    vertex_data:{
      handler(newVal){
        // console.log("HI");
        // console.log(this.test);
        if(this.fromETable == false){
          this.table_data = json2table(jsonChange(newVal));
        }
        else{
          // console.log("表格变化！")
          this.fromETable = false;
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
      this.table_data[scope.$index]['vertex_option'][Number(item[1]) - 1].disabled = false;
      this.table_data[scope.$index]['vertexs'].splice(this.table_data[scope.$index]['vertexs'].indexOf(item), 1);

      // 这个地方不能直接让vertex_data = table2json(),这么实现会导致跟其他图表的数据交换出问题
      var json_data = table2json(this.table_data);
      // 没想到什么好的办法，只好一个一个对
      for(var vertex in this.vertex_data){
        if(json_data[vertex] != this.vertex_data[vertex]){
          this.fromETable = true;
          this.vertex_data[vertex] = json_data[vertex];
        }
      }
    },
    select_vertex(item, scope){
      // console.log(`当前页: ${item.value},${scope.$index}`);
      if(item.disabled)
        return;
      this.table_data[scope.$index]['vertex_option'][Number(item.value[1]) - 1].disabled = true;
      this.table_data[scope.$index]['vertexs'].push(item.value);

      // 这个地方不能直接让vertex_data = table2json(),这么实现会导致跟其他图表的数据交换出问题
      var json_data = table2json(this.table_data);
      // 没想到什么好的办法，只好一个一个对
      for(var vertex in this.vertex_data){
        if(json_data[vertex] != this.vertex_data[vertex]){
          this.fromETable = true;
          this.vertex_data[vertex] = json_data[vertex];
        }
      }
    }
  }
  // 测试用代码end
}
</script>

<style scoped>
.etable{
  width : 100%;
  height: 100%;
}
</style>
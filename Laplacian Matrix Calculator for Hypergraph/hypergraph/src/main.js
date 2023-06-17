import { createApp } from 'vue'
import App from './App.vue'
// 添加element-ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 添加naive-ui
import naive from 'naive-ui'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import './main.css'
// MathJax引入
import MathJax from './components/js/MathJax.js'

const app = createApp(App)
app.use(naive)
app.use(ElementPlus)
app.config.globalProperties.$MathJax = MathJax
app.config.globalProperties.$vertexs = {
	vertex1: {
		show: true,
		edge: ["e1"]
	},
	vertex2: {
		show: true,
		edge: ["e2"]
	},
	vertex3: {
		show: true,
		edge: ["e3"]
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
app.mount("#app")
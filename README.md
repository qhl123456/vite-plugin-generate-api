# vite-plugin-generate-api

# 介绍
根据api文件夹自动生成api的ts类型

# 使用说明
在使用vue/react+ts开发时,我们把api挂载到全局后,例如封装好axios后需要按模块划分请求,此时会创建一个modules文件夹,里面存放各个模块的请求,**当把module所有的文件都动态挂载到proxy实例上时,我们可以通过proxy.$api.文件名.请求名去发起请求**

**例如：proxy.$api.test_api.test()**

![image-20240531151937051](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20240531151937051.png)

![image-20240531152211563](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20240531152211563.png)

## 1.动态加载所有api模块并挂载到proxy对象上

```typescript
// src/api/index.ts
// 动态加载module下所有的文件
const files = import.meta.globEager('./module/*.ts')
const models= {}
for (const key in files) {
  const keys = {}


  for (const v in files[key]) {
    Object.assign(keys, { [v]: files[key][v] })
  }
    
  models[key.replace(/(\.\/module\/|\.ts)/g, '')] = keys
}
export default models
```

```typescript
// src/main.ts
import { createApp } from 'vue'
import api from '@/api'
const app = createApp(App)
app.config.globalProperties.$api = api
```

```typescript
//src/xxx.vue
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()!

async function foo(){
    const res = await proxy.$api.xxx()
}

```

## 2.为proxy添加类型提示

​	第一点我们已经完成把所有的请求挂载proxy上并且可以通过proxy.$api.xxx.xxx去发起请求,为proxy添加拥有$api的类型很简单,**只需要在xxx.d.ts文件声明@vue/runtime-core添加类型即可**

```typescript
//src/xx.d.ts
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: GlobalApi.Api
  }
}
```

## 3.为$api添加类型提示

### 	3.1在api文件下新建Api.d.ts文件,里面声明所需要的文件类型,如下

```typescript
declare namespace GlobalApi {
  interface Api {
    test_api: typeof import('@/api/module/test_api')
  }
}

```

### 	3.2使用时出现代码提示

![image-20240531161322083](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20240531161322083.png)

![image-20240531161334046](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20240531161334046.png)

## 4.自动生成Api.d.ts文件内容

**以上我们在使用时,Api.d.ts文件内容需要我们手动填写,假如后续modules文件夹文件越来越多,我们希望在改动modules文件夹下的内容时可以自动生成Api.d.ts文件内容**



# 安装教程

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path' 
import viteGenerateApiPlugin from 'vite-plugin-generate-api'

const pathResolve = (dir:string) => resolve(__dirname, '.', dir)
export default defineConfig({
  plugins:[
    viteGenerateApiPlugin({
      fileName: pathResolve('src/api/Api.d.ts'),
      folderName: pathResolve('src/api/module'),
    }),
  ],
  // .....
});

```



# 软件架构

1.  nodejs
2.  vite
3.  typeScript

# 参与贡献

1.  coder-cc

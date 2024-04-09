const fs = require('fs');
const path = require('path');

//递归删除文件夹
function deleteFolderRecursive(filepath) {
  if (fs.existsSync(filepath)) {
    if (fs.lstatSync(filepath).isDirectory()) {  
      fs.readdirSync(filepath).forEach((file, index) => {
        const curPath = path.join(filepath, file);
        if (fs.lstatSync(curPath).isDirectory()) { 
          deleteFolderRecursive(curPath); // 递归删除子文件夹
        } else { 
          fs.unlinkSync(curPath); // 删除文件
        }
      });
      fs.rmdirSync(filepath); // 删除文件夹
    } else {
      fs.unlinkSync(filepath); // 删除文件
    }
  }
}

// 删除 'src/components' 和 'src/views' 文件夹内的示例文件
['components', 'views','assets'].forEach(dir => {
  const dirPath = path.join(__dirname, 'src', dir);
  fs.readdirSync(dirPath).forEach(file => {
    deleteFolderRecursive(path.join(dirPath, file));
  });
});

// 清理 'src/App.vue' 内的示例组件引用
const appVuePath = path.join(__dirname, 'src', 'App.vue');
let appVueContent = fs.readFileSync(appVuePath, 'utf-8');
appVueContent = appVueContent.replace(/<template>[\s\S]*<\/template>/, '<template>\n  <div id="app">\n  </div>\n</template>');
appVueContent = appVueContent.replace(/<script>[\s\S]*<\/script>/, '<script>\n\n</script>');
appVueContent = appVueContent.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/, '<style scoped>\n<\/style>');
fs.writeFileSync(appVuePath, appVueContent);

// 清理 'src/router/index.js' 内的示例组件引用
const routerPath = path.join(__dirname, 'src', 'router', 'index.js');
let routerContent = fs.readFileSync(routerPath, 'utf-8');
routerContent = routerContent.replace(/import.*from '..\/components'.*\n/g, '');
routerContent = routerContent.replace(/import.*from '..\/views'.*\n/g, '');
routerContent = routerContent.replace(/path: '\/'.*component:[^]*\}\],/g, 'path: \'/\', name: \'Home\', routes: [],');
fs.writeFileSync(routerPath, routerContent);

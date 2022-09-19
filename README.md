# zju-grs-ics

将浙江大学研究生课表转换为 ics 文件，进而导入到 Google 日历（或者其他日历）里面。

## 使用说明

### 安装依赖

```bash
npm i
# 或者使用 yarn
yarn
```

### 获取 grs 网站 Cookie

前往[我的课程](http://grs.zju.edu.cn/py/page/student/grkcgl.htm)或者[我的课表](http://grs.zju.edu.cn/py/page/student/grkcb.htm)页面，在已经登陆的情况下，按 F12 打开 devtools 里面的 Network 标签页，刷新页面，然后找到第一个请求，复制 Request Headers 里面的 Cookie 字段：

![获取 grs 网站 Cookie](https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/20200913091014.png)

修改 [config.ts](./src/config.ts)，在其中加入你的 Cookie。

另外，其他配置可以按照学期实际情况自行设置。

### 运行脚本生成 ics 文件

运行下面的指令，会在 output 目录下生成一个 `courses.ics` 文件，包含了所有的课程信息。

```bash
npm run generate
# 或者使用 yarn
yarn generate
```

### 将 ics 导入到日历（以 Google 日历为例）

前往：https://calendar.google.com/

点击右上角的设置图标，点击「设置」，在新页面中点击「导入和导出」，选择 output 目录下生成的 `courses.ics` 文件即可。

![导入到日历](https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/20200913165802.png)

👍 大功告成，你可以使用 Google 日历来查看自己的课表啦：

<img src="https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/20200913165931.png" alt="Google 日历课表">

<img src="https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/20200913170139.png" alt="手机查看 Google 日历" height=380>

## 注意事项

- 如果想删除已经导入的课程，可以使用 [GCalToolkit](https://www.gcaltoolkit.com/) 批量删除，按照 Description 搜索 zju-grs-ics 即可过滤并删除所有已经导入的课程。
- 如果生成的 `courses.ics` 文件内容为 `null`，说明 Cookie 已经过期，请更换你的 Cookie。另外 Cookie 请注意保密。

## 相关资源

1. [浙江大学2020-2021学年秋冬学期校历](http://www.cst.zju.edu.cn/_upload/article/files/d0/3e/5f26bbae4e1cb3bafdb72161901f/eaef074d-ecc6-4380-8da8-8c120a812072.pdf)
2. [浙江大学2022-2023学年秋冬学期校历](http://www.cst.zju.edu.cn/_upload/article/files/1a/e2/6b5554d740158b640460b14b6b20/d406d14b-6f9b-4cb0-9bd7-e02a84a1761b.pdf)
3. [GCalToolkit - 用于 Google 日历的批量操作工具](https://www.gcaltoolkit.com/)
4. [ICSviewer](https://marc.vos.net/downloads/icsviewer/)

### 查看我的课表

- 我的课程：http://grs.zju.edu.cn/py/page/student/grkcgl.htm
- 2020 - 2021 学年秋：http://grs.zju.edu.cn/py/page/student/grkcb.htm?xj=13&xn=2020
- 2020 - 2021 学年冬：http://grs.zju.edu.cn/py/page/student/grkcb.htm?xj=14&xn=2020

### 浙大校历

上课时间如下：

![浙大上课时间](https://picgo-1256492673.cos.ap-chengdu.myqcloud.com/20200913084937.png)

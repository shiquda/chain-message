# 部署指南

## 先决条件

首先，确保你需要有：

1. 一个Web3钱包，并且有一定数额的ETH（建议不少于2$）
2. 一个Cloudflare免费账户。最好有一个属于你自己的域名（因为部分Cloudflare域名被GFW封锁，需要用个人域名做转发）

如果你不太清楚什么是Web3钱包，请看[这里](https://ethereum.org/zh/wallets/)。这里推荐使用OKX或者MetaMask钱包。

## 部署流程

### 智能合约

前往[Remix](https://remix.ethereum.org/)，这是一个在线的智能合约的IDE。新建文件并粘贴 [Solidity 代码](/solidity/message.sol)。

![](/imgs/PixPin_2025-04-21_13-36-39.png)

保存文件后，在左侧选择部署选项卡，连接你的Web3钱包后，点击部署。注意，如果你的钱包没有出现，可以取All Wallet中查找。

![](/imgs/PixPin_2025-04-21_13-39-53.png)

点击Deploy后，确认Remix的提示弹窗，然后再在Web3钱包中确认交易。

![](/imgs/PixPin_2025-04-21_13-43-00.png)

确认交易后，你应该就可以在Remix的控制台查看到你刚刚部署的合约地址，如果没有的话，也可以查看你的Web3钱包的历史交易。这个以`0x`开头的合约地址需要记下来，后面需要用到。（注意，不是你的钱包地址）

### Cloudflare Workers

这一部分是为了让用户能够免鉴权地进行留言Event log的查询。

你需要前往 <https://etherscan.io/> 注册一个账户。注册完成后，前往[API面板](https://etherscan.io/apidashboard)，点击`+Add`添加 API Key 并保存，后面会用上。

接下来前往Cloudflare进行Workers的配置，你需要在Cloudflare的左侧找到Workers 和Pages，然后创建 > Workers > Hello world > 填写名称并部署 > 进入修改源码，粘贴[worker.js](/cloudflare/worker.js)的代码。

然后找到Worker的设置 > 变量和机密 > 变量和机密 > 添加，添加`CONTRACT_ADDRESS`和`ETHERSCAN_API_KEY`这两个环境变量，这二者在前面已经获取。

如果需要配置个人域名转发，你需要在CF进入域名的管理页面，然后找到左侧的“Workers 路由”，选择添加路由并绑定前面创建的Worker。

![](/imgs/gVr1YanhzPQtLH6.png)

### 静态网站部署

静态网站部署有多种方式。

方式一：克隆本仓库，并且在本地生成静态网页，再将静态网页自行部署。需要有node环境。

```bash
git clone https://github.com/shiquda/chain-message.git
cd chain-message
pnpm install
```

然后参考`.env.example`填写需要的环境变量至`.env`。可以使用`pnpm dev`进行测试，一切就绪后，使用下面的命令进行构建：

```bash
pnpm build
```

构建成功后，会在`/dist`生成静态网站文件。

方式二（推荐）：使用Cloudflare Pages进行部署和托管。

先使用你的Github账户Fork本仓库。

在Cloudflare中进入`Workers 和 Pages`，点击“创建”、“连接到Git”，连接你的Github账户，选择Chain Message仓库。

参考下面的填法：

![](/imgs/PixPin_2025-04-21_14-06-01.png)

部署成功后，可以通过Cloudflare提供的域名访问了，但是这个域名会被GFW封锁。你可以继续通过自定义域名的方式进行绕过，这里就不再赘述了。

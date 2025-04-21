import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  okxWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  binanceWallet
} from '@rainbow-me/rainbowkit/wallets';

const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_ID

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [walletConnectWallet, metaMaskWallet, okxWallet, ],
    },
    {
      groupName: 'Others',
      wallets: [coinbaseWallet, binanceWallet],
    },
  ],
  { appName: "Chain Message", projectId: walletConnectProjectId}
);


export const config = createConfig({
  connectors,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
}) 
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "./config";
import { MessageBoard } from "./components/MessageBoard";
import QA from "./components/QA";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const queryClient = new QueryClient();

function App() {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<div className="min-h-screen">
						<header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-glass border-b border-glass-border">
							<div className="max-w-4xl mx-auto px-4 h-18 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<img src="/icon.png" alt="logo" className="w-8 h-8" />
									<h1 className="text-2xl font-bold text-white">
										Chain Message
									</h1>
								</div>
								<div className="glass-card px-4 py-2">
									<ConnectButton />
								</div>
							</div>
						</header>
						<main className="pt-20 pb-8 px-4">
							<div className="max-w-4xl mx-auto">
								<MessageBoard />
							</div>
						</main>
						<footer className="max-w-4xl mx-auto px-4 pb-8">
							<QA />
						</footer>
					</div>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}

export default App;

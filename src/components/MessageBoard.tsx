import { useState, useEffect } from "react";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faWallet,
	faUser,
	faMessage,
	faPaperPlane,
	faSpinner,
	faChevronLeft,
	faChevronRight,
	faClock,
	faRefresh,
	faEye,
	faEdit,
	faComments,
	faList,
	faCheckCircle,
	faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { decodeEventLog } from "viem";
import type { Abi } from "viem";
import abi from "../../solidity/abi.json";

const CONTRACT_ADDRESS = import.meta.env
	.VITE_SMART_CONTRACT_ADDRESS as `0x${string}`;
const fromBlock = import.meta.env.VITE_START_BLOCK;

interface Log {
	address: `0x${string}`;
	topics: [`0x${string}`, ...`0x${string}`[]];
	data: `0x${string}`;
	blockNumber: `0x${string}`;
	transactionHash: `0x${string}`;
}

interface DecodedLog {
	messageId: bigint;
	sender: `0x${string}`;
	name: string;
	content: string;
	timestamp: bigint;
	transactionHash: `0x${string}`;
}

export function MessageBoard() {
	const { isConnected } = useAccount();
	const [nickname, setNickname] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [logs, setLogs] = useState<Log[]>([]);
	const [decodedLogs, setDecodedLogs] = useState<DecodedLog[]>([]);
	const [showPreview, setShowPreview] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);
	const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(
		null
	);

	const fetchLogs = async () => {
		setLoading(true);
		try {
			const workerUrl = import.meta.env.VITE_WORKER_URL;
			const response = await fetch(
				`${workerUrl}?address=${CONTRACT_ADDRESS}&startBlock=${fromBlock}`
			);
			const data = await response.json();
			if (data.result) {
				const typedLogs = data.result.map((log: any) => ({
					...log,
					address: log.address as `0x${string}`,
					topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
					data: log.data as `0x${string}`,
					blockNumber: log.blockNumber as `0x${string}`,
					transactionHash: log.transactionHash as `0x${string}`,
				}));
				setLogs(typedLogs);
				// 解析日志数据
				const decoded = typedLogs
					.map((log: Log) => {
						try {
							const decoded = decodeEventLog({
								abi: abi as Abi,
								data: log.data,
								topics: log.topics,
							});
							const args = decoded.args as unknown as {
								messageId: bigint;
								sender: `0x${string}`;
								name: string;
								content: string;
								timestamp: bigint;
							};
							return {
								messageId: args.messageId,
								sender: args.sender,
								name: args.name,
								content: args.content,
								timestamp: args.timestamp,
								transactionHash: log.transactionHash,
							};
						} catch (error) {
							console.error("Error decoding log:", error);
							return null;
						}
					})
					.filter(Boolean) as DecodedLog[];
				setDecodedLogs(decoded);
			}
		} catch (error) {
			console.error("Error fetching logs:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, []);

	const { writeContract, isSuccess, data } = useContractWrite();

	useEffect(() => {
		if (isSuccess && data) {
			setLastTransactionHash(data);
			setContent("");
			setNickname("");
		}
	}, [isSuccess, data]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) return;
		writeContract({
			address: CONTRACT_ADDRESS,
			abi,
			functionName: "postMessage",
			args: [nickname || "匿名", content],
		});
	};

	const totalPages = Math.ceil(decodedLogs.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentLogs = decodedLogs.slice(startIndex, endIndex);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	return (
		<div className="space-y-8">
			{lastTransactionHash && (
				<div className="glass-card p-4 bg-green-900/20 border border-green-500/20">
					<div className="flex items-center gap-2 text-green-400">
						<FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
						<span>留言发送成功！</span>
					</div>
					<div className="mt-2 text-sm text-gray-300">
						<a
							href={`https://etherscan.io/tx/${lastTransactionHash}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-primary hover:text-primary-hover transition-colors">
							<FontAwesomeIcon icon={faExternalLinkAlt} />
							点击查看交易详情
						</a>
					</div>
				</div>
			)}
			<div className="glass-card p-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<FontAwesomeIcon
							icon={faComments}
							className="text-primary text-xl"
						/>
						<h2 className="text-xl font-bold text-white">链上留言</h2>
					</div>
					<button
						onClick={fetchLogs}
						disabled={loading}
						className="glass-button flex items-center gap-2">
						{loading ? (
							<>
								<FontAwesomeIcon icon={faSpinner} className="animate-spin" />
								加载中...
							</>
						) : (
							<>
								<FontAwesomeIcon icon={faRefresh} />
								刷新留言
							</>
						)}
					</button>
				</div>
				<div className="space-y-4">
					{currentLogs.map((log, index) => (
						<div key={index} className="glass-card p-4">
							<div className="flex justify-between items-start mb-2">
								<div className="flex items-center gap-2">
									<FontAwesomeIcon icon={faUser} className="text-primary" />
									<span className="font-medium text-white">
										{log.name || "匿名"}
									</span>
								</div>
								<a
									href={`https://etherscan.io/tx/${log.transactionHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
									<FontAwesomeIcon icon={faEye} />
									查看交易
								</a>
							</div>
							<div
								className="prose prose-invert prose-sm max-w-none
								prose-headings:text-primary prose-h1:text-2xl prose-h2:text-xl
								prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-primary-hover
								prose-strong:text-white prose-code:text-primary prose-code:bg-gray-800/50
								prose-blockquote:border-l-primary prose-blockquote:text-gray-300
								prose-pre:bg-gray-800/50">
								<ReactMarkdown>{log.content}</ReactMarkdown>
							</div>
							<div className="text-sm text-gray-400 mt-2 flex items-center gap-2">
								<FontAwesomeIcon icon={faClock} />
								{new Date(Number(log.timestamp) * 1000).toLocaleString()}
							</div>
						</div>
					))}
				</div>
				{decodedLogs.length > itemsPerPage && (
					<div className="flex justify-center items-center gap-2 mt-4">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="glass-button px-3 py-1">
							<FontAwesomeIcon icon={faChevronLeft} />
						</button>
						<span className="text-white flex items-center gap-2">
							<FontAwesomeIcon icon={faList} />第 {currentPage} 页，共{" "}
							{totalPages} 页
						</span>
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="glass-button px-3 py-1">
							<FontAwesomeIcon icon={faChevronRight} />
						</button>
					</div>
				)}
			</div>

			{isConnected ? (
				<form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-300 flex items-center gap-2">
							<FontAwesomeIcon icon={faUser} />
							昵称（可选）
						</label>
						<input
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							className="glass-input w-full bg-gray-800/50 border-gray-700"
							placeholder="匿名"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-300 flex items-center gap-2">
							<FontAwesomeIcon icon={faMessage} />
							留言内容
						</label>
						<div className="space-y-2">
							<div className="flex justify-end">
								<button
									type="button"
									onClick={() => setShowPreview(!showPreview)}
									className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
									<FontAwesomeIcon icon={showPreview ? faEdit : faEye} />
									{showPreview ? "编辑" : "预览"}
								</button>
							</div>
							{showPreview ? (
								<div
									className="glass-card p-4 prose prose-invert prose-sm max-w-none
									prose-headings:text-primary prose-h1:text-2xl prose-h2:text-xl
									prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-primary-hover
									prose-strong:text-white prose-code:text-primary prose-code:bg-gray-800/50
									prose-blockquote:border-l-primary prose-blockquote:text-gray-300
									prose-pre:bg-gray-800/50">
									<ReactMarkdown>{content}</ReactMarkdown>
								</div>
							) : (
								<textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									className="glass-input w-full h-32 bg-gray-800/50 border-gray-700"
									placeholder="支持 Markdown 格式"
									required
								/>
							)}
						</div>
					</div>
					<button
						type="submit"
						className="glass-button w-full flex items-center justify-center gap-2">
						<FontAwesomeIcon icon={faPaperPlane} />
						发布留言
					</button>
				</form>
			) : (
				<div className="glass-card p-6 space-y-4 relative">
					<div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
						<div className="text-center space-y-4">
							<FontAwesomeIcon
								icon={faWallet}
								className="text-4xl text-primary"
							/>
							<p className="text-white font-medium">请先连接钱包以发布留言</p>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-300 flex items-center gap-2">
							<FontAwesomeIcon icon={faUser} />
							昵称（可选）
						</label>
						<input
							className="glass-input w-full bg-gray-800/50 border-gray-700"
							placeholder="匿名"
							disabled
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-300 flex items-center gap-2">
							<FontAwesomeIcon icon={faMessage} />
							留言内容
						</label>
						<textarea
							className="glass-input w-full h-32 bg-gray-800/50 border-gray-700"
							placeholder="支持 Markdown 格式"
							disabled
						/>
					</div>
					<button
						className="glass-button w-full flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
						disabled>
						<FontAwesomeIcon icon={faPaperPlane} />
						发布留言
					</button>
				</div>
			)}
		</div>
	);
}

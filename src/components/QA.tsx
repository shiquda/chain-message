import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faQuestion } from "@fortawesome/free-solid-svg-icons";

const QA: React.FC = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleDetails = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold text-white mb-4 text-center flex items-center gap-2">
				<FontAwesomeIcon icon={faQuestion} />
				Q&A
			</h2>
			
			{/* Question 1 */}
			<div className="glass-card p-4 overflow-hidden">
				<button
					onClick={() => toggleDetails(0)}
					className="w-full font-bold text-white cursor-pointer flex justify-between items-center">
					<span>Chain Message和其他留言系统的区别是什么？</span>
					<FontAwesomeIcon
						icon={openIndex === 0 ? faChevronUp : faChevronDown}
						className={`ml-2 transform transition-transform duration-300 ${openIndex === 0 ? 'rotate-180' : 'rotate-0'}`}
					/>
				</button>
				<div
					className={`mt-2 text-white overflow-hidden transition-all duration-300 ease-in-out ${openIndex === 0 ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
					Chain Message 是一个基于区块链的留言系统，你的留言将被永久存储在区块链上，而传统评论系统通常依赖于中心化服务器，这意味着他人可能删除或者篡改你的留言。
				</div>
			</div>

			{/* Question 2 */}
			<div className="glass-card p-4 overflow-hidden">
				<button
					onClick={() => toggleDetails(1)}
					className="w-full font-bold text-white cursor-pointer flex justify-between items-center">
					<span>你可以删除我的留言吗？</span>
					<FontAwesomeIcon
						icon={openIndex === 1 ? faChevronUp : faChevronDown}
						className={`ml-2 transform transition-transform duration-300 ${openIndex === 1 ? 'rotate-180' : 'rotate-0'}`}
					/>
				</button>
				<div
					className={`mt-2 text-white overflow-hidden transition-all duration-300 ease-in-out ${openIndex === 1 ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
					<strong>由于Chain Message基于区块链技术，一旦留言被发布，就无法被删除或修改，哪怕是你或者我。</strong>即使我下线了网站，在区块链上仍然会保留你的留言记录。因此，在留言前请认真确认。
				</div>
			</div>

			{/* Question 3 */}
			<div className="glass-card p-4 overflow-hidden">
				<button
					onClick={() => toggleDetails(2)}
					className="w-full font-bold text-white cursor-pointer flex justify-between items-center">
					<span>一次留言需要花费多少钱？</span>
					<FontAwesomeIcon
						icon={openIndex === 2 ? faChevronUp : faChevronDown}
						className={`ml-2 transform transition-transform duration-300 ${openIndex === 2 ? 'rotate-180' : 'rotate-0'}`}
					/>
				</button>
				<div
					className={`mt-2 text-white overflow-hidden transition-all duration-300 ease-in-out ${openIndex === 2 ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
					每次留言需要支付少量的Gas费用，具体金额取决于当前网络拥堵情况，你可以在交互的时候通过钱包插件查看。在我测试的情况下，大约折合人民币5毛钱。
				</div>
			</div>

			{/* Question 4 */}
			<div className="glass-card p-4 overflow-hidden">
				<button
					onClick={() => toggleDetails(3)}
					className="w-full font-bold text-white cursor-pointer flex justify-between items-center">
					<span>留言会泄露到我的个人信息吗？</span>
					<FontAwesomeIcon
						icon={openIndex === 3 ? faChevronUp : faChevronDown}
						className={`ml-2 transform transition-transform duration-300 ${openIndex === 3 ? 'rotate-180' : 'rotate-0'}`}
					/>
				</button>
				<div
					className={`mt-2 text-white overflow-hidden transition-all duration-300 ease-in-out ${openIndex === 3 ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
					除非你在留言时提供了你的个人信息，否则在区块链上只能追溯到你的钱包地址，但不知道你是谁。
				</div>
			</div>

			{/* Question 5 */}
			<div className="glass-card p-4 overflow-hidden">
				<button
					onClick={() => toggleDetails(4)}
					className="w-full font-bold text-white cursor-pointer flex justify-between items-center">
					<span>我也想搞一个这样的留言区，怎么做？</span>
					<FontAwesomeIcon
						icon={openIndex === 4 ? faChevronUp : faChevronDown}
						className={`ml-2 transform transition-transform duration-300 ${openIndex === 4 ? 'rotate-180' : 'rotate-0'}`}
					/>
				</button>
				<div
					className={`mt-2 text-white overflow-hidden transition-all duration-300 ease-in-out ${openIndex === 4 ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
					你可以在 Chain Message 的 Github 仓库中找到所有源代码（包括前端网站、Cloudflare Workers和智能合约）和部署指南：<a href="https://github.com/your-repo" className="text-blue-400 underline">Github仓库</a>。
				</div>
			</div>
		</div>
	);
};

export default QA;

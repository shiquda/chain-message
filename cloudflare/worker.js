// worker.js
export default {
    async fetch(request, env) {
        // 处理预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');
        const startBlock = searchParams.get('startBlock');

        if (!address || !startBlock) {
            return new Response('Missing parameters', {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            });
        }

        // 可选环境变量：合约地址，防止接口盗刷
        const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS?.toLowerCase();
        if (CONTRACT_ADDRESS && address.toLowerCase() !== CONTRACT_ADDRESS) {
            return new Response('Forbidden', {
                status: 403,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            });
        }

        const params = new URLSearchParams({
            module: 'logs',
            action: 'getLogs',
            address: address,
            fromBlock: startBlock,
            apikey: env.ETHERSCAN_API_KEY
        });
        const response = await fetch(`https://api.etherscan.io/api?${params.toString()}`);

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    },
};
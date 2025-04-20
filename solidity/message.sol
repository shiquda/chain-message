// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventBasedMessageKeeper {
    // 使用嵌套事件存储留言内容（支持Markdown和匿名）
    event MessagePosted(
        uint256 indexed messageId, // 留言ID（可索引）
        address indexed sender, // 发送者地址（可索引）
        string name, // 留言者名字（或"Anonymous"）
        string content, // Markdown内容
        uint256 timestamp // 区块时间戳
    );

    // 计数器用于生成唯一ID（仅需1个状态变量）
    uint256 private _messageCounter;

    // 发布留言（全部数据存事件，无状态存储）
    function postMessage(string memory _name, string memory _content) public {
        unchecked {
            // 安全计数（Solidity 0.8+默认检查算术溢出）
            _messageCounter++;
        }

        emit MessagePosted(
            _messageCounter,
            msg.sender,
            bytes(_name).length == 0 ? "Anonymous" : _name,
            _content,
            block.timestamp
        );
    }

    // 获取总留言数量（需依赖链下索引）
    function getMessageCount() public view returns (uint256) {
        return _messageCounter;
    }
}
